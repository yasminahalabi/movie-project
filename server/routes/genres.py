from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from services.genre import get_genres_from_db
from database import get_db

router = APIRouter()

@router.get("/")
def get_genres_route(db: Session = Depends(get_db)):
    try:
        genres = get_genres_from_db(db)
        if not genres:
            raise HTTPException(status_code=404, detail="No genres found")
        return genres
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

