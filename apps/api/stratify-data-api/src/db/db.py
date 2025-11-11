import os
from psycopg_pool import ConnectionPool
from src.custom_logger import get_logger
from src.config import config

logger = get_logger(__name__)

pool = ConnectionPool(conninfo=config.database.connectionString, min_size=config.database.minConnections, max_size=config.database.maxConnections)

def db_startup_check():
    pool.wait()
    connection = None
    try:
        connection = pool.getconn()
        pool.check_connection(connection)
        logger.info("Database connection successful.")
    except Exception as e:
        logger.error(f"Database connection failed: {e}")
        raise
    finally:
        if connection:
            pool.putconn(connection)