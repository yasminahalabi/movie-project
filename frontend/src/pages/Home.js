import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [genres, setGenres] = useState([]);
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [filteredGenres, setFilteredGenres] = useState([]);

  // טעינת הסרטים
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/movies')
      .then((res) => setMovies(res.data))
      .catch((err) => console.error('Error fetching movies:', err));
  }, []);

  // חיפוש בזמן אמת
  useEffect(() => {
    const search = searchTerm.toLowerCase();
    setFilteredMovies(movies.filter((movie) => movie.title.toLowerCase().includes(search)));
    setFilteredGenres(genres.filter((genre) => genre.name.toLowerCase().includes(search)));
  }, [searchTerm, movies, genres]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🎬 Discover Amazing Movies & Genres</h1>

      {/* שדה חיפוש */}
      <input
        type="text"
        placeholder="Search for movies or genres..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={styles.searchInput}
      />

      {/* הצגת תוצאות חיפוש */}
      {searchTerm && (
        <div style={styles.resultsContainer}>
          <h3 style={styles.subTitle}>Search Results:</h3>

          {/* סרטים תואמים */}
          {filteredMovies.length > 0 && (
            <div>
              <h4 style={styles.sectionTitle}>Movies</h4>
              <div style={styles.grid}>
                {filteredMovies.map((movie) => (
                  <Link key={movie.id} to={`/list/${movie.id}`} style={styles.card}>
                    <img src={movie.image} alt={movie.title} style={styles.image} />
                    <p style={styles.cardText}>{movie.title}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* כותרת הסרטים */}
      <h2 style={styles.subTitle}>🎥 Trending Movies</h2>
      <div style={styles.grid}>
        {movies.map((movie) => (
          <Link key={movie.id} to={`/list/${movie.id}`} style={styles.card}>
            <img src={movie.image} alt={movie.title} style={styles.image} />
            <p style={styles.cardText}>{movie.title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '40px 20px',
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
    background: 'linear-gradient(to right, #1f1c2c, #928DAB)',
    color: 'white',
    minHeight: '100vh',
  },
  title: {
    fontSize: '36px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  searchInput: {
    width: '60%',
    padding: '12px',
    fontSize: '18px',
    borderRadius: '8px',
    border: 'none',
    outline: 'none',
    textAlign: 'center',
    marginBottom: '20px',
  },
  resultsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: '20px',
    borderRadius: '10px',
    marginTop: '10px',
  },
  subTitle: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginTop: '30px',
    borderBottom: '2px solid white',
    display: 'inline-block',
    paddingBottom: '5px',
  },
  sectionTitle: {
    fontSize: '22px',
    marginBottom: '10px',
    textAlign: 'left',
    paddingLeft: '20px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '15px',
    justifyContent: 'center',
    padding: '20px',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
    padding: '10px',
    textAlign: 'center',
    textDecoration: 'none',
    color: 'white',
    transition: 'transform 0.3s ease',
    boxShadow: '0px 4px 10px rgba(255, 255, 255, 0.2)',
  },
  cardHover: {
    transform: 'scale(1.05)',
  },
  image: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '8px',
  },
  cardText: {
    marginTop: '10px',
    fontSize: '18px',
    fontWeight: 'bold',
  },
};

export default Home;

