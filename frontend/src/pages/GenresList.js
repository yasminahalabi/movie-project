import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const GenresList = () => {
  const [genres, setGenres] = useState([]);
  const [movies, setMovies] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/genres')
      .then((response) => response.json())
      .then((data) => setGenres(data.sort((a, b) => a.id - b.id)))
      .catch(() => setError('Unable to load genres'));
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      if (selectedGenre === null) return;
      setLoading(true);
      setError(null);
      setMovies([]);

      try {
        const response = await fetch(`http://127.0.0.1:8000/movies/?genre=${selectedGenre}`);
        if (!response.ok) throw new Error();
        setMovies(await response.json());
      } catch {
        setError('Unable to load movies');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [selectedGenre]);

  useEffect(() => {
    if (selectedGenre) {
      document.getElementById('movieList')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedGenre]);

  return (
    <div style={styles.homePage}>
      <h1 style={styles.h1}>🎬 Welcome to the Movie World</h1>
      <div style={styles.genreList}>
        <h3 style={styles.genreTitle}>🎭 Choose a Genre:</h3>
        {genres.map((genre) => (
          <button
            key={genre.id}
            style={{
              ...styles.genreButton,
              ...(selectedGenre === genre.id ? styles.genreButtonActive : {}),
            }}
            onClick={() => setSelectedGenre(genre.id)}
          >
            <div style={styles.genreButtonContent}>
              {genre.image && <img src={genre.image} alt={genre.name} style={styles.genreImage} />}
              <span style={styles.genreText}>{genre.name}</span>
            </div>
          </button>
        ))}
      </div>

      {loading && <p style={styles.loadingMessage}>⏳ Loading movies...</p>}
      {error && <p style={styles.errorMessage}>{error}</p>}

      {selectedGenre && (
        <div id="movieList" style={styles.movieList}>
          <h3 style={styles.genreTitle}>🎥 Movies:</h3>
          {movies.length === 0 && !loading && !error ? (
            <p style={styles.noMovies}>No movies found for this genre</p>
          ) : (
            movies.map((movie) => (
              <div key={movie.id} style={styles.movieItem}>
                <Link to={`/list/${movie.id}`} style={{ textDecoration: 'none' }}>
                  <h4 style={styles.movieTitle}>{movie.title}</h4>
                  <p style={styles.movieDescription}>{movie.description}</p>
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
    backgroundColor: '#1C1C1C',
    textAlign: 'center',
    minHeight: '100vh',
  },

  h1: {
    color: '#F4A261',
    fontSize: '36px',
    fontWeight: 'bold',
  },

  genreList: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    maxWidth: '100%',
    margin: '20px 0',
  },

  genreTitle: {
    color: '#E9C46A',
    fontSize: '22px',
    marginBottom: '10px',
  },

  genreButton: {
    backgroundColor: '#264653',
    color: 'white',
    border: 'none',
    padding: '20px',
    margin: '10px',
    cursor: 'pointer',
    fontSize: '18px',
    borderRadius: '15px',
    width: '200px',
    height: '220px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.3s, box-shadow 0.3s',
  },

  genreButtonActive: {
    backgroundColor: '#2A9D8F',
    transform: 'scale(1.05)',
    boxShadow: '0px 0px 15px rgba(255, 255, 255, 0.8)',
  },

  genreButtonContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  genreImage: {
    width: '150px',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '15px',
    marginBottom: '10px',
  },

  genreText: {
    fontSize: '18px',
    fontWeight: 'bold',
  },

  movieList: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: '30px',
  },

  movieItem: {
    backgroundColor: '#2A9D8F',
    margin: '15px',
    padding: '20px',
    borderRadius: '15px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
    width: '280px',
    textAlign: 'left',
    transition: 'transform 0.3s, box-shadow 0.3s',
  },

  movieItemHover: {
    transform: 'scale(1.05)',
    boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.5)',
  },

  movieTitle: {
    fontSize: '20px',
    color: '#FFF',
  },

  movieDescription: {
    fontSize: '14px',
    color: '#E9C46A',
  },

  loadingMessage: {
    fontSize: '18px',
    color: '#E9C46A',
    fontStyle: 'italic',
  },

  errorMessage: {
    fontSize: '18px',
    color: 'red',
  },

  noMovies: {
    fontSize: '18px',
    color: '#F4A261',
  },
};

export default GenresList;
