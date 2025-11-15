from pydantic import BaseModel
from typing import Literal

Environment = Literal["local", "development", "staging", "production"]
LogLevel = Literal["debug", "info", "warning", "error", "critical"]

class DatabaseConfig(BaseModel):
    connectionString: str
    maxConnections: int
    minConnections: int
    
class ServerConfig(BaseModel):
    port: int

class ConfigModel(BaseModel):
    database: DatabaseConfig
    server: ServerConfig
    environment: Environment
    logLevel: LogLevel
