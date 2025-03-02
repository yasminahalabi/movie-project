from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class MovieSchema(BaseModel):
    id: Optional[int] = None
    title: str
    description: Optional[str] = None
    release_date: datetime
    url_image: Optional[str] = None
    duration: int
    genre_ids: List[int]
    actors: List[str]
    director: str
    language: str
    rating: Optional[float] = Field(None, ge=0, le=10)  # דירוג כללי (למשל IMDB)
    star_rating: Optional[float] = Field(None, ge=1, le=5)  # דירוג בכוכבים 1-5
    awards: List[str] = []
    age_restriction: Optional[int] = None
    watchurl: Optional[str] = None
