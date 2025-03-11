import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import './favorite.css';

const fetchFavorites = async () => {
  try {
    const { data } = await axios.get("http://localhost:8000/movies/all-favorites");
    return data;
  } catch (error) {
    console.error("Full error response:", error.response?.data);
    throw error;
  }
};

const toggleFavorite = async (movie) => {
  const newStatus = !movie.is_favorite;
  console.log(`Toggling favorite for ${movie.title}, new status: ${newStatus}`);
  await axios.put(`http://localhost:8000/movies/${movie.id}/favorite?is_favorite=${newStatus}`);
  return { ...movie, is_favorite: newStatus };
};

const FavoriteMovies = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: movies, isLoading, error } = useQuery({
    queryKey: ["favoriteMovies"],
    queryFn: fetchFavorites,
  });

  const mutation = useMutation({
    mutationFn: toggleFavorite,
    onSuccess: (updatedMovie) => {
      queryClient.setQueryData(["favoriteMovies"], (oldMovies) =>
        oldMovies.map((movie) =>
          movie.id === updatedMovie.id ? updatedMovie : movie
        )
      );
    },
  });

  const handleMovieClick = (movieId) => {
    navigate(`/list/${movieId}`);
  };

  if (isLoading) return <p className="loadingState">Loading...</p>;
  if (error) return <p className="errorState">Error: {error.message}</p>;
  if (!movies || movies.length === 0) return <p className="emptyState">No favorite movies</p>;

  // Determine CSS class based on number of movies
  const gridClassName = movies.length <= 1 
    ? "movieGrid singleMovie" 
    : movies.length <= 3 
      ? "movieGrid fewMovies" 
      : "movieGrid";

  return (
    <div className="pageContainer">
      <div className="headerSection">
        <h2 className="header">Favorite Movies❤️</h2>
        <Link to="/" className="backButton">🔙 BACK </Link>
      </div>
      
      <div className={gridClassName}>
        {movies.map((movie) => (
          <div key={movie.id} className="movieCard">
            <div 
              className="movieImageContainer" 
              onClick={() => handleMovieClick(movie.id)}
            >
              <img
                src={movie.url_image || "https://via.placeholder.com/300x450"}
                alt={movie.title}
                className="movieImage"
              />
              <div className="viewDetailsOverlay">
                <span>View details</span>
              </div>
            </div>
            <div className="movieInfo">
              <h3 className="movieTitle">{movie.title}</h3>
              <button
                className={`favoriteButton ${movie.is_favorite ? "active" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  mutation.mutate(movie);
                }}
              >
                {movie.is_favorite ? " Remove from favorites 💔" : " Add to favorites ❤️"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoriteMovies;