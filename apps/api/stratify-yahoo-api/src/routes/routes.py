from src.routes.stocks.stocks_get import router as stocks_router
from src.routes.stocks.ticker.ticker_get import router as ticker_router
from fastapi import APIRouter

router = APIRouter()

router.include_router(stocks_router)
router.include_router(ticker_router)