import re

def clean_symbol(symbol: str):
    cleaned = re.sub(r'["\'\s]', '', symbol.strip())
    # Keep only alphanumeric characters, hyphens, and dots (common in stock/cryptocurrency symbols)
    cleaned = re.sub(r'[^A-Za-z0-9\-\.]', '', cleaned)
    return cleaned.upper()