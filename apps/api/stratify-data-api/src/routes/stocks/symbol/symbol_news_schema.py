from pydantic import BaseModel
from typing import Optional, List

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