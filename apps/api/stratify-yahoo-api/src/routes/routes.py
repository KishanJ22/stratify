from src.routes.stocks.stocks_get import symbols_get
from src.routes.stocks.symbol.symbol_get import symbol_get
from fastapi import APIRouter

router = APIRouter()

router.include_router(symbols_get)
router.include_router(symbol_get)