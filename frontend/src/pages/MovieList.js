import React, { useState } from 'react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from "react-router-dom";
import './List.css';

const fetchMovies = async () => {
  const response = await axios.get('http://localhost:8000/movies');
  return response.data;
};

const toggleFavorite = async (movieId, isFavorite) => {
  await axios.put(`http://localhost:8000/movies/${movieId}/favorite?is_favorite=${!isFavorite}`);
};

const MoviesList = () => {
  const queryClient = useQueryClient();
  const [isHovered, setIsHovered] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  // מחיקה רכה
  const softDeleteMovie = useMutation({
    mutationFn: async (movieId) => {
      await axios.put(`http://localhost:8000/movies/${movieId}/delete`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['movies']);
    },
  });

  // מחיקה מוחלטת
  const permanentDeleteMovie = useMutation({
    mutationFn: async (movieId) => {
      await axios.delete(`http://localhost:8000/movies/${movieId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['movies']);
      setShowDeleteConfirm(null);
    },
  });

  // עדכון סטטוס אהוב
  const favoriteMutation = useMutation({
    mutationFn: ({ movieId, isFavorite }) => toggleFavorite(movieId, isFavorite),
    onSuccess: () => {
      queryClient.invalidateQueries(['movies']);
    },
  });
   
  
  const { data: list, error, isLoading } = useQuery({
    queryKey: ['movies'],
    queryFn: fetchMovies,
    staleTime: 5000,
  });

  if (isLoading) return (
    <div className="loadingContainer">
      <div className="loadingSpinner"></div>
      <p className="loadingText">Loading Movies...</p>
    </div>
  );

  if (error) return (
    <div className="errorContainer">
      <div className="errorIcon">!</div>
      <p className="errorMessage">Error: {error.message}</p>
      <button 
        className="retryButton"
        onClick={() => queryClient.invalidateQueries(['movies'])}
      >
        Try Again  
      </button>
    </div>
  );

  return (
    <div className="pageContainer">
      <div className="headerSection">
        <h1 className="header">Movies List</h1>
        <div className="statsBar">
          <div className="statItem">
            <span className="statValue">{list?.length || 0}</span>
            <span className="statLabel">Movies In The List </span>
          </div>
          <Link to="/add-movie" className="addButton">
            <span className="addButtonIcon">+</span>
            Add New Movie
          </Link>
          <Link to="/favorite" className="favoritesButton">Favorite Movies❤️ </Link>
        </div>
      </div>

      <div className="movieGrid">
        {(list || []).map((movie) => (
          <div
            key={movie.id}
            className={`movieItem ${isHovered === movie.id ? 'movieItemHover' : ''}`}
            onMouseEnter={() => setIsHovered(movie.id)}
            onMouseLeave={() => setIsHovered(null)}
          >
            {/* תווית השנה */}
            <div className="yearBadge">
              {new Date(movie.release_date).getFullYear()}
            </div>

            <Link to={`/list/${movie.id}`} className="imageLink">
              <div className="imageContainer">
                <img 
                  src={movie.url_image || 'https://via.placeholder.com/300x450?text=No+Image'} 
                  alt={movie.title} 
                  className="movieImage" 
                />
                <div className={`imageOverlay ${isHovered === movie.id ? 'showOverlay' : ''}`}>
                  <span className="viewDetailsButton">View Details</span>
                </div>
              </div>
            </Link>

            <div className="movieInfo">
              <h2 className="movieTitle">{movie.title}</h2>
              <p className="movieDescription">{movie.description}</p>

              {/* כפתורי פעולות */}
              <div className="actionsContainer">
                <Link to={`/edit/${movie.id}`} className="updateButton">update📝</Link>
                {/* כפתור אהבה */}
                <button
                  className={`favoriteButton ${movie.is_favorite ? 'favorite' : ''}`}
                  onClick={() => favoriteMutation.mutate({ movieId: movie.id, isFavorite: movie.is_favorite })}
                >
                  {movie.is_favorite ? "❤️" : "🤍"}
                </button>
                  
                <button 
                  className="softDeleteButton"
                  onClick={() => softDeleteMovie.mutate(movie.id)}
                >
                  Soft Delete🗑️  
                </button>

                {showDeleteConfirm === movie.id ? (
                  <>
                    <button 
                      className="deleteButton"
                      onClick={() => permanentDeleteMovie.mutate(movie.id)}
                    >
                      Permanent Delete❌
                    </button>
                    <button 
                      className="cancelButton"
                      onClick={() => setShowDeleteConfirm(null)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button 
                    className="deleteButton"
                    onClick={() => setShowDeleteConfirm(movie.id)}
                  >
                    Delete 🗑️ 
                  </button>
                  
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoviesList

