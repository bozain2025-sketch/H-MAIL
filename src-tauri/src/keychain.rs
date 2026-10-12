// MailHub Credential Manager
// Strictly isolates OAuth refresh tokens and passwords into the native macOS Keychain.
// Never stored in SQLite or passed to frontend JavaScript context.

#[derive(Debug, thiserror::Error)]
pub enum KeychainError {
    #[error("Keychain access failed: {0}")]
    AccessError(String),
    #[error("Secret not found for key: {0}")]
    NotFound(String),
}

pub struct KeychainManager {
    service_name: String,
}

impl KeychainManager {
    pub fn new() -> Self {
        Self {
            service_name: "com.mailhub.desktop".to_string(),
        }
    }

    #[cfg(target_os = "macos")]
    pub fn store_token(&self, account_id: &str, token: &str) -> Result<(), KeychainError> {
        use security_framework::passwords::set_generic_password;
        set_generic_password(&self.service_name, account_id, token.as_bytes())
            .map_err(|e| KeychainError::AccessError(e.to_string()))
    }

    #[cfg(target_os = "macos")]
    pub fn get_token(&self, account_id: &str) -> Result<String, KeychainError> {
        use security_framework::passwords::get_generic_password;
        let bytes = get_generic_password(&self.service_name, account_id)
            .map_err(|e| KeychainError::AccessError(e.to_string()))?;
        String::from_utf8(bytes).map_err(|e| KeychainError::AccessError(e.to_string()))
    }

    #[cfg(target_os = "macos")]
    pub fn delete_token(&self, account_id: &str) -> Result<(), KeychainError> {
        use security_framework::passwords::delete_generic_password;
        delete_generic_password(&self.service_name, account_id)
            .map_err(|e| KeychainError::AccessError(e.to_string()))
    }

    #[cfg(not(target_os = "macos"))]
    pub fn store_token(&self, _account_id: &str, _token: &str) -> Result<(), KeychainError> {
        // Non-macOS development fallback
        Ok(())
    }

    #[cfg(not(target_os = "macos"))]
    pub fn get_token(&self, _account_id: &str) -> Result<String, KeychainError> {
        Ok("mock_secure_token".to_string())
    }

    #[cfg(not(target_os = "macos"))]
    pub fn delete_token(&self, _account_id: &str) -> Result<(), KeychainError> {
        Ok(())
    }
}
