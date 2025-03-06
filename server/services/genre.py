from models.Genres import Genre
from sqlalchemy.orm import Session

def get_genres_from_db(db: Session):
    return db.query(Genre).all()
