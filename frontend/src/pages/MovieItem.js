// import React, { useState } from 'react'
// import { useParams , Link } from 'react-router-dom'
// import { useQuery } from '@tanstack/react-query'
// import axios from 'axios'



// // פונקציה לשליפת סרט לפי מזהה
// const fetchMovieById = async (movieId) => {
//   const response = await axios.get(`http://localhost:8000/movies/${movieId}`)
//   return response.data
// }

// const MovieItem = ({ softDeleteMovie, permanentDeleteMovie }) => {
//   const { movieId } = useParams()

//     // שימוש ב-useQuery לשליפת פרטי הסרט לפי ה-ID
//   const { data: movie, error, isLoading } = useQuery({
//      queryKey: ['movie', movieId], // המפתח של השאילתה
//      queryFn: () => fetchMovieById(movieId), // פונקציה לשליפת הנתונים
//      enabled: !!movieId, // לא לשלוף עד שמגיעים ל-movieId
//   })

//   if (isLoading) return <p>Loading movie details...</p>
//   if (error) return <p style={{ color: 'red' }}>Error: {error.message}</p>
//   if (!movie) return <p style={styles.errorMessage}>Movie not found</p>

//   return (
//     <div style={styles.movieItem}>
//       <Link to="/list" style={styles.backButton}>Back to Movies List</Link>
//       <div style={styles.contentWrapper}>
//         <div style={styles.movieDetail}>
//           <h1 style={styles.title}>{movie.title} ({new Date(movie.release_date).getFullYear()})</h1>
//           <img src={movie.url_image || '/default-image.jpg'} alt={movie.title} style={styles.movieImage} />
//           <div style={styles.detailsContainer}>
//             <p><strong>Description:</strong> {movie.description}</p>
//             <p><strong>Release Date:</strong> {movie.release_date}</p>
//             <p><strong>Duration:</strong> {movie.duration} minutes</p>
//             <p><strong>Genres:</strong> {movie.genres?.join(', ')}</p>
//             <p><strong>Actors:</strong> {movie.actors?.join(', ')}</p>
//             <p><strong>Director:</strong> {movie.director}</p>
//             <p><strong>Language:</strong> {movie.language}</p>
//             <p><strong>Rating:</strong> {movie.rating}</p>
//             <p><strong>Star Rating:</strong> {movie.star_rating}</p>
//             <p><strong>Awards:</strong> {movie.awards}</p>
//             <p><strong>Age Restriction:</strong> {movie.age_restriction}+</p>
//             <p><strong>Watch Now:</strong> <a href={movie.watchurl} target="_blank" rel="noopener noreferrer">Click here</a></p>
//         </div>
//        </div> 
//      </div> 
//     </div>    
//   )
// }


// const styles = {
//   movieItem: {
//     padding: '50px',
//     backgroundColor: '#f3f5f7',
//     borderRadius: '20px',
//     boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
//     color: '#333',
//     maxWidth: '1100px',
//     margin: '50px auto',
//     fontFamily: '"Poppins", sans-serif',
//     textAlign: 'center',
//     position: 'relative',
//     transition: 'transform 0.3s ease-in-out',
//   },
//   backButton: {
//     display: 'inline-block',
//     padding: '12px 30px',
//     backgroundColor: '#007BFF',
//     color: '#fff',
//     textDecoration: 'none',
//     borderRadius: '30px',
//     marginBottom: '40px',
//     fontSize: '1.2rem',
//     boxShadow: '0 8px 15px rgba(0, 0, 0, 0.2)',
//     transition: 'all 0.3s ease',
//   },
//   contentWrapper: {
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     flexDirection: 'column',
//     gap: '40px',
//   },
//   movieDetail: {
//     width: '80%',
//     padding: '40px',
//     backgroundColor: '#fff',
//     borderRadius: '15px',
//     boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
//     transition: 'all 0.3s ease-in-out',
//   },
//   title: {
//     fontSize: '2.5rem',
//     fontWeight: '700',
//     color: '#2a2a2a',
//     marginBottom: '30px',
//     letterSpacing: '1px',
//   },
//   movieImage: {
//     width: '70%',
//     height: 'auto',
//     objectFit: 'cover',
//     borderRadius: '15px',
//     marginBottom: '30px',
//     border: '4px solid #fff',
//     boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
//     transition: 'transform 0.3s ease',
//   },
//   detailsContainer: {
//     color: '#444',
//     fontSize: '1.2rem',
//     lineHeight: '1.8',
//     marginTop: '30px',
//   },
//   errorMessage: {
//     color: '#e74c3c',
//     fontSize: '1.4rem',
//     textAlign: 'center',
//     padding: '25px',
//     backgroundColor: '#fff',
//     borderRadius: '15px',
//     margin: '20px 0',
//     boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
//   },
// }

// export default MovieItem

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// פונקציה לשליפת סרט לפי מזהה
const fetchMovieById = async (movieId) => {
  const response = await axios.get(`http://localhost:8000/movies/${movieId}`);
  return response.data;
};

const MovieItem = ({ softDeleteMovie, permanentDeleteMovie }) => {
  const { movieId } = useParams();
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // שימוש ב-useQuery לשליפת פרטי הסרט לפי ה-ID
  const { data: movie, error, isLoading } = useQuery({
    queryKey: ['movie', movieId], // המפתח של השאילתה
    queryFn: () => fetchMovieById(movieId), // פונקציה לשליפת הנתונים
    enabled: !!movieId, // לא לשלוף עד שמגיעים ל-movieId
  });

  // אפקט להצגת האנימציה לאחר טעינת הדף
  useEffect(() => {
    if (movie && !isLoading) {
      setTimeout(() => {
        setShowDetails(true);
      }, 300);
    }
  }, [movie, isLoading]);

  if (isLoading) return <div style={styles.loadingContainer}><div style={styles.loader}></div><p style={styles.loadingText}>טוען את פרטי הסרט...</p></div>;
  if (error) return <div style={styles.errorContainer}><div style={styles.errorIcon}>!</div><p style={styles.errorMessage}>שגיאה: {error.message}</p></div>;
  if (!movie) return <div style={styles.errorContainer}><div style={styles.errorIcon}>?</div><p style={styles.errorMessage}>הסרט לא נמצא</p></div>;

  // חישוב צבע רקע דינמי בהתאם לדירוג הסרט
  const getRatingColor = (rating) => {
    const numericRating = parseFloat(rating);
    if (numericRating >= 8) return '#4CAF50';  // ירוק לדירוג גבוה
    if (numericRating >= 6) return '#FFC107';  // צהוב לדירוג בינוני
    return '#FF5722';  // כתום-אדום לדירוג נמוך
  };

  // פונקציה ליצירת כוכבים לפי דירוג
  const renderStars = (rating) => {
    const numericRating = parseFloat(rating) || 0;
    const fullStars = Math.floor(numericRating);
    const hasHalfStar = numericRating - fullStars >= 0.5;
    
    return (
      <div style={styles.starsContainer}>
        {[...Array(5)].map((_, index) => (
          <span key={index} style={{
            ...styles.star,
            color: index < fullStars ? '#FFD700' : (index === fullStars && hasHalfStar ? '#FFD700' : '#ccc'),
            clipPath: index === fullStars && hasHalfStar ? 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' : 'none'
          }}>★</span>
        ))}
        <span style={styles.ratingNumber}>{numericRating.toFixed(1)}</span>
      </div>
    );
  };

  // פורמט תאריך בצורה נוחה לקריאה
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div style={styles.pageContainer}>
      <div style={{
        ...styles.movieItem,
        opacity: showDetails ? 1 : 0,
        transform: showDetails ? 'translateY(0)' : 'translateY(20px)'
      }}>
        <div style={styles.backButtonContainer}>
          <Link to="/list" style={styles.backButton}>
            <span style={styles.backArrow}>←</span> Back to the movie list
          </Link>
        </div>
        
        <div style={styles.contentWrapper}>
          <div style={styles.movieBanner} className="movie-banner">
            <div style={styles.moviePoster}>
              <div style={styles.posterFrame}>
                <img 
                  src={movie.url_image || '/default-image.jpg'} 
                  alt={movie.title}
                  style={{
                    ...styles.movieImage,
                    opacity: isImageLoaded ? 1 : 0
                  }}
                  onLoad={() => setIsImageLoaded(true)}
                />
                {!isImageLoaded && <div style={styles.imageLoader}></div>}
                <div style={styles.posterOverlay}></div>
              </div>
            </div>
            
            <div style={styles.titleContainer}>
              <h1 style={styles.title}>
                {movie.title} 
                <span style={styles.year}>({new Date(movie.release_date).getFullYear()})</span>
              </h1>
              
              <div style={styles.quickInfo}>
                <span style={styles.pill}>{movie.duration} minutes</span>
                <span style={styles.pill}>{movie.language}</span>
                {movie.age_restriction && <span style={styles.ageRestriction}>{movie.age_restriction}+</span>}
              </div>
              
              <div style={styles.ratingContainer}>
                {renderStars(movie.star_rating)}
                <div style={{
                  ...styles.ratingBadge,
                  backgroundColor: getRatingColor(movie.rating)
                }}>
                  {movie.rating}
                </div>
              </div>
              
              {movie.watchurl && (
                <a href={movie.watchurl} target="_blank" rel="noopener noreferrer" style={styles.watchButton}>
                  <span style={styles.watchIcon}>▶</span> Watch Now
                </a>
              )}
            </div>
          </div>
          
          <div style={styles.movieDetail}>
            <div style={styles.detailsContainer}>
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Description :</h3>
                <p style={styles.description}>{movie.description}</p>
              </div>
              
              <div style={styles.infoColumns}>
                <div style={styles.infoColumn}>
                  <div style={styles.section}>
                    <h3 style={styles.sectionTitle}>Movie details</h3>
                    <div style={styles.infoRow}>
                      <span style={styles.infoLabel}>Director :</span>
                      <span style={styles.infoValue}>{movie.director}</span>
                    </div>
                    <div style={styles.infoRow}>
                      <span style={styles.infoLabel}> Release Date :</span>
                      <span style={styles.infoValue}>{formatDate(movie.release_date)}</span>
                    </div>
                    <div style={styles.infoRow}>
                      <span style={styles.infoLabel}>Duration :</span>
                      <span style={styles.infoValue}>{movie.duration} minutes</span>
                    </div>
                    <div style={styles.infoRow}>
                      <span style={styles.infoLabel}>Language:</span>
                      <span style={styles.infoValue}>{movie.language}</span>
                    </div>
                    <div style={styles.infoRow}>
                      <span style={styles.infoLabel}> Age Restriction:</span>
                      <span style={styles.infoValue}>{movie.age_restriction}+</span>
                    </div>
                  </div>
                </div>
                
                <div style={styles.infoColumn}>
                  <div style={styles.section}>
                    <h3 style={styles.sectionTitle}>Genres : </h3>
                    <div style={styles.tagsContainer}>
                      {movie.genres?.map((genre, index) => (
                        <span key={index} style={styles.genreTag}>{genre}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div style={styles.section}>
                    <h3 style={styles.sectionTitle}>Actors :</h3>
                    <div style={styles.actorsContainer}>
                      {movie.actors?.map((actor, index) => (
                        <span key={index} style={styles.actorTag}>{actor}</span>
                      ))}
                    </div>
                  </div>
                  
                  {movie.awards && (
                    <div style={styles.section}>
                      <h3 style={styles.sectionTitle}>Awards :</h3>
                      <div style={styles.awardsContainer}>
                        <div style={styles.awardBadge}>
                          <span style={styles.awardIcon}>🏆</span>
                          <span>{movie.awards}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    backgroundColor: '#f0f2f5',
    minHeight: '100vh',
    padding: '40px 20px',
    fontFamily: '"Poppins", "Heebo", sans-serif',
    direction: 'ltl',
    textAlign: 'left',
  },
  movieItem: {
    backgroundColor: '#fff',
    borderRadius: '20px',
    boxShadow: '0 15px 50px rgba(0, 0, 0, 0.1)',
    color: '#333',
    maxWidth: '1200px',
    margin: '0 auto',
    overflow: 'hidden',
    transition: 'opacity 0.6s ease, transform 0.6s ease',
  },
  backButtonContainer: {
    padding: '20px 30px',
    borderBottom: '1px solid #eee',
  },
  backButton: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#f8f9fa',
    color: '#444',
    textDecoration: 'none',
    borderRadius: '30px',
    fontSize: '0.95rem',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    border: '1px solid #eaeaea',
  },
  backArrow: {
    marginLeft: '8px',
    fontSize: '1.2rem',
  },
  contentWrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  movieBanner: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '30px',
    background: 'linear-gradient(135deg,rgb(245, 224, 238) 0%,rgb(249, 196, 237) 100%)',
    color: '#fff',
    overflow: 'hidden',
    boxShadow: 'inset 0 -10px 15px -5px rgba(0, 0, 0, 0.2)',
  },
  moviePoster: {
    width: '100%',
    maxWidth: '300px',
    marginBottom: '30px',
    zIndex: 1,
  },
  posterFrame: {
    position: 'relative',
    width: '100%',
    paddingBottom: '150%', // 2:3 aspect ratio
    borderRadius: '15px',
    overflow: 'hidden',
    boxShadow: '0 20px 30px rgba(0, 0, 0, 0.3)',
  },
  movieImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'opacity 0.5s ease, transform 0.5s ease',
    zIndex: 1,
  },
  posterOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(to bottom, rgba(0,0,0,0) 70%, rgba(0,0,0,0.6) 100%)',
    zIndex: 2,
  },
  titleContainer: {
    width: '100%',
    textAlign: 'center',
    zIndex: 1,
    marginTop: '10px',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#fff',
    margin: '0 0 15px 0',
    textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
  },
  year: {
    fontSize: '1.8rem',
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: '10px',
  },
  quickInfo: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '10px',
    margin: '15px 0',
  },
  pill: {
    padding: '6px 15px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: '500',
  },
  ageRestriction: {
    padding: '6px 15px',
    backgroundColor: '#e74c3c',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: '600',
  },
  ratingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '20px',
    margin: '20px 0',
  },
  starsContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  star: {
    fontSize: '1.5rem',
    marginleft: '2px',
  },
  ratingNumber: {
    marginLeft: '10px',
    fontSize: '1.2rem',
    fontWeight: '600',
  },
  ratingBadge: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#fff',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
  },
  watchButton: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '14px 30px',
    backgroundColor: '#e50914',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '30px',
    fontSize: '1.1rem',
    fontWeight: '600',
    marginTop: '20px',
    boxShadow: '0 10px 20px rgba(229, 9, 20, 0.3)',
    transition: 'all 0.3s ease',
  },
  watchIcon: {
    marginLeft: '10px',
    fontSize: '1.2rem',
  },
  movieDetail: {
    padding: '40px',
  },
  detailsContainer: {
    color: '#444',
    fontSize: '1.1rem',
    lineHeight: '1.8',
  },
  section: {
    marginBottom: '30px',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#333',
    marginBottom: '15px',
    position: 'relative',
    paddingBottom: '10px',
  },
  description: {
    lineHeight: '1.8',
    fontSize: '1.1rem',
    color: '#555',
  },
  infoColumns: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '40px',
    marginTop: '30px',
  },
  infoColumn: {
    flex: '1 1 300px',
  },
  infoRow: {
    display: 'flex',
    marginBottom: '12px',
    borderBottom: '1px dashed #eee',
    paddingBottom: '12px',
  },
  infoLabel: {
    minWidth: '120px',
    fontWeight: '600',
    color: '#666',
  },
  infoValue: {
    flex: '1',
    color: '#333',
  },
  tagsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
  },
  genreTag: {
    padding: '8px 16px',
    backgroundColor: '#f0f7ff',
    color: '#3498db',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: '500',
    border: '1px solid #d1e6fa',
  },
  actorsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
  },
  actorTag: {
    padding: '8px 16px',
    backgroundColor: '#f7f7f7',
    color: '#555',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: '500',
    border: '1px solid #eaeaea',
  },
  awardsContainer: {
    marginTop: '10px',
  },
  awardBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#FFF9C4',
    color: '#FF8F00',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: '500',
    border: '1px solid #FFE082',
  },
  awardIcon: {
    fontSize: '1.5rem',
    marginLeft: '10px',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '70vh',
  },
  loader: {
    border: '5px solid #f3f3f3',
    borderTop: '5px solid #3498db',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    marginTop: '20px',
    fontSize: '1.2rem',
    color: '#666',
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '70vh',
    padding: '40px',
    backgroundColor: '#fff',
    borderRadius: '15px',
    maxWidth: '600px',
    margin: '0 auto',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
  },
  errorIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#ffecec',
    color: '#e74c3c',
    fontSize: '2.5rem',
    fontWeight: '700',
    marginBottom: '20px',
  },
  errorMessage: {
    color: '#e74c3c',
    fontSize: '1.4rem',
    textAlign: 'center',
  },
  imageLoader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #3498db',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    animation: 'spin 1s linear infinite',
    zIndex: 0,
  },
};

export default MovieItem