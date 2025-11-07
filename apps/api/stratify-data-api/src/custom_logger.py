import logging
from os import getenv
from uvicorn import config, logging as uvicorn_logging

datefmt = "%Y-%m-%d %H:%M:%S"
fmt = "{asctime} - {levelname} - {message}"

uvicorn_log_config = config.LOGGING_CONFIG
uvicorn_log_config["formatters"]["access"]["fmt"] = fmt
uvicorn_log_config["formatters"]["default"]["fmt"] = fmt
uvicorn_log_config["formatters"]["access"]["datefmt"] = datefmt
uvicorn_log_config["formatters"]["default"]["datefmt"] = datefmt

def log_level_mapping(level_str: str):
    level_str = level_str.lower()
    mapping = {
        "debug": logging.DEBUG,
        "info": logging.INFO,
        "warning": logging.WARNING,
        "error": logging.ERROR,
        "critical": logging.CRITICAL,
    }
    return mapping.get(level_str, logging.INFO)

def get_logger(name: str):
    logging.basicConfig(level=log_level_mapping(getenv("LOG_LEVEL", "info")), format=fmt, datefmt=datefmt, style="{")
    logger = logging.getLogger(name)
    return logger