from unittest.mock import MagicMock
from src.tests.mock_app import mock_app
from src.routes.stocks._mocks.mock_yfinance_ticker_data import mock_yfinance_ticker_data
from src.routes.stocks._mocks.mock_stock_data import mock_stock_data

def test_get_stocks_success(mock_app, mocker):
    mock_tickers = MagicMock(tickers={"AAPL": MagicMock(info=mock_yfinance_ticker_data)})
    
    mocker.patch("src.routes.stocks.stocks_get.Tickers", return_value=mock_tickers)

    response = mock_app.get("/stocks?symbols=AAPL")
    assert response.status_code == 200
    data = response.json()
    
    assert "data" in data
    assert len(data["data"]) == 1
    response_stock_data = data["data"][0]
    assert response_stock_data == mock_stock_data
    
def test_get_stocks_no_data_found(mock_app, mocker):
    mock_tickers = MagicMock(tickers={ "INVALID": MagicMock(info=None) })
    
    mocker.patch('src.routes.stocks.stocks_get.Tickers', return_value=mock_tickers)

    response = mock_app.get("/stocks?symbols=INVALID")
    assert response.status_code == 404
    
def test_get_stocks_multiple_symbols(mock_app, mocker):
    mock_tickers = MagicMock(tickers={
        "AAPL": MagicMock(info=mock_yfinance_ticker_data),
        "MSFT": MagicMock(info=mock_yfinance_ticker_data)
    })
    
    mocker.patch('src.routes.stocks.stocks_get.Tickers', return_value=mock_tickers)
    
    response = mock_app.get("/stocks?symbols=AAPL,MSFT")
    assert response.status_code == 200
    data = response.json()
    assert len(data["data"]) == 2