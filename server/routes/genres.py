from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from services.genre import get_genres_from_db
from database import get_db

router = APIRouter()

@router.get("/")
def get_genres_route(db: Session = Depends(get_db)):
    return get_genres_from_db(db)

