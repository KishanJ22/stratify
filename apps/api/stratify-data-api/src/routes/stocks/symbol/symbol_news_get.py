from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from yfinance import Ticker
from src.utils.safe_nested_get import safe_nested_get

class OriginalThumbnailData(BaseModel):
    url: Optional[str] = None
    width: Optional[int] = None
    height: Optional[int] = None
    caption: Optional[str] = None
    
class ThumbnailData(BaseModel):
    url: Optional[str] = None
    width: Optional[int] = None
    height: Optional[int] = None
    tag: Optional[str] = None

class Thumbnails(BaseModel):
    original: OriginalThumbnailData
    variants: List[ThumbnailData]

class Provider(BaseModel):
    name: Optional[str] = None
    url: Optional[str] = None

class NewsArticle(BaseModel):
    title: Optional[str] = None
    contentType: Optional[str] = None
    summary: Optional[str] = None
    publishedDate: Optional[str] = None
    thumbnails: Optional[Thumbnails] = None
    provider: Optional[Provider] = None
    articleUrl: Optional[str] = None

class NewsResponse(BaseModel):
    data: List[NewsArticle]

def format_news_data(article: Dict[str, Any]) -> Optional[NewsArticle]:
    if not article:
        return None
    
    thumbnail_data = None
    thumbnail = article.get("thumbnail")
    if thumbnail:
        thumbnail_data = Thumbnails(
            original=OriginalThumbnailData(
                url=thumbnail.get("originalUrl"),
                width=thumbnail.get("originalWidth"),
                height=thumbnail.get("originalHeight"),
                caption=thumbnail.get("caption")
            ),
            variants=[
                ThumbnailData(
                    url=variant.get("url"),
                    width=variant.get("width"),
                    height=variant.get("height"),
                    tag=variant.get("tag"),
                ) for variant in thumbnail.get("resolutions", [])
            ]
        )
    
    provider_data = None
    provider = article.get("provider")
    if provider:
        provider_data = Provider(
            name=provider.get("displayName"),
            url=provider.get("url")
        )
        
    article_url = safe_nested_get(article, "canonicalUrl", "url")
    
    return NewsArticle(
        title=article.get("title"),
        contentType=article.get("contentType"),
        summary=article.get("summary"),
        publishedDate=article.get("pubDate"),
        thumbnails=thumbnail_data,
        provider=provider_data,
        articleUrl=article_url
    )

symbol_news_get = APIRouter()

@symbol_news_get.get("/stocks/{symbol}/news", tags=["stocks"])
async def get_stock_news(symbol: str):
    try:
        news_data = Ticker(symbol).news
        
        if not news_data or not news_data.get("content"):
            raise HTTPException(status_code=404, detail="Stock news not found")

        formatted_news = []
        
        for article in news_data:
            article_content = article.get("content") if "content" in article else None
            if not article_content:
                continue
            formatted_news.append(format_news_data(article_content))

        return NewsResponse(data=formatted_news)
        # return {"data": news_data}
    except HTTPException:
        # Required for properly returning error responses
        raise
    except Exception as err:
        print(f"Error retrieving stock news: {err}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error {err}"
        )
