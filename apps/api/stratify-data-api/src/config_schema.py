from pydantic import BaseModel
from typing import Literal

Environment = Literal["local", "development", "staging", "production"]
LogLevel = Literal["debug", "info", "warning", "error", "critical"]

class ServerConfig(BaseModel):
    port: int

class ConfigModel(BaseModel):
    server: ServerConfig
    environment: Environment
    logLevel: LogLevel
