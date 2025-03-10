from schemas.Movie import MovieSchema
from datetime import datetime
from fastapi import HTTPException
from sqlalchemy.orm import Session
from models.Movies import Movie
from models.Genres import Genre

 
def get_movies_from_db(db:Session):
    return db.query (Movie).filter(Movie.deleted == False).all()  # מציג רק סרטים שלא נמחקו

def get_movies_from_db_by_genre(db: Session, genre: int):
    return db.query(Movie).filter(Movie.genre_ids.contains([genre]), Movie.deleted == False).all()

# def add_movie(db: Session, movie: MovieSchema):
#     db_movie = Movie(
#         title=movie.title,
#         description=movie.description,
#         release_date=movie.release_date,
#         url_image=movie.url_image,
#         duration=movie.duration,
#         genre_ids=movie.genre_ids,
#         actors=movie.actors,
#         director=movie.director,
#         language=movie.language,
#         rating=movie.rating,
#         star_rating=movie.star_rating,
#         awards=movie.awards,
#         age_restriction=movie.age_restriction,
#         watchurl=movie.watchurl,
#     )
#     print(db.execute("SELECT current_database();").fetchone())
#     db.add(db_movie)
#     db.commit()
#     db.refresh(db_movie)
#     return db_movie

def add_movie(db: Session, movie: MovieSchema):
    try:
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
    except Exception as e:
        print(f"Error adding movie: {e}")
        raise HTTPException(status_code=500, detail="Error occurred while adding the movie")


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
    # חיפוש סרט במאגר לפי ID
    db_movie = db.query(Movie).filter(Movie.id == movie_id, Movie.deleted == False).first()
    if not db_movie:
        raise HTTPException(status_code=404, detail="Movie not found or already deleted")

    genre_names = db.query(Genre).filter(Genre.id.in_(db_movie.genre_ids)).all()
    genre_names = [genre.name for genre in genre_names]  # להחזיר רק שמות ולא אובייקטים
    return {
        **db_movie.__dict__,  # מכניסים את כל פרטי הסרט
        "genres": genre_names  # מוסיפים את שמות הז'אנרים
    }

    # החזרת הסרט והז'אנרים
    # return {
    #     "id": db_movie.id,
    #     "title": db_movie.title,
    #     "description": db_movie.description,
    #     "release_date": db_movie.release_date,
    #     "duration": db_movie.duration,
    #     "genres": genre_names,  # שמות הז'אנרים
    #     "actors": db_movie.actors,
    #     "director": db_movie.director,
    #     "language": db_movie.language,
    #     "rating": db_movie.rating,
    #     "star_rating": db_movie.star_rating,
    #     "awards": db_movie.awards,
    #     "age_restriction": db_movie.age_restriction,
    #     "watchurl": db_movie.watchurl,
    #     "url_image": db_movie.url_image
    # }



def update_movie(db: Session, movie_id: int, updated_movie: MovieSchema):
    db_movie = db.query(Movie).filter(Movie.id == movie_id, Movie.deleted == False).first()
    if not db_movie:
        raise HTTPException(status_code=404, detail="Movie not found")

    movie_data = updated_movie.dict(exclude_unset=True)
    for key, value in movie_data.items():
        setattr(db_movie, key, value)
    
    db.commit()
    db.refresh(db_movie)
    
    return db_movie    
