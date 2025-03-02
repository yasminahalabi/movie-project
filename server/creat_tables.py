from database import engine, Base
from models.Movies import Movie
from models.Genres import Genre

Base.metadata.create_all(bind=engine)