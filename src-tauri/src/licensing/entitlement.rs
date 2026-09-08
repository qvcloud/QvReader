use super::crypto;
use ring::signature::{self, KeyPair};
use serde::{Deserialize, Serialize};

pub const CURRENT_SCHEMA_VERSION: u32 = 1;
pub const EXPECTED_ISSUER: &str = "qvreader";

// Public verification keys embedded in client (public keys only; no private keys in client)
// Key 1: Official production verification key (Ed25519 public key, 32 bytes hex)
pub const OFFICIAL_PUBLIC_KEY_V1_ID: &str = "qv-key-1";
pub const OFFICIAL_PUBLIC_KEY_V1_HEX: &str =
    "a5c898c6081498ec5bb8d1502faad9c9fa6a8eb330c6a5a228308cfdc5bf6367";

// Key 2: Public test fixture verification key
pub const TEST_PUBLIC_KEY_V1_ID: &str = "qv-test-key-1";
pub const TEST_PUBLIC_KEY_V1_HEX: &str =
    "6a54054a1a4f009f4435cefc364654c86e08c4e09f582fa6cf86c12c416e7dd7";

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct SignedEntitlement {
    #[serde(rename = "schemaVersion")]
    pub schema_version: u32,
    #[serde(rename = "entitlementId")]
    pub entitlement_id: String,
    pub edition: String,
    #[serde(rename = "deviceIdHash")]
    pub device_id_hash: String,
    #[serde(rename = "issuedAt")]
    pub issued_at: u64,
    #[serde(rename = "expiresAt")]
    pub expires_at: Option<u64>,
    pub issuer: String,
    #[serde(rename = "keyId")]
    pub key_id: String,
    pub signature: String,
    /// Display-only customer email surfaced at activation time. Deliberately NOT
    /// part of [`SignedEntitlement::canonical_payload`], so it is unsigned display
    /// metadata: it never influences entitlement verification. Optional to stay
    /// backward compatible with previously persisted entitlements that lack it.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub customer_email: Option<String>,
}

impl SignedEntitlement {
    /// Computes the canonical byte sequence over which the signature is produced and verified
    pub fn canonical_payload(&self) -> Vec<u8> {
        let payload = format!(
            "{}:{}:{}:{}:{}:{}:{}",
            self.schema_version,
            self.entitlement_id,
            self.edition,
            self.device_id_hash,
            self.issued_at,
            self.expires_at.unwrap_or(0),
            self.issuer
        );
        payload.into_bytes()
    }

    /// Verifies the entitlement against embedded trusted public keys and local machine state
    pub fn verify(&self) -> Result<(), EntitlementVerificationError> {
        // 1. Check schema version
        if self.schema_version != CURRENT_SCHEMA_VERSION {
            return Err(EntitlementVerificationError::UnsupportedSchema(self.schema_version));
        }

        // 2. Check issuer
        if self.issuer != EXPECTED_ISSUER {
            return Err(EntitlementVerificationError::InvalidIssuer(self.issuer.clone()));
        }

        // 3. Check edition
        if self.edition != "pro" {
            return Err(EntitlementVerificationError::InvalidEdition(self.edition.clone()));
        }

        // 4. Check device binding
        let current_fp = crypto::get_device_fingerprint();
        if self.device_id_hash != current_fp {
            return Err(EntitlementVerificationError::DeviceMismatch);
        }

        // 5. Check expiration if present
        if let Some(exp) = self.expires_at {
            let now = std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .map(|d| d.as_secs())
                .unwrap_or(0);
            if now > exp {
                return Err(EntitlementVerificationError::Expired);
            }
        }

        // 6. Look up trusted public key
        let public_key_hex = match self.key_id.as_str() {
            OFFICIAL_PUBLIC_KEY_V1_ID => OFFICIAL_PUBLIC_KEY_V1_HEX.to_string(),
            TEST_PUBLIC_KEY_V1_ID => {
                #[cfg(any(test, debug_assertions))]
                {
                    if let Some(k) = TEST_PUBLIC_KEY.with(|k| k.borrow().clone()) {
                        k
                    } else {
                        TEST_PUBLIC_KEY_V1_HEX.to_string()
                    }
                }
                #[cfg(not(any(test, debug_assertions)))]
                TEST_PUBLIC_KEY_V1_HEX.to_string()
            }
            _ => return Err(EntitlementVerificationError::UnknownKeyId(self.key_id.clone())),
        };

        let public_key_bytes = hex::decode(&public_key_hex)
            .map_err(|_| EntitlementVerificationError::MalformedKey)?;

        let sig_bytes = hex::decode(&self.signature)
            .map_err(|_| EntitlementVerificationError::MalformedSignature)?;

        // 7. Verify cryptographic signature with ring::signature::ED25519
        let peer_public_key = signature::UnparsedPublicKey::new(
            &signature::ED25519,
            public_key_bytes,
        );

        peer_public_key
            .verify(&self.canonical_payload(), &sig_bytes)
            .map_err(|_| EntitlementVerificationError::BadSignature)?;

        Ok(())
    }
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum EntitlementVerificationError {
    UnsupportedSchema(u32),
    InvalidIssuer(String),
    InvalidEdition(String),
    DeviceMismatch,
    Expired,
    UnknownKeyId(String),
    MalformedKey,
    MalformedSignature,
    BadSignature,
}

impl std::fmt::Display for EntitlementVerificationError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::UnsupportedSchema(v) => write!(f, "Unsupported schema version: {}", v),
            Self::InvalidIssuer(i) => write!(f, "Invalid entitlement issuer: {}", i),
            Self::InvalidEdition(e) => write!(f, "Invalid edition: {}", e),
            Self::DeviceMismatch => write!(f, "Entitlement device binding mismatch"),
            Self::Expired => write!(f, "Entitlement has expired"),
            Self::UnknownKeyId(k) => write!(f, "Unknown public key ID: {}", k),
            Self::MalformedKey => write!(f, "Malformed public key bytes"),
            Self::MalformedSignature => write!(f, "Malformed signature hex"),
            Self::BadSignature => write!(f, "Cryptographic signature verification failed"),
        }
    }
}

impl std::error::Error for EntitlementVerificationError {}

#[cfg(any(test, debug_assertions))]
std::thread_local! {
    static TEST_PUBLIC_KEY: std::cell::RefCell<Option<String>> = const { std::cell::RefCell::new(None) };
}

#[cfg(any(test, debug_assertions))]
pub fn set_test_public_key(pk_hex: Option<String>) {
    TEST_PUBLIC_KEY.with(|k| *k.borrow_mut() = pk_hex);
}

#[cfg(any(test, debug_assertions))]
pub fn generate_test_keypair() -> (Vec<u8>, String) {
    let rng = ring::rand::SystemRandom::new();
    let pkcs8 = signature::Ed25519KeyPair::generate_pkcs8(&rng).expect("generate test pkcs8");
    let pair = signature::Ed25519KeyPair::from_pkcs8(pkcs8.as_ref()).expect("parse test pkcs8");
    let public_key_hex = hex::encode(pair.public_key().as_ref());
    (pkcs8.as_ref().to_vec(), public_key_hex)
}

#[cfg(any(test, debug_assertions))]
pub fn sign_entitlement_for_test(entitlement: &mut SignedEntitlement, pkcs8: &[u8]) {
    let key_pair = signature::Ed25519KeyPair::from_pkcs8(pkcs8).expect("valid test pkcs8 key");
    let sig = key_pair.sign(&entitlement.canonical_payload());
    entitlement.signature = hex::encode(sig.as_ref());
}
