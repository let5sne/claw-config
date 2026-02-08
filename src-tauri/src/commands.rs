use crate::error::AppError;
use crate::models::{OpenClawConfig, Provider, AgentsDefaults, ModelConfig, SubagentsConfig};
use crate::service::ConfigService;
use std::collections::HashMap;
use std::sync::Mutex;
use tauri::State;

pub struct AppState {
    pub config_service: Mutex<ConfigService>,
}

// 获取完整配置
#[tauri::command]
pub fn get_config(
    state: State<'_, AppState>,
) -> Result<OpenClawConfig, AppError> {
    let service = state.config_service.lock()
        .map_err(|_| AppError::Io("Failed to lock config service".to_string()))?;
    service.read_config()
}

// 保存完整配置
#[tauri::command]
pub fn save_config(
    state: State<'_, AppState>,
    config: OpenClawConfig,
) -> Result<(), AppError> {
    let service = state.config_service.lock()
        .map_err(|_| AppError::Io("Failed to lock config service".to_string()))?;
    service.write_config(&config)
}

// 获取 Providers
#[tauri::command]
pub fn get_providers(
    state: State<'_, AppState>,
) -> Result<HashMap<String, Provider>, AppError> {
    let service = state.config_service.lock()
        .map_err(|_| AppError::Io("Failed to lock config service".to_string()))?;
    let config = service.read_config()?;
    Ok(config
        .models
        .map(|m| m.providers)
        .unwrap_or_default())
}

// 添加 Provider
#[tauri::command]
pub fn add_provider(
    state: State<'_, AppState>,
    id: String,
    provider: Provider,
) -> Result<(), AppError> {
    let service = state.config_service.lock()
        .map_err(|_| AppError::Io("Failed to lock config service".to_string()))?;
    let mut config = service.read_config()?;

    if config.models.is_none() {
        config.models = Some(crate::models::ModelsConfig {
            mode: "merge".to_string(),
            providers: HashMap::new(),
        });
    }

    let models = config.models.as_mut().unwrap();
    models.providers.insert(id, provider);

    service.write_config(&config)
}

// 更新 Provider
#[tauri::command]
pub fn update_provider(
    state: State<'_, AppState>,
    id: String,
    provider: Provider,
) -> Result<(), AppError> {
    let service = state.config_service.lock()
        .map_err(|_| AppError::Io("Failed to lock config service".to_string()))?;
    let mut config = service.read_config()?;

    if let Some(ref mut models) = config.models {
        if !models.providers.contains_key(&id) {
            return Err(AppError::InvalidProvider(format!("Provider '{}' not found", id)));
        }
        models.providers.insert(id, provider);
        service.write_config(&config)?;
    }

    Ok(())
}

// 删除 Provider
#[tauri::command]
pub fn delete_provider(
    state: State<'_, AppState>,
    id: String,
) -> Result<(), AppError> {
    let service = state.config_service.lock()
        .map_err(|_| AppError::Io("Failed to lock config service".to_string()))?;
    let mut config = service.read_config()?;

    if let Some(ref mut models) = config.models {
        models.providers.remove(&id);
        service.write_config(&config)?;
    }

    Ok(())
}

// 获取 Agents Defaults
#[tauri::command]
pub fn get_agents_defaults(
    state: State<'_, AppState>,
) -> Result<Option<AgentsDefaults>, AppError> {
    let service = state.config_service.lock()
        .map_err(|_| AppError::Io("Failed to lock config service".to_string()))?;
    let config = service.read_config()?;
    Ok(config.agents.map(|a| a.defaults))
}

// 保存 Agents Defaults
#[tauri::command]
pub fn save_agents_defaults(
    state: State<'_, AppState>,
    defaults: AgentsDefaults,
) -> Result<(), AppError> {
    let service = state.config_service.lock()
        .map_err(|_| AppError::Io("Failed to lock config service".to_string()))?;
    let mut config = service.read_config()?;

    if config.agents.is_none() {
        config.agents = Some(crate::models::AgentsConfig {
            defaults: default_agents_defaults(),
        });
    }

    if let Some(ref mut agents) = config.agents {
        agents.defaults = defaults;
    }

    service.write_config(&config)
}

// 备份配置
#[tauri::command]
pub fn backup_config(
    state: State<'_, AppState>,
) -> Result<String, AppError> {
    let service = state.config_service.lock()
        .map_err(|_| AppError::Io("Failed to lock config service".to_string()))?;
    let backup_path = service.backup_config()?;
    Ok(backup_path.to_string_lossy().to_string())
}

// 恢复配置
#[tauri::command]
pub fn restore_config(
    state: State<'_, AppState>,
    backup_path: String,
) -> Result<(), AppError> {
    let service = state.config_service.lock()
        .map_err(|_| AppError::Io("Failed to lock config service".to_string()))?;
    let path = backup_path.into();
    service.restore_config(&path)
}

// 获取配置文件路径
#[tauri::command]
pub fn get_config_path(
    state: State<'_, AppState>,
) -> Result<String, AppError> {
    let service = state.config_service.lock()
        .map_err(|_| AppError::Io("Failed to lock config service".to_string()))?;
    Ok(service.get_config_path().to_string_lossy().to_string())
}

// 检查配置文件是否存在
#[tauri::command]
pub fn config_exists(
    state: State<'_, AppState>,
) -> Result<bool, AppError> {
    let service = state.config_service.lock()
        .map_err(|_| AppError::Io("Failed to lock config service".to_string()))?;
    Ok(service.get_config_path().exists())
}

// 创建默认的 AgentsDefaults
fn default_agents_defaults() -> AgentsDefaults {
    AgentsDefaults {
        model: Some(ModelConfig {
            primary: String::new(),
            fast: None,
            balanced: None,
            powerful: None,
        }),
        models: HashMap::new(),
        workspace: None,
        maxConcurrent: Some(6),
        subagents: Some(SubagentsConfig {
            max_concurrent: 12,
        }),
        caching: None,
        timeout: None,
        retry: None,
        compaction: None,
    }
}
