from unittest.mock import MagicMock
from src.tests.mock_app import mock_app
from src.tests.__mocks__.mock_yfinance_news_data import mock_yfinance_news_data
from src.tests.__mocks__.mock_stock_news_data import mock_news_article

def test_get_stock_news_success(mock_app, mocker):
    mock_ticker = MagicMock()
    mock_ticker.news = mock_yfinance_news_data
    
    mocker.patch("src.routes.stocks.symbol.symbol_news_get.Ticker", return_value=mock_ticker)

    response = mock_app.get("/stocks/AAPL/news")

    assert response.status_code == 200
    data = response.json()
    assert "data" in data
    assert len(data["data"]) == 1
    assert data["data"][0] == mock_news_article

def test_get_stock_news_not_found(mock_app, mocker):
    mock_ticker = MagicMock()
    mock_ticker.news = []
    mocker.patch("src.routes.stocks.symbol.symbol_news_get.Ticker", return_value=mock_ticker)

    response = mock_app.get("/stocks/AAPL/news")

    assert response.status_code == 404
    assert response.json() == {"detail": "Stock news not found"}
    