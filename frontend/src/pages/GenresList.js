import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const GenresList = () => {
  const [genres, setGenres] = useState([]);
  const [movies, setMovies] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load genres
  useEffect(() => {
    fetch('http://127.0.0.1:8000/genres')
      .then((response) => response.json())
      .then((data) => setGenres(data))
      .catch((error) => {
        console.error('Error fetching genres:', error);
        setError('Unable to load genres');
      });
  }, []);

  // Load movies for selected genre
  useEffect(() => {
    const fetchMovies = async () => {
      if (selectedGenre === null) return; // Don't load movies if no genre is selected
      setLoading(true);
      setError(null);
      setMovies([]); // Clear previous movie list when genre is changed

      try {
        const url = `http://127.0.0.1:8000/movies/?genre=${selectedGenre}`;
        console.log('Fetching movies from:', url); // URL log
        const response = await fetch(url);
        console.log('API Response:', response); // API response log
        if (!response.ok) {
          throw new Error('Unable to load movies');
        }
        const data = await response.json();
        console.log('Movies Data:', data); // Data log
        setMovies(data);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setError('Unable to load movies');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [selectedGenre]);

  return (
    <div style={styles.homePage}>
      <h1 style={styles.h1}>Welcome to the World of Movies</h1>
      <div style={styles.genreList}>
        <h3 style={styles.p}>Choose a Genre:</h3>
        {genres.map((genre) => (
          <button
            key={genre.id}
            style={{
              ...styles.genreButton,
              ...(selectedGenre === genre.id ? styles.genreButtonActive : {}),
            }}
            onClick={() => setSelectedGenre(genre.id)} // Select genre
          >
            {genre.name}
          </button>
        ))}
      </div>

      {/* Loading state */}
      {loading && <p style={styles.p}>Loading movies...</p>}

      {/* Error state */}
      {error && <p style={{ ...styles.p, color: 'red' }}>{error}</p>}

      {/* Movies load after genre selection */}
      {selectedGenre && (
        <div style={styles.movieList}>
          <h3 style={styles.p}>Movies:</h3>
          {movies.length === 0 && !loading && !error ? (
            <p style={styles.p}>No movies found for this genre</p>
          ) : (
            movies.map((movie) => (
              <div key={movie.id} style={styles.movieItem}>
                <Link to={`/list/${movie.id}`} style={{ textDecoration: 'none' }}>
                  <h4 style={styles.movieItemH4}>{movie.title}</h4>
                  <p style={styles.movieItemP}>{movie.description}</p>
                </Link>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  homePage: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f0f0f0',
    textAlign: 'center',
  },

  h1: {
    color: '#333',
    marginBottom: '30px',
  },

  genreList: {
    display: 'flex',
    justifyContent: 'center',
    margin: '20px 0',
    flexWrap: 'wrap', // To ensure it fits the screen
    maxWidth: '100%', // Ensures the genre list stays within page width
  },

  genreButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    margin: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    borderRadius: '5px',
    transition: 'background-color 0.3s',
    width: '150px', // Set a fixed width for buttons
    textAlign: 'center',
  },

  genreButtonActive: {
    backgroundColor: '#45a049',
  },

  movieList: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: '20px',
  },

  movieItem: {
    backgroundColor: 'white',
    margin: '10px',
    padding: '15px',
    borderRadius: '10px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    width: '200px',
    textAlign: 'left',
    transition: 'transform 0.2s',
  },

  movieItemHover: {
    transform: 'scale(1.05)',
  },

  movieItemH4: {
    fontSize: '18px',
    color: '#333',
  },

  movieItemP: {
    fontSize: '14px',
    color: '#555',
  },

  p: {
    fontSize: '16px',
    color: '#333',
  },
};

export default GenresList;
