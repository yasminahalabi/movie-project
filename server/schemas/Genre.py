from pydantic import BaseModel
from typing import Optional


class GenreSchema(BaseModel):
    
    id: Optional[int] = None
    name: str
    image: Optional[str] = None