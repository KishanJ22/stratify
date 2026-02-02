from unittest.mock import MagicMock
from src.tests.mock_app import mock_app
import pandas as pd

def test_get_industries_success(mock_app, mocker):
    mock_sector = MagicMock(
        industries=pd.DataFrame({
            'name': {
                'software-applications': {},
                'information-technology': {},
            }
    }))
    
    mock_sector_names = MagicMock()
    mock_sector_names.return_value = ['technology']
    
    mocker.patch("src.routes.reference_data.industries_get.get_sector_names", return_value=mock_sector_names())
    mocker.patch("src.routes.reference_data.industries_get.Sector", return_value=mock_sector)
    
    response = mock_app.get("/reference-data/industries")
    assert response.status_code == 200
    
    data = response.json()
    industries=data["data"]
    
    assert len(industries) == 2
    assert industries == ["softwareApplications", "informationTechnology"]
    
def test_get_industries_failure(mock_app, mocker):
    mock_sector_names = MagicMock()
    mock_sector_names.return_value = ['technology']
    
    mocker.patch("src.routes.reference_data.industries_get.get_sector_names", return_value=mock_sector_names())
    mocker.patch("src.routes.reference_data.industries_get.Sector", side_effect=Exception("Industries could not be fetched"))
    
    response = mock_app.get("/reference-data/industries")
    assert response.status_code == 500
    
    data = response.json()
    assert data["detail"] == "Internal Server Error"
    