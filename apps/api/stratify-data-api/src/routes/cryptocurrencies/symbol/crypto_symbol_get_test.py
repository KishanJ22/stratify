from unittest.mock import MagicMock
from src.tests.mock_app import mock_app
from src.routes.cryptocurrencies._mocks.mock_cryptocurrency_data import mock_cryptocurrency_data
from src.routes.cryptocurrencies._mocks.mock_yfinance_crypto_data import mock_yfinance_crypto_data

def test_get_cryptocurrency_success(mock_app, mocker):
    mock_ticker = MagicMock(info=mock_yfinance_crypto_data)

    mocker.patch("src.routes.cryptocurrencies.symbol.crypto_symbol_get.Ticker", return_value=mock_ticker)

    response = mock_app.get("/cryptocurrencies/BTC-USD")
    assert response.status_code == 200
    data = response.json()
    
    assert "data" in data
    assert data["data"] == mock_cryptocurrency_data
    
def test_get_cryptocurrency_not_found(mock_app, mocker):
    mock_ticker = MagicMock(info=None)
    
    mocker.patch("src.routes.cryptocurrencies.symbol.crypto_symbol_get.Ticker", return_value=mock_ticker)
    
    response = mock_app.get("/cryptocurrencies/INVALID-CRYPTO")
    assert response.status_code == 404
    data = response.json()
    
    assert data["detail"] == "Cryptocurrency with symbol INVALID-CRYPTO not found"
    