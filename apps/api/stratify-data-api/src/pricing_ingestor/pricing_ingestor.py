import os
import pandas as pd
import glob
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

columns = ["ticker", "per", "date", "time", "open", "high", "low", "close", "volume", "openint"]

def data_validation(dataframe: pd.DataFrame, filepath: str):
    issues = []

    for column in columns:
        if column not in dataframe.columns:
            issues.append(f"Missing required column: {column}")
            
    return {
        "filepath": filepath,
        "issues": issues,
        "is_valid": len(issues) == 0
    }

def ingest_data(filepath: str):
    if not os.path.exists(filepath):
        logger.error(f"File not found: {filepath}")
        raise FileNotFoundError(f"File not found: {filepath}")
    
    try:
        df = pd.read_csv(filepath, header=0)
        df.columns = columns
        validate_data = data_validation(df, filepath)
        
        if not validate_data["is_valid"]:
            logger.error(f"Data validation failed for {filepath}: {validate_data['issues']}")
            return {
                "filepath": filepath,
                "issues": validate_data['issues'],
                "success": False,
            }
            
        df = df[columns]

        # Convert date to proper format
        df["date"] = pd.to_datetime(df["date"], format="%Y%m%d", errors="raise").dt.strftime("%Y-%m-%d")

        return {
            "data": df.to_json(orient='records'),
            "success": True,
            }
    except Exception as err:
        logger.error(f"Error processing file {filepath}: {err}")
        return {
            "filepath": filepath,
            "error": str(err),
            "success": False,
        }

def pricing_ingestor():
    data_folder = os.path.dirname(os.path.realpath(__file__))

    if not os.path.exists(data_folder):
        logger.error(f"Data folder not found: {data_folder}")
        return []

    glob_pattern = os.path.join(data_folder, "**", "*.txt")
    txt_files = glob.glob(glob_pattern, recursive=True)
    
    if not txt_files:
        logger.error(f"No text files found in {data_folder}")
        return []

    result = []
    successful_files = 0
    
    for filepath in txt_files:
        ingest_data = ingest_data(filepath)
        json_data = ingest_data["data"]
        
        if json_data is not None and len(json_data) > 0:
            result.append(json_data)

    logger.info(f"Successfully ingested {successful_files}/{len(txt_files)} files.")
    
    return result

if __name__ == "__main__":
    pricing_ingestor()