from unittest.mock import MagicMock
from src.tests.mock_app import mock_app
from src.routes.funds._mocks.mock_yfinance_fund_info import mock_yfinance_fund_info
from src.routes.funds._mocks.mock_yfinance_fund_sector_weightings import mock_fund_sector_weightings
from src.routes.funds._mocks.mock_fund_data import mock_fund_data

def test_get_fund_success(mock_app, mocker):
    mock_ticker = MagicMock(info=mock_yfinance_fund_info, funds_data=MagicMock(sector_weightings=mock_fund_sector_weightings))
    
    mocker.patch("src.routes.funds.symbol.fund_symbol_get.Ticker", return_value=mock_ticker)

    response = mock_app.get("/funds/SP500")
    assert response.status_code == 200
    
    data = response.json()
    assert "data" in data
    assert data["data"] == mock_fund_data
    
def test_get_fund_not_found(mock_app, mocker):
    mock_ticker = MagicMock(info=None)
    
    mocker.patch('src.routes.funds.symbol.fund_symbol_get.Ticker', return_value=mock_ticker)

    response = mock_app.get("/funds/INVALID")
    assert response.status_code == 404
    
    errorMessage = response.json()['detail']
    assert errorMessage == "No data found for symbol: INVALID"
