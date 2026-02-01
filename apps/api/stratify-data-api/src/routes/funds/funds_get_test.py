from unittest.mock import MagicMock
from src.tests.mock_app import mock_app
from src.routes.funds._mocks.mock_yfinance_fund_data import mock_yfinance_fund_data
from src.routes.funds._mocks.mock_fund_data import mock_fund_data

def test_get_funds_success(mock_app, mocker):
    mock_tickers = MagicMock(tickers={
        "SP500": MagicMock(info=mock_yfinance_fund_data),
        "FTSE100": MagicMock(info=mock_yfinance_fund_data)
    })
    
    mocker.patch("src.routes.funds.funds_get.Tickers", return_value=mock_tickers)

    response = mock_app.get("/funds?symbols=SP500,FTSE100")
    assert response.status_code == 200
    
    data = response.json()
    funds = data["data"]
    
    assert len(funds) == 2
    for fund in funds:
        assert fund == mock_fund_data
    
def test_get_funds_no_data_found(mock_app, mocker):
    mock_tickers = MagicMock(tickers={ "INVALID": MagicMock(info=None) })
    
    mocker.patch('src.routes.funds.funds_get.Tickers', return_value=mock_tickers)

    response = mock_app.get("/funds?symbols=INVALID")
    assert response.status_code == 404
    
    errorMessage = response.json()['detail']
    assert errorMessage == "No fund data found for provided symbols"
    
    
def test_get_funds_bad_request(mock_app):
    response = mock_app.get("/funds?symbols=")
    assert response.status_code == 400
    
    errorMessage = response.json()['detail']
    assert errorMessage == "No valid fund symbols provided"