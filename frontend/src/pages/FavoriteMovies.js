import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";
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

// פונקציה להוספת/הסרת סרטים מהאהובים
const toggleFavorite = async (movie) => {
  const newStatus = !movie.is_favorite;
  console.log(`Toggling favorite for ${movie.title}, new status: ${newStatus}`); // בדיקה
  await axios.put(`http://localhost:8000/movies/${movie.id}/favorite?is_favorite=${newStatus}`);
  return { ...movie, is_favorite: newStatus };
};

const FavoriteMovies = () => {
  const queryClient = useQueryClient();

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

  if (isLoading) return <p>טוען...</p>;
  if (error) return <p>שגיאה: {error.message}</p>;
  if (!movies || movies.length === 0) return <p>אין סרטים אהובים</p>;

  return (
    <div className="pageContainer">
      <h2 className="header">❤️ הסרטים שאהבתי</h2>
      <Link to="/" className="backButton">🔙 חזרה</Link>
      <div className="movieGrid">
        {movies.map((movie) => (
          <div key={movie.id} className="movieItem">
            <img
              src={movie.url_image || "https://via.placeholder.com/300x450"}
              alt={movie.title}
              className="movieImage"
            />
            <h3>{movie.title}</h3>
            <button
              className={`favoriteButton ${movie.is_favorite ? "active" : ""}`}
              onClick={() => mutation.mutate(movie)}
            >
              {movie.is_favorite ? "💔 הסר מהאהובים" : "❤️ הוסף לאהובים"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoriteMovies;
