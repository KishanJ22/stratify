import pytest
import pandas as pd
import os
import tempfile
from unittest.mock import patch
from src.pricing_ingestor.pricing_ingestor import (
    data_validation,
    ingest_data,
    pricing_ingestor,
    columns,
)
from src.pricing_ingestor.mock_pricing_ingestor_data import valid_csv_data, invalid_csv_missing_columns
from src.pricing_ingestor.pricing_ingestor_schema import PricingIngestorSuccess

# Data validation tests
def test_data_validation_success():
    df = pd.DataFrame([
        ['AAPL', 'D', '20240115', 0, 150.25, 152.30, 149.80, 151.75, 1000000, 0]
    ], columns=columns)
    
    result = data_validation(df, "test.csv")
    
    assert result["is_valid"] is True
    assert result["issues"] == []

def test_data_validation_missing_columns():
    df = pd.DataFrame([
        ['AAPL', '20240115', 150.25, 152.30, 149.80, 151.75]
    ], columns=['ticker', 'date', 'open', 'high', 'low', 'close'])
    
    result = data_validation(df, "test.csv")
    
    assert result["is_valid"] is False
    assert "Missing required columns" in result["issues"][0]

def test_data_validation_empty_dataframe():
    df = pd.DataFrame(columns=columns)
    
    result = data_validation(df, "test.csv")
    
    assert result["is_valid"] is False
    assert "File contains no data rows" in result["issues"][0]

def test_data_validation_null_values():
    df = pd.DataFrame([
        [None, 'D', '20240115', 0, 150.25, 152.30, 149.80, 151.75, 1000000, 0]
    ], columns=columns)
    
    result = data_validation(df, "test.csv")
    
    assert result["is_valid"] is False
    assert any("ticker" in issue and "null values" in issue for issue in result["issues"])

# Data ingestion tests
def test_ingest_data_success():
    with tempfile.NamedTemporaryFile(mode='w', suffix='.csv', delete=False) as f:
        f.write(valid_csv_data)
        temp_filepath = f.name
    
    try:
        result = ingest_data(temp_filepath)
        assert result.success is True
        assert len(result.data.assetPriceList) == 2
        assert result.data.ticker == "AAPL"
        assert result.data.country == "US"
    finally:
        os.unlink(temp_filepath)

def test_ingest_data_file_not_found():
    result = ingest_data("nonexistent_file.csv")
    
    assert result.success is False
    assert result.error == "File not found"

def test_ingest_data_invalid_file():
    with tempfile.NamedTemporaryFile(mode='w', suffix='.csv', delete=False) as f:
        f.write(invalid_csv_missing_columns)
        temp_filepath = f.name
    
    try:
        result = ingest_data(temp_filepath)
        assert result.success is False
        assert result.error == "Data validation failed"
    finally:
        os.unlink(temp_filepath)

# Pricing ingestor tests
@patch('src.pricing_ingestor.pricing_ingestor.get_files')
@patch('src.pricing_ingestor.pricing_ingestor.ingest_data')
# This test is for making sure that no errors are thrown during normal operation
def test_pricing_ingestor_success(mock_ingest_data, mock_get_files):
    mock_get_files.return_value = ['file1.txt', 'file2.txt']
    
    mock_ingest_data.side_effect = [
     PricingIngestorSuccess(
        success=True,
        data={
            "ticker": "USB",
            "country": "US",
            "type": "stock",
            "assetPriceList": [
                {
                    "date": "2025-11-04",
                    "open": 46.43,
                    "high": 46.985,
                    "low": 46.155,
                    "close": 46.43,
                    "volume": 7204300.0
                },
                {
                    "date": "2025-11-05",
                    "open": 46.475,
                    "high": 47.0061,
                    "low": 46.015,
                    "close": 46.74,
                    "volume": 5577193.0
                }
            ]
        }
     ),
    PricingIngestorSuccess(
        success=True,
        data={
            "ticker": "MSFT",
            "country": "US",
            "type": "stock",
            "assetPriceList": [
                {
                    "date": "2025-11-04",
                    "open": 330.00,
                    "high": 335.00,
                    "low": 329.00,
                    "close": 334.00,
                    "volume": 2000000.0
                },
                {
                    "date": "2025-11-05",
                    "open": 334.50,
                    "high": 338.00,
                    "low": 333.00,
                    "close": 337.00,
                    "volume": 1800000.0
                }
            ]
        }
    )
    ]
    
    pricing_ingestor()

@patch('glob.glob')
@patch('os.path.exists')
def test_pricing_ingestor_no_files(mock_exists, mock_glob):
    mock_exists.return_value = True
    mock_glob.return_value = []
    
    pricing_ingestor()

# Fixtures
@pytest.fixture
def valid_dataframe():
    return pd.DataFrame([
        ['AAPL', 'D', '20240115', 0, 150.25, 152.30, 149.80, 151.75, 1000000, 0]
    ], columns=columns)