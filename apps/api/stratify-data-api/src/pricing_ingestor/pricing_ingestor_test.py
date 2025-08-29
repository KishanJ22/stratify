import pytest
import pandas as pd
import os
import tempfile
from unittest.mock import patch
from src.pricing_ingestor.pricing_ingestor import (
    data_validation,
    ingest_data,
    pricing_ingestor,
    columns
)
from src.pricing_ingestor.mock_pricing_ingestor_data import valid_csv_data, invalid_csv_missing_columns

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
        assert result["success"] is True
        assert len(result["data"]) == 2
        assert result["data"][0]["ticker"] == "AAPL"
    finally:
        os.unlink(temp_filepath)

def test_ingest_data_file_not_found():
    with pytest.raises(FileNotFoundError):
        ingest_data("nonexistent_file.csv")

def test_ingest_data_invalid_file():
    with tempfile.NamedTemporaryFile(mode='w', suffix='.csv', delete=False) as f:
        f.write(invalid_csv_missing_columns)
        temp_filepath = f.name
    
    try:
        result = ingest_data(temp_filepath)
        assert result["success"] is False
        assert "issues" in result
    finally:
        os.unlink(temp_filepath)

# Pricing ingestor tests
@patch('glob.glob')
@patch('os.path.exists')
@patch('src.pricing_ingestor.pricing_ingestor.ingest_data')
def test_pricing_ingestor_success(mock_ingest_data, mock_exists, mock_glob):
    mock_exists.return_value = True
    mock_glob.return_value = ['file1.txt', 'file2.txt']
    
    mock_ingest_data.side_effect = [
        {"success": True, "data": [{"ticker": "AAPL", "close": 151.75}]},
        {"success": True, "data": [{"ticker": "MSFT", "close": 344.80}]}
    ]
    
    result = pricing_ingestor()
    
    assert len(result) == 2
    assert result[0]["ticker"] == "AAPL"

@patch('glob.glob')
@patch('os.path.exists')
def test_pricing_ingestor_no_files(mock_exists, mock_glob):
    mock_exists.return_value = True
    mock_glob.return_value = []
    
    result = pricing_ingestor()
    assert result == []

# Fixtures
@pytest.fixture
def valid_dataframe():
    return pd.DataFrame([
        ['AAPL', 'D', '20240115', 0, 150.25, 152.30, 149.80, 151.75, 1000000, 0]
    ], columns=columns)