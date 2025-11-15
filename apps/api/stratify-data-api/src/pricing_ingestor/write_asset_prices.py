from src.pricing_ingestor.pricing_ingestor_schema import Asset
from src.custom_logger import get_logger
import json
import os

logger = get_logger("write_asset_prices")

def write_asset_prices_to_json(asset: Asset, filepath: str):
    filename = get_json_filename(asset.ticker, asset.country, filepath)
    asset_prices_list = asset.assetPriceList
    
    if not asset_prices_list or len(asset_prices_list) == 0:
        logger.warning(f"No asset prices to write for {filename}")
        return
    
    output_path = os.path.join(os.path.dirname(__file__), "data", "output", f"{filename}.json")
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    data = {
        "ticker": asset.ticker,
        "country": asset.country,
        "type": asset.type,
        "assetPricesList": [asset_price.model_dump() for asset_price in asset_prices_list]
    }
    
    with open(output_path, 'w') as json_file:
        json.dump(data, json_file, indent=2)
        
def get_json_filename(ticker: str, country_code: str, filepath: str):
    is_currency = filepath.lower().find("currencies") != -1
    is_cryptocurrency = filepath.lower().find("cryptocurrencies") != -1
    
    if is_cryptocurrency:
        return f"asset_prices_{ticker.lower()}_cryptocurrency"
    
    if is_currency and not is_cryptocurrency:
        return f"asset_prices_{ticker.lower()}_currency"
    
    return f"asset_prices_{ticker.lower()}_{country_code.lower()}"