from fastapi import APIRouter, HTTPException
from typing import Optional, Dict, Any
from yfinance import Ticker
from src.utils.safe_nested_get import safe_nested_get
from src.routes.stocks.symbol.symbol_news_schema import (
    NewsArticle, 
    NewsResponse, 
    Thumbnails, 
    OriginalThumbnailData, 
    ThumbnailData, 
    Provider
)

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
        
        if not news_data or len(news_data) == 0:
            raise HTTPException(status_code=404, detail="Stock news not found")

        formatted_news = []
        
        for article in news_data:
            article_content = article.get("content") if "content" in article else None
            if not article_content:
                continue
            formatted_news.append(format_news_data(article_content))

        return NewsResponse(data=formatted_news)
    except HTTPException:
        # Required for properly returning error responses
        raise
    except Exception as err:
        print(f"Error retrieving stock news: {err}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error {err}"
        )
