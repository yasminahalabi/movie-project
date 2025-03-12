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
    console.error("Error fetching favorite movies:", error.response?.data);
    throw error;
  }
};

const toggleFavorite = async (movieId) => {
  const { data } = await axios.put(`http://localhost:8000/movies/${movieId}/favorite?is_favorite=false`);
  return data.movie;
};

const FavoriteMovies = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate(); 
  const [selectedMovie, setSelectedMovie] = useState(null);

  const { data: movies, isLoading, error } = useQuery({
    queryKey: ["favoriteMovies"],
    queryFn: fetchFavorites,
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: toggleFavorite,
    onSuccess: () => {
      // רענון הנתונים לאחר הסרת סרט מהמועדפים
      queryClient.invalidateQueries(["favoriteMovies"]);
      queryClient.invalidateQueries(["movies"]); // רענון רשימת הסרטים הרגילה
      setSelectedMovie(null);
    },
  });

  const handleMovieClick = (movieId) => {
    navigate(`/list/${movieId}`);
  };

  const handleRemoveFavorite = (movieId) => {
    removeFavoriteMutation.mutate(movieId);
  };

  if (isLoading) return <p className="loadingState">Loading...</p>;
  if (error) return <p className="errorState">Error: {error.message}</p>;
  if (!movies || movies.length === 0) return (
    <div className="pageContainer">
      <div className="headerSection">
        <h2 className="headerfav"> Favorite Movies ❤️</h2>
        <Link to="/" className="backButton">🔙 BACK</Link>
      </div>
      <p className="emptyState">No favorite movies</p>
    </div>
  );

  // Determine CSS class based on number of movies
  const gridClassName = movies.length <= 1 
    ? "movieGrid singleMovie" 
    : movies.length <= 3 
      ? "movieGrid fewMovies" 
      : "movieGrid";
  return (
    <div className="pageContainer">
      <div className="headerSection">
        <h2 className="headerfav">Favorite Movies❤️</h2>
        <Link to="/" className="backButton">🔙 BACK</Link>
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
                className="favoriteButton"
                onClick={(e) => {
                  e.stopPropagation(); // מניעת התפשטות אירוע הלחיצה
                  handleRemoveFavorite(movie.id);
                }}
                disabled={removeFavoriteMutation.isLoading}
              >
                {removeFavoriteMutation.isLoading && removeFavoriteMutation.variables === movie.id ?  " Remove from favorites 💔" : " Add to favorites ❤️"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoriteMovies;