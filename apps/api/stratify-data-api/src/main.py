from contextlib import asynccontextmanager
from fastapi import FastAPI
import uvicorn
from src.generate_openapi_spec import save_openapi_spec
from src.config import get_package_version, openapi_config, config
from src.routes.routes import router as routes
from src.db.db import db_startup_check, pool
from src.custom_logger import log_level_mapping, get_logger
import sys

logger = get_logger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    save_openapi_spec(app)
    pool.open()
    db_startup_check()
    yield
    logger.info("Shutting down application...")
    pool.close(timeout=15)

app = FastAPI(lifespan=lifespan, **openapi_config)
app.include_router(routes)

@app.get("/", status_code=200)
def get_root():
    return {"message": "Welcome to Stratify Data API"}

@app.get("/health", status_code=200)
def get_health():
    return {"status": "Ok", "version": get_package_version()}

if __name__ == "__main__":
    args = sys.argv
    is_reload_enabled = "--reload" in args
    uvicorn.run("src.main:app", host="0.0.0.0", port=config.server.port, log_level=log_level_mapping(config.logLevel), reload=is_reload_enabled, log_config=None)