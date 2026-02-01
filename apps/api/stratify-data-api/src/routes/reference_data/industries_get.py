from src.utils.kebab_to_camel_case import kebab_to_camel_case
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from yfinance import Sector
from typing import List

# Required for mocking the list of sectors in tests
# List of sector names available in yfinance 
# See https://ranaroussi.github.io/yfinance/reference/api/yfinance.Sector.html#yfinance.Sector
def get_sector_names():
    return [
    'basic-materials', 
    'communication-services', 
    'consumer-cyclical', 
    'consumer-defensive', 
    'energy', 
    'financial-services', 
    'healthcare', 
    'industrials', 
    'real-estate', 
    'technology', 
    'utilities'
]

class IndustriesGetResponse(BaseModel):
    data: List[str]

industries_get = APIRouter()

@industries_get.get("/reference-data/industries", tags=["reference-data"])
async def get_industries():
    try:
        industry_list = []
        sector_names = get_sector_names()
        
        for sector in sector_names:
            sector_industries = Sector(sector).industries
            industry_list.extend(sector_industries['name'].keys().tolist())
            
        industry_list = [kebab_to_camel_case(industry) for industry in industry_list]
        
        return IndustriesGetResponse(data=industry_list)
    except HTTPException:
        raise
    except Exception as e:
        print("Error fetching industries:", e)
        raise HTTPException(status_code=500, detail="Internal Server Error")