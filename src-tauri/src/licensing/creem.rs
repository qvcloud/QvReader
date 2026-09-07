use super::entitlement::{self, SignedEntitlement};
use serde::{Deserialize, Serialize};
use std::time::Duration;

pub const DEFAULT_ACTIVATION_API_BASE: &str = "https://api.qvreader.com/api/licenses";

#[derive(Debug, Serialize)]
pub struct ActivationRequest<'a> {
    #[serde(rename = "contractVersion")]
    pub contract_version: u32,
    #[serde(rename = "licenseKey")]
    pub license_key: &'a str,
    #[serde(rename = "deviceIdHash")]
    pub device_id_hash: &'a str,
    #[serde(rename = "deviceLabel", skip_serializing_if = "Option::is_none")]
    pub device_label: Option<&'a str>,
    #[serde(rename = "clientVersion", skip_serializing_if = "Option::is_none")]
    pub client_version: Option<&'a str>,
    #[serde(rename = "platform", skip_serializing_if = "Option::is_none")]
    pub platform: Option<&'a str>,
}

#[derive(Debug, Deserialize)]
pub struct ActivationSuccessResponse {
    pub success: bool,
    pub entitlement: SignedEntitlement,
    #[serde(rename = "customerEmail")]
    pub customer_email: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct ActivationErrorResponse {
    pub success: bool,
    #[serde(rename = "errorCode")]
    pub error_code: Option<String>,
    #[serde(rename = "errorMessage")]
    pub error_message: Option<String>,
    pub retryable: Option<bool>,
}

#[derive(Debug, Serialize)]
pub struct DeactivationPayload<'a> {
    pub contract_version: u32,
    pub device_id_hash: &'a str,
}

#[derive(Debug, Deserialize)]
pub struct DeactivationResponse {
    pub success: bool,
    pub error: Option<String>,
}

pub struct ActivationClient {
    client: reqwest::Client,
    api_base: String,
}

impl ActivationClient {
    pub fn new() -> Self {
        let client = reqwest::Client::builder()
            .timeout(Duration::from_secs(8))
            .build()
            .unwrap_or_default();
        Self {
            client,
            api_base: DEFAULT_ACTIVATION_API_BASE.to_string(),
        }
    }

    pub fn with_api_base(api_base: &str) -> Self {
        let client = reqwest::Client::builder()
            .timeout(Duration::from_secs(8))
            .build()
            .unwrap_or_default();
        Self {
            client,
            api_base: api_base.to_string(),
        }
    }

    pub async fn activate(
        &self,
        license_key: &str,
        device_id_hash: &str,
        device_label: Option<&str>,
    ) -> Result<ActivationSuccessResponse, String> {
        let clean_key = license_key.trim();
        if clean_key.is_empty() {
            return Err("License key cannot be empty".to_string());
        }

        // Test keys support for developer / QA environments and automated contract tests
        #[cfg(any(test, debug_assertions))]
        if clean_key == "CR-TEST-PRO-LIFETIME" || clean_key == "TEST-PRO-VALID-KEY" || clean_key == "CR-TEST-PRO-LIFETIME-12345" {
            let (pkcs8, pk_hex) = entitlement::generate_test_keypair();
            entitlement::set_test_public_key(Some(pk_hex));
            let now = std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .map(|d| d.as_secs())
                .unwrap_or(0);

            let mut ent = SignedEntitlement {
                schema_version: entitlement::CURRENT_SCHEMA_VERSION,
                entitlement_id: "test-ent-dev-001".to_string(),
                edition: "pro".to_string(),
                device_id_hash: device_id_hash.to_string(),
                issued_at: now,
                expires_at: None,
                issuer: entitlement::EXPECTED_ISSUER.to_string(),
                key_id: entitlement::TEST_PUBLIC_KEY_V1_ID.to_string(),
                signature: String::new(),
            };
            entitlement::sign_entitlement_for_test(&mut ent, &pkcs8);

            return Ok(ActivationSuccessResponse {
                success: true,
                entitlement: ent,
                customer_email: Some("developer@qvreader.com".to_string()),
            });
        }

        let payload = ActivationRequest {
            contract_version: 1,
            license_key: clean_key,
            device_id_hash,
            device_label,
            client_version: Some("0.1.5"),
            platform: Some(std::env::consts::OS),
        };

        let res = self
            .client
            .post(format!("{}/activate", self.api_base))
            .json(&payload)
            .send()
            .await
            .map_err(|e| format!("Network request failed: {}", sanitize_error(&e.to_string())))?;

        let status = res.status();
        let body_bytes = res
            .bytes()
            .await
            .map_err(|e| format!("Failed to read response: {}", sanitize_error(&e.to_string())))?;

        if status.is_success() {
            if let Ok(success_body) = serde_json::from_slice::<ActivationSuccessResponse>(&body_bytes) {
                if success_body.success {
                    return Ok(success_body);
                }
            }
        }

        if let Ok(err_body) = serde_json::from_slice::<ActivationErrorResponse>(&body_bytes) {
            let msg = err_body
                .error_message
                .unwrap_or_else(|| "License activation failed".to_string());
            return Err(sanitize_error(&msg));
        }

        Err("Activation server returned an unexpected error".to_string())
    }

    pub async fn deactivate(&self, device_id_hash: &str) -> Result<(), String> {
        let payload = DeactivationPayload {
            contract_version: 1,
            device_id_hash,
        };

        let _ = self
            .client
            .post(format!("{}/deactivate", self.api_base))
            .json(&payload)
            .send()
            .await;

        Ok(())
    }
}

/// Redact potential sensitive tokens or keys from error output
fn sanitize_error(err: &str) -> String {
    // Redact any patterns resembling keys or tokens
    let mut sanitized = err.to_string();
    if sanitized.contains("CR-") || sanitized.contains("TEST-") {
        sanitized = "Activation key validation error".to_string();
    }
    sanitized
}
