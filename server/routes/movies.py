from fastapi import APIRouter , HTTPException , Depends
from pydantic import BaseModel
from typing import Optional ,List
from services.movie import get_movies_from_db , add_movie , soft_delete_movie, permanent_delete_movie ,get_movie_by_id, update_movie
from schemas.Movie import MovieSchema
from sqlalchemy.orm import Session
from database import get_db

router = APIRouter()


@router.get("/")
def get_movies_route (db: Session = Depends (get_db)):
    return get_movies_from_db(db)
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

@router.get("/{movie_id}")
def get_movie_route(movie_id: int, db: Session = Depends(get_db)):
    return get_movie_by_id(db, movie_id)

# @router.put("/{movie_id}")
# async def update_movie(movie_id: int, Session = Depends(get_db)):
#     for idx, movie in enumerate (mockmovies):
#         if movie.id == movie_id:
#             mockmovies [idx] = updated_movie
#             return {"message": "Movie updated successfully"}
#     return {"error": "Movie not found"}

# @app.('/movies/<int:id>', methods=['PUT'])
# def update_movie(id):
#     movie = Movie.query.get_or_404(id)
#     data = request.get_json()

#     movie.title = data['title']
#     movie.release_year = data['releaseYear']
#     movie.director = data['director']

#     db.session.commit()


    # return jsonify(movie.to_dict())
# @router.put("/{movie_id}")
# async def update_movie(movie_id: int, updated_movie: MovieSchema, db: Session = Depends(get_db)):
#     movie = get_movie_by_id(db, movie_id)
#     if not movie:
#         raise HTTPException(status_code=404, detail="Movie not found")
    
#     # Update movie attributes from the request
#     movie_data = updated_movie.dict(exclude_unset=True)
#     for key, value in movie_data.items():
#         setattr(movie, key, value)
    
#     db.commit()
#     db.refresh(movie)
    
#     return {"message": "Movie updated successfully", "movie": movie}

@router.put("/{movie_id}")
async def update_movie_route(movie_id: int, updated_movie: MovieSchema, db: Session = Depends(get_db)):
    movie = update_movie(db, movie_id, updated_movie)
    return {"message": "Movie updated successfully", "movie": movie}