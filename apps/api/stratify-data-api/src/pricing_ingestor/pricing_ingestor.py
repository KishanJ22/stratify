import os
import time
import pandas as pd
import glob
from src.custom_logger import get_logger
from src.pricing_ingestor.write_asset_prices import write_asset_prices_to_json
from src.pricing_ingestor.pricing_ingestor_schema import Asset, AssetPrice, PricingIngestorSuccess, PricingIngestorFailure

logger = get_logger("pricing_ingestor")

columns = ["ticker", "per", "date", "time", "open", "high", "low", "close", "volume", "openint"]
csv_headers = ["<TICKER>", "<PER>", "<DATE>", "<TIME>", "<OPEN>", "<HIGH>", "<LOW>", "<CLOSE>", "<VOL>", "<OPENINT>"]

header_mapping = dict(zip(csv_headers, columns))

def data_validation(dataframe: pd.DataFrame, filepath: str):
    issues = []
    fixes = []

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
            # Get rows where there are negative numbers
            negative_number_mask = dataframe[col] < 0
            negative_count = negative_number_mask.sum()
            # Remove rows with negative numbers from the dataframe
            dataframe = dataframe[~negative_number_mask]
            if negative_count > 0:
                fixes.append(f"Removed {negative_count} rows with negative values in column '{col}'")
                
        if col == "high":
            # Get rows where 'high' is less than 'low'
            invalid_high_mask = dataframe['high'] < dataframe['low']
            invalid_high_count = invalid_high_mask.sum()
            # Remove invalid rows from the dataframe
            dataframe = dataframe[~invalid_high_mask]
            if invalid_high_count > 0:
                fixes.append(f"Removed {invalid_high_count} rows where 'high' is less than 'low'")

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
        
    # Look for duplicate rows based on the ticker, date and time values
    duplicate_subset = ["ticker", "date", "time"]
    duplicates = dataframe.duplicated(subset=duplicate_subset).sum()
    # Remove duplicate rows
    dataframe.drop_duplicates(subset=duplicate_subset, inplace=True)
    if duplicates > 0:
        fixes.append(f"Removed {duplicates} duplicate rows based on ['ticker', 'date', 'time']")

    return {
        "filepath": filepath,
        "fixes": fixes,
        "issues": issues,
        "is_valid": len(issues) == 0
    }

def determine_asset_type(filepath: str) -> str:
    is_currency = filepath.lower().find("currencies") != -1
    is_cryptocurrency = filepath.lower().find("cryptocurrencies") != -1
    
    if is_cryptocurrency:
        return "cryptocurrency"
    
    if is_currency and not is_cryptocurrency:
        return "currency"
    
    return "stock"    

def split_ticker(df: pd.DataFrame, filepath: str) -> tuple[str, str]:
        is_currency = filepath.lower().find("currencies") != -1
        is_cryptocurrency = filepath.lower().find("cryptocurrencies") != -1
       
        # Get the first ticker value (format: TICKER.COUNTRY_CODE)
        ticker = df["ticker"].iloc[0]
        # Split the ticker by the dot to separate ticker and country code
        split_ticker = ticker.split(".")
        
        # Return early for currency files as they do not have country codes in tickers
        if is_currency and not is_cryptocurrency:
            country_code = "US" # TODO - Set to country code based on currency mapping
            return ticker, country_code
        
        if len(split_ticker) != 2:
            raise ValueError(f"Invalid ticker format '{ticker}' in file {filepath}")
            
        ticker, country_code = split_ticker
        
        if country_code == "UK":
            country_code = "GB" # Normalize UK to GB country code for United Kingdom
            
        if country_code == "V":
            country_code = "US" # For cryptocurrencies, set country to US
        
        return ticker, country_code

# Remove all columns except for the OHLCV columns
def remove_unnecessary_columns(df: pd.DataFrame):
    columns_to_remove = ["ticker", "per", "time", "openint"]
    df.drop(columns=columns_to_remove, inplace=True, errors='ignore')

def ingest_data(filepath: str):
    if not os.path.exists(filepath):
        return PricingIngestorFailure(
            filepath=filepath,
            error="File not found",
            success=False,
        )
        
    if os.path.getsize(filepath) == 0:
        return PricingIngestorFailure(
            filepath=filepath,
            error=f"File is empty : {filepath}",
            success=False,
        )
        
    try:
        df = pd.read_csv(filepath, header=0)
        df = df.rename(columns=header_mapping)
        
        validate_data = data_validation(df, filepath)
        
        if validate_data.get("is_valid") is False:
            logger.error(f"Failed to ingest data from {filepath}")
            for issue in validate_data.get("issues", []):
                logger.error(f"Issue: {issue}")
            
            return PricingIngestorFailure(
                filepath=filepath,
                error="Data validation failed",
                success=False,
            )
            
        df = df[columns]

        ticker, country = split_ticker(df, filepath)
        type = determine_asset_type(filepath)
        remove_unnecessary_columns(df)

        # Convert date to the correct format
        df["date"] = pd.to_datetime(df["date"], format="%Y%m%d", errors="raise").dt.strftime("%Y-%m-%d")
        records = df.to_dict(orient='records')
        
        if validate_data.get("fixes"):
            logger.info(f"Data fixes applied for {ticker}:")
            for fix in validate_data.get("fixes"):
                logger.info(fix)
                
        asset = Asset(
            ticker=ticker,
            country=country,
            type=type,
            assetPriceList=[AssetPrice(**record) for record in records]
        )

        return PricingIngestorSuccess(
            data=asset,
            success=True,
        )
    except Exception as err:
        return PricingIngestorFailure(
            filepath=filepath,
            error=str(err),
            success=False,
        )
        
def get_files():
    data_folder = os.path.join(os.path.dirname(__file__), "data")

    if not os.path.exists(data_folder):
        logger.error(f"Data folder not found: {data_folder}")
        return []

    glob_pattern = os.path.join(data_folder, "**", "*.txt")
    csv_files = glob.glob(glob_pattern, recursive=True)
    
    if not csv_files:
        logger.error(f"No CSV files found in {data_folder}")
        return []
    
    return csv_files    

def pricing_ingestor():
    txt_files = get_files()
    start_time = time.time()
    successful_files = 0
    
    for filepath in txt_files:
        ingestion_result = ingest_data(filepath)
        if ingestion_result.success is True:
            
            asset_data = ingestion_result.data
            write_asset_prices_to_json(asset_data, filepath)
            successful_files += 1
        else:
            if ingestion_result.error:
                logger.error(f"Error details: {ingestion_result.error}")
    
    logger.info(f"Successfully ingested {successful_files}/{len(txt_files)} files.")
    logger.info(f"Took {time.time() - start_time:.2f} seconds to ingest data.")

if __name__ == "__main__":
    pricing_ingestor()
