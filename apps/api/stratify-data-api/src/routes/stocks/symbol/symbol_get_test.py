from unittest.mock import MagicMock
from src.tests.mock_app import mock_app
from src.tests.__mocks__.mock_yfinance_ticker_data import mock_yfinance_ticker_data
from src.tests.__mocks__.mock_stock_data import mock_stock_data

def test_get_stock_success(mock_app, mocker):
    mock_ticker = MagicMock()
    mock_ticker.info = mock_yfinance_ticker_data

    mocker.patch("src.routes.stocks.symbol.symbol_get.Ticker", return_value=mock_ticker)

    response = mock_app.get("/stocks/AAPL")
    assert response.status_code == 200
    data = response.json()
    assert "data" in data
    assert data["data"] == mock_stock_data

def test_get_stock_not_found(mock_app, mocker):
    mock_ticker = MagicMock()
    mock_ticker.info = {"quoteType": "NONE"}
    mocker.patch("src.routes.stocks.symbol.symbol_get.Ticker", return_value=mock_ticker)

    response = mock_app.get("/stocks/INVALID")
    assert response.status_code == 404

