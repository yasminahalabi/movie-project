from fastapi import FastAPI
from pydantic import BaseModel
from routes.movies import router as movie_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allowed origins (Use ["*"] to allow all origins, but it's not recommended in pr
origins = [ 
    "http://localhost:3000", # Example: Allow frontend running on React/Vue
    "http://example.com", # Add your production domain here
    "*", # Use with caution: allows all origins 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, # List of allowed origins
    allow_credentials=True, # Allow cookies and authentication
    allow_methods=["*"], # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"], # Allow all headers
)


@app.get("/")
async def welcome():
    return "Welcome to my api"

# @app.get("/movies")
# async def get_movies_route():
#     return await get_movies()

app.include_router(movie_router , prefix="/movies")
