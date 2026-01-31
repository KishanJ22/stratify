from fastapi import APIRouter, HTTPException
from yfinance import Sector
from pydantic import BaseModel
from typing import List
from src.utils.kebab_to_camel_case import kebab_to_camel_case

class IndustriesGetResponse(BaseModel):
    data: List[str]

# List of sector names available in yfinance 
# See https://ranaroussi.github.io/yfinance/reference/api/yfinance.Sector.html#yfinance.Sector
sector_names = [
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

industries_get = APIRouter()

@industries_get.get("/reference-data/industries", tags=["reference-data"])
async def get_industries() -> IndustriesGetResponse:
    try:
        industries_list = []
        
        for sector in sector_names:
            sector_industries = Sector(sector).industries
            industries_list.extend(sector_industries['name'].keys().tolist())
            
        industries_list = [kebab_to_camel_case(industry) for industry in industries_list]
        
        return IndustriesGetResponse(data=industries_list)
    except HTTPException:
        raise
    except Exception as e:
        print("Error fetching industries:", e)
        raise HTTPException(status_code=500, detail="Internal Server Error")