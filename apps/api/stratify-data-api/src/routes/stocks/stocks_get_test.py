from unittest.mock import MagicMock
from src.tests.mock_app import mock_app
from src.tests.__mocks__.mock_yfinance_ticker_data import mock_yfinance_ticker_data
from src.tests.__mocks__.mock_stock_data import mock_stock_data

def test_get_stocks_success(mock_app, mocker):
    mock_ticker = MagicMock()
    mock_ticker.info = mock_yfinance_ticker_data

    mock_tickers = MagicMock()
    mock_tickers.tickers = {"AAPL": mock_ticker}
    mocker.patch("src.routes.stocks.stocks_get.Tickers", return_value=mock_tickers)

    response = mock_app.get("/stocks?symbols=AAPL")
    assert response.status_code == 200
    data = response.json()
    
    assert "data" in data
    assert "stocks" in data["data"]
    assert len(data["data"]["stocks"]) == 1
    response_stock_data = data["data"]["stocks"][0]
    assert response_stock_data == mock_stock_data
    
def test_get_stocks_no_data_found(mock_app, mocker):
    # Mock empty response
    mock_ticker = MagicMock()
    mock_ticker.info = {"quoteType": "NONE"}
    
    mock_tickers = MagicMock()
    mock_tickers.tickers = {"INVALID": mock_ticker}
    
    mocker.patch('src.routes.stocks.stocks_get.Tickers', return_value=mock_tickers)

    response = mock_app.get("/stocks?symbols=INVALID")
    assert response.status_code == 404
    
def test_get_stocks_multiple_symbols(mock_app, mocker):
    # Mock multiple tickers
    mock_ticker1 = MagicMock()
    mock_ticker1.info = mock_yfinance_ticker_data

    mock_ticker2 = MagicMock()
    mock_ticker2.info = {**mock_yfinance_ticker_data, "displayName": "Microsoft Corporation"}

    mock_tickers = MagicMock()
    mock_tickers.tickers = {"AAPL": mock_ticker1, "MSFT": mock_ticker2}
    
    mocker.patch('src.routes.stocks.stocks_get.Tickers', return_value=mock_tickers)
    
    response = mock_app.get("/stocks?symbols=AAPL,MSFT")
    assert response.status_code == 200
    data = response.json()
    assert len(data["data"]["stocks"]) == 2