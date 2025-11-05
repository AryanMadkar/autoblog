from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class BlogPost(BaseModel):
    title: str
    content: str
    image_url: str
    tags: List[str]
    category: str
    created_at: datetime = Field(default_factory=datetime.utcnow)


class BlogResponse(BaseModel):
    id: str
    title: str
    content: str
    image_url: str
    tags: List[str]
    category: str
    created_at: datetime
