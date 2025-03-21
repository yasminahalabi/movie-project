from fastapi import APIRouter , HTTPException , Depends , Query
from pydantic import BaseModel
from typing import Optional ,List
from services.movie import get_movies_from_db , add_movie , soft_delete_movie, permanent_delete_movie ,get_movie_by_id, update_movie, update_favorite_status, get_favorite_movies , restore_movie , get_deleted_movies
from schemas.Movie import MovieSchema
from sqlalchemy.orm import Session
from database import get_db
from models.Movies import Movie 


router = APIRouter()


@router.get("/")
def get_movies_route(db: Session = Depends(get_db), genre: Optional[int] = Query(None)):
    if genre:
        try:
            movies = get_movies_from_db_by_genre(db, genre)
            return movies
        except HTTPException as e:
            raise e
    else:
        return get_movies_from_db(db)


def get_movies_from_db_by_genre(db: Session, genre: int):
    movies = db.query(Movie).filter(Movie.genre_ids.any(genre), Movie.deleted == False).all()
    if not movies:
        raise HTTPException(status_code=404, detail="No movies found for this genre")
    return movies
# @router.get("/")
# def get_movies_route(db: Session = Depends(get_db)):
#     try:
#         movies = get_movies_from_db(db)
#         return movies
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

# @router.get("/{movie_id}", response_model=MovieSchema)
# async def get_movie(movie_id: int):
#     movies = await get_movies_from_db()
#     movie = next((movie for movie in movies if movie.id and movie.id == movie_id), None)
#     if movie:
#         return movie
#     raise HTTPException(status_code=404, detail="Movie not found")

# @router.put("/{movie_id}")
# def update_movie_route(movie_id: int, updated_movie: MovieSchema, db: Session = Depends(get_db)):
#     updated_movie_obj = update_movie(db, movie_id, updated_movie)
#     return {"message": "Movie updated successfully", "movie": updated_movie_obj}


@router.post("/")
def add_movie_route(new_movie: MovieSchema, db:Session = Depends (get_db)):
    return add_movie(db, new_movie)

@router.get("/all-favorites") 
def fetch_favorite_movies(db: Session = Depends(get_db)):
    return get_favorite_movies(db)   

# Route להצגת סרטים שנמצאים בארכיון
@router.get("/deleted")
def get_deleted_movies_route(db: Session = Depends(get_db)):
    return get_deleted_movies(db)

@router.get("/{movie_id}")
def get_movie_route(movie_id: int, db: Session = Depends(get_db)):
    return get_movie_by_id(db, movie_id)


# @router.put("/{movie_id}")
# def update_movie_route(movie_id: int, updated_movie: MovieSchema, db: Session = Depends(get_db)):
#     return update_movie(db, movie_id, updated_movie)

# מחיקה רכה (Soft Delete)
@router.put("/{movie_id}/delete")
def soft_delete_route(movie_id: int, db: Session = Depends(get_db)):
    return soft_delete_movie(db, movie_id)

# מחיקה מוחלטת (Permanent Delete)
@router.delete("/{movie_id}")
def permanent_delete_route(movie_id: int, db: Session = Depends(get_db)):
    return permanent_delete_movie(db, movie_id)

@router.put("/{movie_id}/favorite")
def set_favorite(movie_id: int, is_favorite: bool, db: Session = Depends(get_db)):
    movie = update_favorite_status(db, movie_id, is_favorite)
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    return {"message": "Favorite status updated", "movie": movie}

@router.put("/{movie_id}")
async def update_movie_route(movie_id: int, updated_movie: MovieSchema, db: Session = Depends(get_db)):
    movie = update_movie(db, movie_id, updated_movie)
    return {"message": "Movie updated successfully", "movie": movie}

# Route לשחזור סרט (ממחיקה רכה)
@router.put("/{movie_id}/restore")
def restore_movie_route(movie_id: int, db: Session = Depends(get_db)):
    return restore_movie(db, movie_id)
