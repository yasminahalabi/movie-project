from models.Genres import Genre
from sqlalchemy.orm import Session
from fastapi import HTTPException
from schemas.Genre import GenreSchema 

def get_genres_from_db(db: Session):
    return db.query(Genre).all()

def create_genre(db: Session, genre: GenreSchema):
    try:
        db_genre = Genre(
            name=genre.name,
            image=genre.image,
        )
        db.add(db_genre)
        db.commit()
        db.refresh(db_genre)
        return db_genre
    except Exception as e:
        print(f"Error adding genre: {e}")
        raise HTTPException(status_code=500, detail="Error occurred while adding the genre")

# פונקציה לשליפת ז'אנר לפי ID
def get_genre_by_id(db: Session, genre_id: int):
    db_genre = db.query(Genre).filter(Genre.id == genre_id).first()
    if not db_genre:
        raise HTTPException(status_code=404, detail="Genre not found")
    return db_genre        

# פונקציה לעדכון ז'אנר קיים
def update_genre(db: Session, genre_id: int, updated_genre: GenreSchema):
    db_genre = db.query(Genre).filter(Genre.id == genre_id).first()
    if db_genre is None:
        raise HTTPException(status_code=404, detail="Genre not found")

    db_genre.name = updated_genre.name
    db_genre.image = updated_genre.image
    db.commit()
    db.refresh(db_genre)
    return db_genre
   