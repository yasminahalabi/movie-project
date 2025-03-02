from schemas.Movie import MovieSchema
from datetime import datetime
from fastapi import HTTPException
from sqlalchemy.orm import Session
from models.Movies import Movie
 
def get_movies_from_db(db:Session):
    return db.query (Movie).filter(Movie.deleted == False).all()  # מציג רק סרטים שלא נמחקו

def add_movie(db: Session, movie: MovieSchema):
    db_movie = Movie(
        title=movie.title,
        description=movie.description,
        release_date=movie.release_date,
        url_image=movie.url_image,
        duration=movie.duration,
        genre_ids=movie.genre_ids,
        actors=movie.actors,
        director=movie.director,
        language=movie.language,
        rating=movie.rating,
        star_rating=movie.star_rating,
        awards=movie.awards,
        age_restriction=movie.age_restriction,
        watchurl=movie.watchurl,
    )
    db.add(db_movie)
    db.commit()
    db.refresh(db_movie)
    return db_movie



# def update_movie(db: Session, movie_id: int, updated_movie: MovieSchema):
#     db_movie = db.query(Movie).filter(Movie.id == movie_id).first()
#     if not db_movie:
#         raise HTTPException(status_code=404, detail="Movie not found")

#     for key, value in updated_movie.dict(exclude_unset=True).items():
#         setattr(db_movie, key, value)

#     db.commit()
#     db.refresh(db_movie)
#     return db_movie


#  מחיקה רכה (Soft Delete)
def soft_delete_movie(db: Session, movie_id: int):
    db_movie = db.query(Movie).filter(Movie.id == movie_id, Movie.deleted == False).first()
    if not db_movie:
        raise HTTPException(status_code=404, detail="Movie not found or already deleted")

    db_movie.deleted = True
    db_movie.deleted_on = datetime.now()
    db.commit()
    return {"message": "Movie deleted softly"}

# מחיקה מוחלטת (Permanent Delete)
def permanent_delete_movie(db: Session, movie_id: int):
    db_movie = db.query(Movie).filter(Movie.id == movie_id).first()
    if not db_movie:
        raise HTTPException(status_code=404, detail="Movie not found")

    db.delete(db_movie)  # SQLAlchemy מחיקת רשומה לחלוטין
    db.commit()
    return {"message": "Movie deleted permanently"}

def get_movie_by_id(db: Session, movie_id: int):
    db_movie = db.query(Movie).filter(Movie.id == movie_id, Movie.deleted == False).first()
    if not db_movie:
        raise HTTPException(status_code=404, detail="Movie not found or already deleted")
    return db_movie
