import json
from pathlib import Path
from dotenv import load_dotenv
from src.config_schema import ConfigModel
from os import getenv
from src.custom_logger import get_logger

load_dotenv()
logger = get_logger(__name__)

def env_check():
    required_vars = ["DATABASE_URL", "SERVER_PORT", "ENVIRONMENT"]
    missing_vars = [var for var in required_vars if not getenv(var)]
    if missing_vars:
        for var in missing_vars:
            logger.warning(f"Environment variable {var} is not set.")
    else:
        logger.info("All required environment variables are set.")

def load_config() -> ConfigModel:
    env_check()
    return ConfigModel(
    database={
        "connectionString": getenv("DATABASE_URL", ""),
        "maxConnections": int(getenv("DB_MAX_CONNECTIONS", 10)),
        "minConnections": int(getenv("DB_MIN_CONNECTIONS", 2)),
    },
    server={
        "port": int(getenv("SERVER_PORT")),
    },
    environment=getenv("ENVIRONMENT", "development"),
    logLevel=getenv("LOG_LEVEL", "info"),
)

config = load_config()

def get_package_version():
    try:
        project_root = Path(__file__).parent.parent
        package_json_path = project_root / "package.json"
        
        if package_json_path.exists():
            with open(package_json_path, 'r') as file:
                package_data = json.load(file)
                return package_data.get("version") or "0.1.0"
        else:
            return "0.1.0"  # Default version if package.json is not found
    except Exception as e:
        print(f"Warning: Could not read version from package.json: {e}")
        return "0.1.0"

openapi_config = {
    "title": "Stratify Data API",
    "version": get_package_version(),
    "description": "A REST API for accessing stock market data powered by Yahoo Finance and Stooq.",
}
