from unittest.mock import MagicMock
from src.tests.mock_app import mock_app
from src.routes.cryptocurrencies._mocks.mock_cryptocurrency_data import mock_cryptocurrency_data
from src.routes.cryptocurrencies._mocks.mock_yfinance_crypto_data import mock_yfinance_crypto_data

def test_get_cryptocurrencies_success(mock_app, mocker):    
    mock_tickers = MagicMock(tickers={
        "BTC-USD": MagicMock(info=mock_yfinance_crypto_data),
        "ETH-USD": MagicMock(info=mock_yfinance_crypto_data),
    })

    mocker.patch("src.routes.cryptocurrencies.cryptocurrencies_get.Tickers", return_value=mock_tickers)

    response = mock_app.get("/cryptocurrencies?symbols=BTC-USD,ETH-USD")
    assert response.status_code == 200
    data = response.json()
    
    assert len(data["data"]) == 2

def test_get_cryptocurrencies_not_found(mock_app, mocker):    
    mock_tickers = MagicMock(tickers={
        "INVALID-CRYPTO": MagicMock(info=None),
        "BTC-USD": MagicMock(info=None),
    })
    
    mocker.patch("src.routes.cryptocurrencies.cryptocurrencies_get.Tickers", return_value=mock_tickers)
    
    response = mock_app.get("/cryptocurrencies?symbols=INVALID-CRYPTO,BTC-USD")
    assert response.status_code == 404
    data = response.json()
    
    assert data["detail"] == "No cryptocurrency data found for the provided symbols"

def test_get_cryptocurrencies_no_symbols(mock_app):
    response = mock_app.get("/cryptocurrencies?symbols=")
    assert response.status_code == 400
    
    errorMessage = response.json()['detail']
    assert errorMessage == "At least one symbol is required"
