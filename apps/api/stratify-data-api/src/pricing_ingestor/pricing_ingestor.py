import os
import time
import pandas as pd
import glob
from src.custom_logger import get_logger

logger = get_logger(__name__)

columns = ["ticker", "per", "date", "time", "open", "high", "low", "close", "volume", "openint"]

csv_headers = ["<TICKER>", "<PER>", "<DATE>", "<TIME>", "<OPEN>", "<HIGH>", "<LOW>", "<CLOSE>", "<VOL>", "<OPENINT>"]
header_mapping = dict(zip(csv_headers, columns))

def data_validation(dataframe: pd.DataFrame, filepath: str):
    issues = []

    missing_columns = [col for col in columns if col not in dataframe.columns]
    if missing_columns:
        issues.append(f"Missing required columns: {missing_columns}")
        return {
            "filepath": filepath,
            "issues": issues,
            "is_valid": False
        }
        
    if dataframe.empty:
        issues.append("File contains no data rows")
        return {
            "filepath": filepath,
            "issues": issues,
            "is_valid": False,
            "row_count": 0
        }
        
    critical_columns = ["ticker", "date", "open", "high", "low", "close"]
    for col in critical_columns:
        null_count = dataframe[col].isnull().sum()
        if null_count > 0:
            issues.append(f"Column '{col}' has {null_count} null values")
            
    numeric_columns = ["open", "high", "low", "close", "volume"]
    ohlc_columns = ["open", "high", "low", "close"]
    for col in numeric_columns:
        if not pd.api.types.is_numeric_dtype(dataframe[col]):
            try:
                pd.to_numeric(dataframe[col], errors='raise')
            except (ValueError, TypeError):
                issues.append(f"Column '{col}' contains non-numeric values")
            
        if col in ohlc_columns:
            negative_count = (dataframe[col] < 0).sum()
            if negative_count > 0:
                issues.append(f"Column '{col}' has {negative_count} negative values")
                
        if col == "high":
            invalid_high = (dataframe["high"] < dataframe["low"]).sum()
            if invalid_high > 0:
                issues.append(f"Column 'high' has {invalid_high} values less than 'low'")
            
    try:
        dates = pd.to_datetime(dataframe["date"].astype(str), format="%Y%m%d", errors='raise')
        today = pd.to_datetime(time.strftime("%Y-%m-%d"))
        future_dates_count = (dates > today).sum()
        if future_dates_count > 0:
            issues.append(f"Column 'date' has {future_dates_count} future dates")
    except Exception as e:
        issues.append(f"Invalid date format in column 'date': {str(e)}")
    
    if dataframe['ticker'].str.strip().eq('').any():
        issues.append("Column 'ticker' contains empty strings")
        
    duplicates = dataframe.duplicated(subset=["ticker", "date", "time"]).sum()
    if duplicates > 0:
        issues.append(f"Data contains {duplicates} duplicate rows based on ['ticker', 'date', 'time']")

    return {
        "filepath": filepath,
        "issues": issues,
        "is_valid": len(issues) == 0
    }

def ingest_data(filepath: str):
    if not os.path.exists(filepath):
        logger.error(f"File not found: {filepath}")
        return {
            "filepath": filepath,
            "error": "File not found",
            "success": False,
        }
        
    if os.path.getsize(filepath) == 0:
        logger.warning(f"File is empty: {filepath}")
        return {
            "filepath": filepath,
            "issues": ["File is empty"],
            "data": [],
            "success": False,
        }
        
    try:
        df = pd.read_csv(filepath, header=0)
        df = df.rename(columns=header_mapping)
        
        validate_data = data_validation(df, filepath)
        
        if not validate_data["is_valid"]:
            logger.error(f"Data validation failed for {filepath}: {validate_data['issues']}")
            return {
                "filepath": filepath,
                "issues": validate_data['issues'],
                "data": [],
                "success": False,
            }
            
        df = df[columns]

        # Convert date to proper format
        df["date"] = pd.to_datetime(df["date"], format="%Y%m%d", errors="raise").dt.strftime("%Y-%m-%d")
        records = df.to_dict(orient='records')

        return {
            "data": records,
            "success": True,
        }
    except Exception as err:
        logger.error(f"Error processing file {filepath}: {err}")
        return {
            "filepath": filepath,
            "error": str(err),
            "success": False,
        }
        
def get_files():
    data_folder = os.path.join(os.path.dirname(__file__), "data")

    if not os.path.exists(data_folder):
        logger.error(f"Data folder not found: {data_folder}")
        return []

    glob_pattern = os.path.join(data_folder, "**", "*.txt")
    txt_files = glob.glob(glob_pattern, recursive=True)
    
    if not txt_files:
        logger.error(f"No text files found in {data_folder}")
        return []
    
    return txt_files    

def pricing_ingestor():
    txt_files = get_files()
    start_time = time.time()
    result = []
    successful_files = 0
    
    for filepath in txt_files:
        
        ingestion_result = ingest_data(filepath)
        records = ingestion_result.get("data", [])

        if records:
            result.extend(records)
            successful_files += 1

    logger.info(f"Successfully ingested {successful_files}/{len(txt_files)} files.")
    logger.info(f"Took {time.time() - start_time:.2f} seconds to ingest data.")
    
    return result

if __name__ == "__main__":
    pricing_ingestor()
