import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [genres, setGenres] = useState([]);
  const [movies, setMovies] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // טוען את הג'אנרים
  useEffect(() => {
    fetch('http://127.0.0.1:8000/genres')
      .then((response) => response.json())
      .then((data) => setGenres(data))
      .catch((error) => {
        console.error('Error fetching genres:', error);
        setError('לא ניתן לטעון את הגנרים');
      });
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      if (selectedGenre === null) return; // אם לא נבחר ג'אנר, אל נטען סרטים
      setLoading(true);
      setError(null);
  
      try {
        const url = `http://127.0.0.1:8000/movies/?genre=${selectedGenre}`;
        console.log('Fetching movies from:', url); // לוג של ה-URL
        const response = await fetch(url);
        console.log('API Response:', response); // לוג של התשובה
        if (!response.ok) {
          throw new Error('לא ניתן לטעון את הסרטים');
        }
        const data = await response.json();
        console.log('Movies Data:', data); // לוג של הנתונים המתקבלים
        setMovies(data);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setError('לא ניתן לטעון את הסרטים');
      } finally {
        setLoading(false);
      }
    };
  
    fetchMovies();
  }, [selectedGenre]);
  
  
  return (
    <div style={styles.homePage}>
      <h1 style={styles.h1}>ברוך הבא לעולם הסרטים</h1>
      <div style={styles.genreList}>
        <h3 style={styles.p}>בחר ז'אנר:</h3>
        {genres.map((genre) => (
          <button
            key={genre.id}
            style={{
              ...styles.genreButton,
              ...(selectedGenre === genre.id ? styles.genreButtonActive : {}),
            }}
            onClick={() => setSelectedGenre(genre.id)} // כאן אתה בוחר את הג'אנר
          >
            {genre.name}
          </button>
        ))}
      </div>
  
      {/* מצב טעינה */}
      {loading && <p style={styles.p}>טוען סרטים...</p>}
  
      {/* מצב שגיאה */}
      {error && <p style={{ ...styles.p, color: 'red' }}>{error}</p>}
  
      <div style={styles.movieList}>
        <h3 style={styles.p}>סרטים:</h3>
        {movies.length === 0 && !loading && !error ? (
          <p style={styles.p}>לא נמצאו סרטים</p>
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
  },

  genreButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    margin: '0 10px',
    cursor: 'pointer',
    fontSize: '16px',
    borderRadius: '5px',
    transition: 'background-color 0.3s',
  },

  genreButtonActive: {
    backgroundColor: '#45a049',
  },

  genreButtonHover: {
    backgroundColor: '#3e8e41',
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

export default HomePage;
