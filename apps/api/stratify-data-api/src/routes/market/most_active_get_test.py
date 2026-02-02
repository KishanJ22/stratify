from src.tests.mock_app import mock_app
from src.routes.market._mocks.mock_quote_data import mock_quote_data

def test_get_most_active_success(mock_app, mocker):
    mocker.patch("src.routes.market.most_active_get.query_by_trading_activity", return_value=[mock_quote_data])
    
    response = mock_app.get("/market/most-active")
    assert response.status_code == 200
    data = response.json()
    
    assert "data" in data
    assert len(data["data"]) == 1
    assert data["data"][0] == mock_quote_data
    
def test_get_most_active_no_data(mock_app, mocker):
    mocker.patch("src.routes.market.most_active_get.query_by_trading_activity", return_value=[])
    
    response = mock_app.get("/market/most-active")
    assert response.status_code == 404
    errorMessage = response.json()['detail']
    
    assert errorMessage == "No assets found with the specified criteria."