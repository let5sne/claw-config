use thiserror::Error;
use serde::Serialize;

#[derive(Debug, Error, Serialize)]
pub enum AppError {
    #[error("Configuration path not found")]
    ConfigPathNotFound,

    #[error("Configuration file not found")]
    ConfigNotFound,

    #[error("Failed to read configuration: {0}")]
    ReadError(String),

    #[error("Failed to parse configuration: {0}")]
    ParseError(String),

    #[error("Failed to serialize configuration: {0}")]
    SerializeError(String),

    #[error("Failed to write configuration: {0}")]
    WriteError(String),

    #[error("File not found: {0}")]
    FileNotFound(String),

    #[error("Invalid provider configuration: {0}")]
    InvalidProvider(String),

    #[error("IO error: {0}")]
    Io(String),
}

// 从 std::io::Error 转换
impl From<std::io::Error> for AppError {
    fn from(err: std::io::Error) -> Self {
        AppError::Io(err.to_string())
    }
}
