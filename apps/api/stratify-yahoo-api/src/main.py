from contextlib import asynccontextmanager
from fastapi import FastAPI
from src.generate_openapi_spec import save_openapi_spec
from src.config import get_package_version, openapi_config
from src.routes.routes import router as routes

@asynccontextmanager
async def lifespan(app: FastAPI):
    save_openapi_spec(app)
    yield
    
app = FastAPI(lifespan=lifespan, **openapi_config)

app.include_router(routes)

@app.get("/", status_code=200)
def get_root():
    return {"message": "Welcome to Stratify Yahoo API"}

@app.get("/health", status_code=200)
def get_health():
    return {"status": "Ok", "version": get_package_version()}
