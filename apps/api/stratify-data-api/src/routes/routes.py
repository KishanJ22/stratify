from fastapi import APIRouter
from src.routes.stocks.stocks_get import symbols_get
from src.routes.stocks.symbol.symbol_get import symbol_get
from src.routes.stocks.symbol.symbol_news_get import symbol_news_get
from src.routes.market.top_gainers_get import top_gainers_get
from src.routes.market.top_losers_get import top_losers_get
from src.routes.market.most_active_get import most_active_get
from src.routes.cryptocurrencies.cryptocurrencies_get import crypto_symbols_get
from src.routes.cryptocurrencies.symbol.crypto_symbol_get import crypto_symbol_get
from src.routes.funds.funds_get import funds_get
from src.routes.funds.symbol.fund_symbol_get import fund_symbol_get

router = APIRouter()

router.include_router(symbols_get)
router.include_router(symbol_get)
router.include_router(symbol_news_get)
router.include_router(top_gainers_get)
router.include_router(top_losers_get)
router.include_router(most_active_get)
router.include_router(crypto_symbols_get)
router.include_router(crypto_symbol_get)
router.include_router(funds_get)
router.include_router(fund_symbol_get)