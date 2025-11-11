from src.pricing_ingestor.pricing_ingestor_schema import AssetPrice
from src.custom_logger import get_logger
from typing import List
import json
import os

logger = get_logger("write_asset_prices")

def write_asset_prices_to_json(asset_prices_list: List[AssetPrice], filename: str):
    if not asset_prices_list:
        logger.warning(f"No asset prices to write for {filename}")
        return

    output_path = os.path.join(os.path.dirname(__file__), "data", "output", f"{filename}.json")
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    data = {
        "asset_prices": [asset_price.model_dump() for asset_price in asset_prices_list]
    }
    
    with open(output_path, 'w') as json_file:
        json.dump(data, json_file, indent=2)
        