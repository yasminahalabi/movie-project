import React, { useState } from 'react'
import { useParams , Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'



// פונקציה לשליפת סרט לפי מזהה
const fetchMovieById = async (movieId) => {
  const response = await axios.get(`http://localhost:8000/movies/${movieId}`)
  return response.data
}

// const MovieItem = () => {
//   const { movieId } = useParams()

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

  return (
    <div style={styles.movieItem}>
      {/* כפתור חזרה לדף הקודם */}
      <Link to="/list" style={styles.backButton}>Back to Movies List</Link>

      {/* הצגת פרטי הסרט */}
      <h1>{movie.title} ({new Date(movie.release_date).getFullYear()})</h1>
      <img src={movie.url_image} alt={movie.title} style={styles.movieImage} />
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
  )
}

const styles = {
  movieItem: {
    padding: '20px',
    backgroundColor: '#f9f9f9',
    textAlign: 'center',
  },
  backButton: {
    display: 'inline-block',
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '5px',
    marginBottom: '20px',
  },
  movieImage: {
    width: '80%',
    height: 'auto',
    objectFit: 'cover',
    borderRadius: '10px',
    marginBottom: '20px',
  },
}


export default MovieItem
