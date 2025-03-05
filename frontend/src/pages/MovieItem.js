import React, { useState } from 'react'
import { useParams , Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'



// פונקציה לשליפת סרט לפי מזהה
const fetchMovieById = async (movieId) => {
  const response = await axios.get(`http://localhost:8000/movies/${movieId}`)
  return response.data
}

const MovieItem = ({ softDeleteMovie, permanentDeleteMovie }) => {
  const { movieId } = useParams()

    // שימוש ב-useQuery לשליפת פרטי הסרט לפי ה-ID
  const { data: movie, error, isLoading } = useQuery({
     queryKey: ['movie', movieId], // המפתח של השאילתה
     queryFn: () => fetchMovieById(movieId), // פונקציה לשליפת הנתונים
     enabled: !!movieId, // לא לשלוף עד שמגיעים ל-movieId
  })

  if (isLoading) return <p>Loading movie details...</p>
  if (error) return <p style={{ color: 'red' }}>Error: {error.message}</p>
  if (!movie) return <p style={styles.errorMessage}>Movie not found</p>

  return (
    <div style={styles.movieItem}>
      <Link to="/list" style={styles.backButton}>Back to Movies List</Link>
      <div style={styles.contentWrapper}>
        <div style={styles.movieDetail}>
          <h1 style={styles.title}>{movie.title} ({new Date(movie.release_date).getFullYear()})</h1>
          <img src={movie.url_image || '/default-image.jpg'} alt={movie.title} style={styles.movieImage} />
          <div style={styles.detailsContainer}>
            <p><strong>Description:</strong> {movie.description}</p>
            <p><strong>Release Date:</strong> {movie.release_date}</p>
            <p><strong>Duration:</strong> {movie.duration} minutes</p>
            <p><strong>Genres:</strong> {movie.genre_ids?.join(', ')}</p>
            <p><strong>Actors:</strong> {movie.actors?.join(', ')}</p>
            <p><strong>Director:</strong> {movie.director}</p>
            <p><strong>Language:</strong> {movie.language}</p>
            <p><strong>Rating:</strong> {movie.rating}</p>
            <p><strong>Star Rating:</strong> {movie.star_rating}</p>
            <p><strong>Awards:</strong> {movie.awards}</p>
            <p><strong>Age Restriction:</strong> {movie.age_restriction}+</p>
            <p><strong>Watch Now:</strong> <a href={movie.watchurl} target="_blank" rel="noopener noreferrer">Click here</a></p>
        </div>
       </div> 
     </div> 
    </div>    
  )
}


const styles = {
  movieItem: {
    padding: '50px',
    backgroundColor: '#f9f9f9',
    borderRadius: '20px',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.1)',
    color: '#333',
    maxWidth: '1000px',
    margin: '50px auto',
    fontFamily: '"Poppins", sans-serif',
    textAlign: 'center',
    position: 'relative',
  },
  backButton: {
    display: 'inline-block',
    padding: '12px 30px',
    backgroundColor: '#003366',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '25px',
    marginBottom: '40px',
    fontSize: '1.2rem',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s ease',
  },
  backButtonHover: {
    backgroundColor: '#005fa3',
  },
  contentWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    gap: '30px',
  },
  movieDetails: {
    width: '75%',
    padding: '40px',
    backgroundColor: '#fff',
    borderRadius: '20px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease-in-out',
  },
  title: {
    fontSize: '2.8rem',
    fontWeight: '700',
    color: '#003366',
    marginBottom: '30px',
  },
  movieImage: {
    width: '60%',
    height: 'auto',
    objectFit: 'cover',
    borderRadius: '15px',
    marginBottom: '30px',
    border: '4px solid #fff',
    transition: 'transform 0.3s ease',
  },
  movieImageHover: {
    transform: 'scale(1.05)',
  },
  detailsContainer: {
    color: '#555',
    fontSize: '1.2rem',
    lineHeight: '1.8',
    marginTop: '30px',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '22px',
  },
  spinner: {
    border: '4px solid rgba(0, 0, 0, 0.1)',
    borderTop: '4px solid #003366',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    animation: 'spin 1s linear infinite',
  },
  errorMessage: {
    color: '#e74c3c',
    fontSize: '1.4rem',
    textAlign: 'center',
    padding: '25px',
    backgroundColor: '#fff',
    borderRadius: '15px',
    margin: '20px 0',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  },
}

export default MovieItem
