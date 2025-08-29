from src.tests.mock_app import mock_app
from src.config import get_package_version

def test_root_endpoint(mock_app):
    response = mock_app.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to Stratify Data API"}

def test_health_endpoint(mock_app):
    response = mock_app.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "Ok", "version": get_package_version()}