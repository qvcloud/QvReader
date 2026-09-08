#[path = "../src/licensing"]
mod licensing {
    pub mod creem;
    pub mod crypto;
    pub mod entitlement;
    pub mod storage;
}

use licensing::crypto;
use licensing::entitlement::{
    generate_test_keypair, set_test_public_key, sign_entitlement_for_test,
    EntitlementVerificationError, SignedEntitlement, CURRENT_SCHEMA_VERSION, EXPECTED_ISSUER,
    TEST_PUBLIC_KEY_V1_ID,
};

fn setup_test_context() -> (Vec<u8>, String) {
    let (pkcs8, pub_hex) = generate_test_keypair();
    set_test_public_key(Some(pub_hex.clone()));
    (pkcs8, pub_hex)
}

fn create_valid_test_entitlement(pkcs8: &[u8]) -> SignedEntitlement {
    let fp = crypto::get_device_fingerprint();
    let mut entitlement = SignedEntitlement {
        schema_version: CURRENT_SCHEMA_VERSION,
        entitlement_id: "ent_test_lifetime_999".to_string(),
        edition: "pro".to_string(),
        device_id_hash: fp,
        issued_at: 1788536410,
        expires_at: None,
        issuer: EXPECTED_ISSUER.to_string(),
        key_id: TEST_PUBLIC_KEY_V1_ID.to_string(),
        signature: String::new(),
        customer_email: None,
    };
    sign_entitlement_for_test(&mut entitlement, pkcs8);
    entitlement
}

#[test]
fn test_valid_entitlement_verifies_offline() {
    let (pkcs8, _) = setup_test_context();
    let entitlement = create_valid_test_entitlement(&pkcs8);
    assert!(entitlement.verify().is_ok());
}

#[test]
fn test_modified_payload_fails_verification() {
    let (pkcs8, _) = setup_test_context();
    let mut entitlement = create_valid_test_entitlement(&pkcs8);
    // Tamper with entitlement ID after signature was generated
    entitlement.entitlement_id = "ent_tampered_id".to_string();
    let res = entitlement.verify();
    assert_eq!(res, Err(EntitlementVerificationError::BadSignature));
}

#[test]
fn test_wrong_device_binding_fails() {
    let (pkcs8, _) = setup_test_context();
    let mut entitlement = create_valid_test_entitlement(&pkcs8);
    entitlement.device_id_hash = "wrong_device_fingerprint_00000000".to_string();
    sign_entitlement_for_test(&mut entitlement, &pkcs8);
    let res = entitlement.verify();
    assert_eq!(res, Err(EntitlementVerificationError::DeviceMismatch));
}

#[test]
fn test_unknown_key_id_fails() {
    let (pkcs8, _) = setup_test_context();
    let mut entitlement = create_valid_test_entitlement(&pkcs8);
    entitlement.key_id = "unknown-key-999".to_string();
    let res = entitlement.verify();
    assert_eq!(res, Err(EntitlementVerificationError::UnknownKeyId("unknown-key-999".to_string())));
}

#[test]
fn test_expired_entitlement_fails() {
    let (pkcs8, _) = setup_test_context();
    let fp = crypto::get_device_fingerprint();
    let mut entitlement = SignedEntitlement {
        schema_version: CURRENT_SCHEMA_VERSION,
        entitlement_id: "ent_test_expired".to_string(),
        edition: "pro".to_string(),
        device_id_hash: fp,
        issued_at: 1000000000,
        expires_at: Some(1000000100), // Far in the past
        issuer: EXPECTED_ISSUER.to_string(),
        key_id: TEST_PUBLIC_KEY_V1_ID.to_string(),
        signature: String::new(),
        customer_email: None,
    };
    sign_entitlement_for_test(&mut entitlement, &pkcs8);
    let res = entitlement.verify();
    assert_eq!(res, Err(EntitlementVerificationError::Expired));
}

#[test]
fn test_invalid_signature_hex_fails() {
    let (pkcs8, _) = setup_test_context();
    let mut entitlement = create_valid_test_entitlement(&pkcs8);
    // Corrupt the signature bytes with an odd-length invalid hex string
    entitlement.signature = "invalid_hex_string".to_string();
    let res = entitlement.verify();
    assert_eq!(res, Err(EntitlementVerificationError::MalformedSignature));
}

#[test]
fn test_unsupported_schema_version_fails() {
    let (pkcs8, _) = setup_test_context();
    let mut entitlement = create_valid_test_entitlement(&pkcs8);
    entitlement.schema_version = 99;
    sign_entitlement_for_test(&mut entitlement, &pkcs8);
    let res = entitlement.verify();
    assert_eq!(res, Err(EntitlementVerificationError::UnsupportedSchema(99)));
}

#[test]
fn test_invalid_issuer_fails() {
    let (pkcs8, _) = setup_test_context();
    let mut entitlement = create_valid_test_entitlement(&pkcs8);
    entitlement.issuer = "rogue_issuer".to_string();
    sign_entitlement_for_test(&mut entitlement, &pkcs8);
    let res = entitlement.verify();
    assert_eq!(res, Err(EntitlementVerificationError::InvalidIssuer("rogue_issuer".to_string())));
}

#[test]
fn test_offline_reuse_persisted_entitlement() {
    let (pkcs8, _) = setup_test_context();
    let temp_dir = licensing::storage::setup_isolated_env("offline_reuse");

    let entitlement = create_valid_test_entitlement(&pkcs8);
    // Save valid entitlement to local application storage
    assert!(licensing::storage::save_entitlement(&entitlement).is_ok());

    // Reload from storage offline and verify
    let loaded = licensing::storage::load_entitlement();
    assert!(loaded.is_some());
    let loaded_ent = loaded.unwrap();
    assert_eq!(loaded_ent.entitlement_id, entitlement.entitlement_id);
    assert!(loaded_ent.verify().is_ok());

    licensing::storage::cleanup_isolated_env(temp_dir);
}

#[test]
fn test_tampered_persisted_entitlement_fails_offline() {
    let (pkcs8, _) = setup_test_context();
    let temp_dir = licensing::storage::setup_isolated_env("tampered_reuse");

    let mut entitlement = create_valid_test_entitlement(&pkcs8);
    // Tamper with signature
    entitlement.signature = hex::encode(vec![0xAA; 64]);
    assert!(licensing::storage::save_entitlement(&entitlement).is_ok());

    let loaded = licensing::storage::load_entitlement().expect("entitlement file exists");
    let res = loaded.verify();
    assert_eq!(res, Err(EntitlementVerificationError::BadSignature));

    licensing::storage::cleanup_isolated_env(temp_dir);
}

#[tokio::test]
async fn test_network_degradation_and_secret_redaction() {
    let client = licensing::creem::ActivationClient::with_api_base("http://127.0.0.1:9"); // Unreachable port
    let secret_key = "CR-SECRET-TEST-KEY-NEVER-LEAK";
    let res = client.activate(secret_key, "device-1234567890abcdef", Some("My Laptop")).await;

    assert!(res.is_err());
    let err_msg = res.unwrap_err();
    // Secret redaction verification: error message MUST NOT contain the raw key
    assert!(
        !err_msg.contains(secret_key),
        "Error message leaked secret license key: {}",
        err_msg
    );
    assert!(
        !err_msg.contains("CR-SECRET"),
        "Error message leaked key prefix: {}",
        err_msg
    );
}
