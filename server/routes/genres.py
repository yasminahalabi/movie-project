from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from services.genre import get_genres_from_db, create_genre, get_genre_by_id , update_genre
from database import get_db
from schemas.Genre import GenreSchema  

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

@router.post("/")
def create_genre_route(new_genre: GenreSchema, db: Session = Depends(get_db)):
    try:
        return create_genre(db, new_genre)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# נתיב לשליפת ז'אנר לפי ID
@router.get("/{genre_id}")
def get_genre_route(genre_id: int, db: Session = Depends(get_db)):
    return get_genre_by_id(db, genre_id)

@router.put("/{genre_id}")
def update_genre_route(genre_id: int, updated_genre: GenreSchema, db: Session = Depends(get_db)):
    try:
        return update_genre(db, genre_id, updated_genre)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



      

