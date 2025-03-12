import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";
import { useState } from "react";
import './favorite.css'; // שימוש באותו CSS

const fetchDeletedMovies = async () => {
  try {
    const { data } = await axios.get("http://localhost:8000/movies/deleted");
    return data;
  } catch (error) {
    console.error("Error fetching deleted movies:", error.response?.data);
    throw error;
  }
};

const restoreMovie = async (movieId) => {
  const { data } = await axios.put(`http://localhost:8000/movies/${movieId}/restore`);
  return data.movie;
};

const ArchivedMovies = () => {
  const queryClient = useQueryClient();
  const [selectedMovie, setSelectedMovie] = useState(null);

  const { data: movies, isLoading, error } = useQuery({
    queryKey: ["deletedMovies"],
    queryFn: fetchDeletedMovies,
  });

  const restoreMutation = useMutation({
    mutationFn: restoreMovie,
    onSuccess: () => {
      // רענון הנתונים לאחר שחזור סרט
      queryClient.invalidateQueries(["deletedMovies"]);
      queryClient.invalidateQueries(["movies"]); // רענון רשימת הסרטים הרגילה
      setSelectedMovie(null);
    },
  });

  const handleRestoreMovie = (movieId) => {
    restoreMutation.mutate(movieId);
  };

  const formatDeletedDate = (dateString) => {
    if (!dateString) return "לא ידוע";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (isLoading) return <p className="loadingState">Loading ...</p>;
  if (error) return <p className="errorState">Error: {error.message}</p>;
  if (!movies || movies.length === 0) return (
    <div className="pageContainer">
      <div className="headerSection">
        <h2 className="headerarchive">Movies In Archived 🗑️</h2>
        <Link to="/" className="backButton">🔙 BACK</Link>
      </div>
      <p className="emptyState">No Movies In Archived </p>
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
        <h2 className="headerarchive">Movies In Archived 🗑️</h2>
        <Link to="/" className="backButton">🔙 BACK</Link>
      </div>

      <div className={gridClassName}>
        {movies.map((movie) => (
          <div key={movie.id} className="movieCard">
            <div className="movieImageContainer">
              <img
                src={movie.url_image || "https://via.placeholder.com/300x450"}
                alt={movie.title}
                className="movieImage"
                style={{ opacity: 0.7 }} // תמונה עמומה יותר לסרטים שנמחקו
              />
              <div className="deletedOverlay">
                <span>Deleted On  : {formatDeletedDate(movie.deleted_on)}</span>
              </div>
            </div>
            <div className="movieInfo">
              <h3 className="movieTitle">{movie.title}</h3>
              <button
                className="restoreButton"
                onClick={() => handleRestoreMovie(movie.id)}
                disabled={restoreMutation.isLoading}
              >
                {restoreMutation.isLoading && restoreMutation.variables === movie.id
                  ? "Restoring..."
                  : "Restoring movie 🔄"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArchivedMovies;