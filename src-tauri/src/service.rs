use crate::error::AppError;
use crate::models::OpenClawConfig;
use dirs::home_dir;
use std::fs;
use std::path::PathBuf;

#[derive(Debug, Clone)]
pub struct ConfigService {
    config_path: PathBuf,
}

impl ConfigService {
    pub fn new() -> Result<Self, AppError> {
        let config_path = home_dir()
            .ok_or_else(|| AppError::ConfigPathNotFound)?
            .join(".openclaw")
            .join("openclaw.json");

        Ok(Self { config_path })
    }

    pub fn get_config_path(&self) -> PathBuf {
        self.config_path.clone()
    }

    pub fn read_config(&self) -> Result<OpenClawConfig, AppError> {
        if !self.config_path.exists() {
            return Ok(OpenClawConfig::default());
        }

        let content = fs::read_to_string(&self.config_path)
            .map_err(|e| AppError::ReadError(e.to_string()))?;

        serde_json::from_str(&content).map_err(|e| AppError::ParseError(e.to_string()))
    }

    pub fn write_config(&self, config: &OpenClawConfig) -> Result<(), AppError> {
        // 确保目录存在
        if let Some(parent) = self.config_path.parent() {
            fs::create_dir_all(parent).map_err(|e| AppError::WriteError(e.to_string()))?;
        }

        // 读取现有配置以保留未修改的部分
        let existing_config = if self.config_path.exists() {
            self.read_config()?
        } else {
            OpenClawConfig::default()
        };

        // 合并配置
        let merged_config = self.merge_configs(existing_config, config.clone());

        let content = serde_json::to_string_pretty(&merged_config)
            .map_err(|e| AppError::SerializeError(e.to_string()))?;

        fs::write(&self.config_path, content).map_err(|e| AppError::WriteError(e.to_string()))?;

        Ok(())
    }

    fn merge_configs(&self, existing: OpenClawConfig, new: OpenClawConfig) -> OpenClawConfig {
        OpenClawConfig {
            meta: new.meta.or(existing.meta),
            wizard: new.wizard.or(existing.wizard),
            models: new.models.or(existing.models),
            agents: new.agents.or(existing.agents),
            auth: new.auth.or(existing.auth),
            messages: new.messages.or(existing.messages),
            commands: new.commands.or(existing.commands),
            gateway: new.gateway.or(existing.gateway),
            skills: new.skills.or(existing.skills),
        }
    }

    pub fn backup_config(&self) -> Result<PathBuf, AppError> {
        if !self.config_path.exists() {
            return Err(AppError::ConfigNotFound);
        }

        let backup_dir = self.config_path.parent().unwrap().join("backups");

        fs::create_dir_all(&backup_dir).map_err(|e| AppError::WriteError(e.to_string()))?;

        let timestamp = chrono::Utc::now().format("%Y%m%d_%H%M%S");
        let backup_path = backup_dir.join(format!("openclaw_backup_{}.json", timestamp));

        fs::copy(&self.config_path, &backup_path)
            .map_err(|e| AppError::WriteError(e.to_string()))?;

        Ok(backup_path)
    }

    pub fn restore_config(&self, backup_path: &PathBuf) -> Result<(), AppError> {
        if !backup_path.exists() {
            return Err(AppError::FileNotFound(backup_path.display().to_string()));
        }

        fs::copy(backup_path, &self.config_path)
            .map_err(|e| AppError::WriteError(e.to_string()))?;

        Ok(())
    }
}

impl Default for ConfigService {
    fn default() -> Self {
        Self::new().expect("Failed to create ConfigService")
    }
}
