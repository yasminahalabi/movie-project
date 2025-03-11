// import React, { useEffect, useState } from 'react'
// import axios from 'axios'
// import { useQuery , useMutation, useQueryClient } from '@tanstack/react-query'
// import { Link } from "react-router-dom"

// const fetchMovies = async () => {
//     const response = await axios.get('http://localhost:8000/movies')
//     return response.data
//   }  

// const MoviesList = () => {
//     const queryClient = useQueryClient()
//     const [isHovered, setIsHovered] = useState(null);
//     // const [expandedMovieId, setExpandedMovieId] = useState(null);

//     // מחיקה רכה
//     const softDeleteMovie = useMutation({
//         mutationFn: async (movieId) => {
//             await axios.put(`http://localhost:8000/movies/${movieId}/delete`)
//         },
//         onSuccess: () => {
//               queryClient.invalidateQueries(['movies'])
//           },
//     })

//     // מחיקה מוחלטת
//     const permanentDeleteMovie = useMutation({
//         mutationFn: async (movieId) => {
//             await axios.delete(`http://localhost:8000/movies/${movieId}`)
//         },
//         onSuccess: () => {
//             queryClient.invalidateQueries(['movies'])
//         },
//     })

//     const { data: list, error, isLoading } = useQuery({
//         queryKey: ['movies'],
//         queryFn: fetchMovies,
//         staleTime: 5000 ,
//     })
  
//     if (isLoading) return <p>Loading movies..</p>
//     if (error) return <p style={{ color: 'red' }}>Error: {error.message}</p>

    
// //     return (
// //         <div style={styles.moviesList}>
// //           <h1 style={styles.header}>Movies List</h1>
// //           <p>Currently {list?.length?? 0} movies in the collection</p>
// //           <div style={styles.movieGrid}>
// //           {(list || []).map((movie) => (
// //               <div key={movie.id} style={{
// //                   ...styles.movieItem, 
// //                   ...(isHovered === movie.id ? styles.movieItemHover : {}),
// //                 }}
// //                 onMouseEnter={() => setIsHovered(movie.id)} 
// //                 onMouseLeave={() => setIsHovered(null)}>
              
// //                 <img src={movie.url_image} alt={movie.title} style={styles.movieImage} />
// //                 <div style={styles.movieInfo}>
// //                   <h2>{movie.title} ({new Date(movie.release_date).getFullYear()})</h2>
// //                   <p><strong>Description:</strong> {movie.description}</p>
// //                   <p><strong>Release Date:</strong> {movie.release_date}</p>
// //                   {expandedMovieId === movie.id && (
// //                     <>
// //                       <p><strong>Duration:</strong> {movie.duration} minutes</p>
// //                       <p><strong>Genres:</strong> {movie.genre_ids?.join(', ')}</p>
// //                       <p><strong>Actors:</strong> {movie.actors?.join(', ')}</p>
// //                       <p><strong>Director:</strong> {movie.director}</p>
// //                       <p><strong>Language:</strong> {movie.language}</p>
// //                       <p><strong>Rating:</strong> {movie.rating}</p>
// //                       <p><strong>Star Rating:</strong> {movie.star_rating}</p>
// //                       <p><strong>Awards:</strong> {movie.awards}</p>
// //                       <p><strong>Age Restriction:</strong> {movie.age_restriction}+</p>
// //                       <p><strong>Watch Now :</strong> <a href={movie.watchurl} target="_blank" rel="noopener noreferrer">Click here</a></p>
// //                     </>
// //                   )}
// //                   <button 
// //                     style={styles.toggleButton} 
// //                     onClick={() => setExpandedMovieId(expandedMovieId === movie.id ? null : movie.id)}
// //                   >
// //                     {expandedMovieId === movie.id ? 'Show Less' : 'Show More'}
// //                   </button>
// //                   <div style={styles.buttonGroup}>
// //                       <Link to={`/edit/${movie.id}`}><button>Edit</button></Link>
// //                       <button onClick={() => softDeleteMovie.mutate(movie.id)} style={styles.softDelete}>Soft Delete</button>
// //                       <button onClick={() => permanentDeleteMovie.mutate(movie.id)} style={styles.hardDelete}>Delete Forever</button>        
// //                   </div>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //     )
// // }

//     return (
//       <div style={styles.moviesList}>
//         <h1 style={styles.header}>Movies List</h1>
//         <p>Currently {list?.length ?? 0} movies in the collection</p>
//         <div style={styles.movieGrid}>
//           {(list || []).map((movie) => (
//             <div
//               key={movie.id}
//               style={{
//                 ...styles.movieItem,
//                 ...(isHovered === movie.id ? styles.movieItemHover : {}),
//               }}
//               onMouseEnter={() => setIsHovered(movie.id)} 
//               onMouseLeave={() => setIsHovered(null)}
//             >
//               <Link to={`/list/${movie.id}`}>
//                 <img src={movie.url_image} alt={movie.title} style={styles.movieImage} />
//               </Link>
//               <div style={styles.movieInfo}>
//                 <h2 style={styles.movieTitle}>{movie.title} ({new Date(movie.release_date).getFullYear()})</h2>
//                 <p style={styles.movieDescription}><strong>Description:</strong> {movie.description}</p>
//                 <p><strong>Release Date:</strong> {movie.release_date}</p>
//                   <p><strong>Duration:</strong> {movie.duration} minutes</p>

//                   <div style={styles.buttonGroup}>
//                     <Link to={`/edit/${movie.id}`}><button style={styles.editButton}>Edit</button></Link>
//                     <button onClick={() => softDeleteMovie.mutate(movie.id)} style={styles.softDelete}>Soft Delete</button>
//                     <button onClick={() => permanentDeleteMovie.mutate(movie.id)} style={styles.hardDelete}>Delete Forever</button>        
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )
//     }

// const styles = {
//   moviesList: {
//     padding: '20px',
//     backgroundColor: '#f4f4f4',
//   },
//   header: {
//     textAlign: 'center',
//     fontSize: '2rem',
//     marginBottom: '20px',
//   },
//   movieGrid: {
//     display: 'flex',
//     flexWrap: 'wrap',
//     justifyContent: 'space-around',
//   },
//   movieItem: {
//     width: 'calc(25% - 20px)',
//     marginBottom: '20px',
//     backgroundColor: '#fff',
//     padding: '10px',
//     borderRadius: '5px',
//     boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
//     boxSizing: 'border-box',
//     transition: 'transform 0.3s ease, box-shadow 0.3s ease',
//   },
//   movieItemHover: {
//     transform: 'translateY(-10px)',
//     boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
//   },
//   movieImage: {
//     width: '100%',
//     height: 'auto',
//     objectFit: 'cover',
//     borderRadius: '5px',
//   },
//   movieInfo: {
//     paddingTop: '10px',
//     textAlign: 'center',
//   },
//   movieTitle: {
//     fontSize: '1.2rem',
//     fontWeight: 'bold',
//     marginBottom: '10px',
//   },
//   movieDescription: {
//     fontSize: '0.9rem',
//     margin: '10px 0',
//     color: '#777',
//   },
//   buttonGroup: {
//     marginTop: '10px',
//     display: 'flex',
//     justifyContent: 'center',
//     gap: '10px',
//   },
//   softDelete: {
//     backgroundColor: '#ffcc00',
//     color: '#000',
//     border: 'none',
//     padding: '5px 10px',
//     cursor: 'pointer',
//     borderRadius: '5px',
//   },
//   hardDelete: {
//     backgroundColor: '#ff0000',
//     color: '#fff',
//     border: 'none',
//     padding: '5px 10px',
//     cursor: 'pointer',
//     borderRadius: '5px',
//   },
//   editButton: {
//     backgroundColor: '#4CAF50',
//     color: '#fff',
//     border: 'none',
//     padding: '5px 10px',
//     cursor: 'pointer',
//     borderRadius: '5px',
//   },
// }


// // const styles = {
// //   moviesList: {
// //     padding: '20px',
// //     backgroundColor: '#f4f4f4',
// //     fontFamily: 'Arial, sans-serif',
// //   },
// //   header: {
// //     textAlign: 'center',
// //     fontSize: '2rem',
// //     color: '#333',
// //     marginBottom: '20px',
// //   },
// //   movieGrid: {
// //     display: 'flex',
// //     flexWrap: 'wrap',
// //     justifyContent: 'space-around',
// //   },
// //   movieItem: {
// //     width: 'calc(25% - 20px)',
// //     marginBottom: '20px',
// //     backgroundColor: '#fff',
// //     padding: '15px',
// //     borderRadius: '10px',
// //     boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
// //     boxSizing: 'border-box',
// //     transition: 'transform 0.3s ease, box-shadow 0.3s ease',
// //   },
// //   movieItemHover: {
// //     transform: 'translateY(-10px)',
// //     boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
// //   },
// //   movieImage: {
// //     width: '100%',
// //     height: 'auto',
// //     objectFit: 'cover',
// //     borderRadius: '5px',
// //   },
// //   movieInfo: {
// //     paddingTop: '15px',
// //     textAlign: 'center',
// //     color: '#555',
// //   },
// //   movieTitle: {
// //     fontSize: '1.2rem',
// //     fontWeight: 'bold',
// //     marginBottom: '10px',
// //     color: '#333',
// //   },
// //   movieDescription: {
// //     fontSize: '0.9rem',
// //     margin: '10px 0',
// //     color: '#777',
// //   },
// //   buttonGroup: {
// //     marginTop: '10px',
// //     display: 'flex',
// //     justifyContent: 'center',
// //     gap: '10px',
// //   },
// //   softDelete: {
// //     backgroundColor: '#ffcc00',
// //     color: '#000',
// //     border: 'none',
// //     padding: '8px 15px',
// //     cursor: 'pointer',
// //     borderRadius: '5px',
// //     fontWeight: 'bold',
// //     transition: 'background-color 0.3s ease',
// //   },
// //   hardDelete: {
// //     backgroundColor: '#ff0000',
// //     color: '#fff',
// //     border: 'none',
// //     padding: '8px 15px',
// //     cursor: 'pointer',
// //     borderRadius: '5px',
// //     fontWeight: 'bold',
// //     transition: 'background-color 0.3s ease',
// //   },
// //   editButton: {
// //     backgroundColor: '#4CAF50',
// //     color: '#fff',
// //     border: 'none',
// //     padding: '8px 15px',
// //     cursor: 'pointer',
// //     borderRadius: '5px',
// //     fontWeight: 'bold',
// //     transition: 'background-color 0.3s ease',
// //   },
// //   toggleButton: {
// //     marginTop: '10px',
// //     backgroundColor: '#007BFF',
// //     color: '#fff',
// //     padding: '5px 10px',
// //     cursor: 'pointer',
// //     border: 'none',
// //     borderRadius: '5px',
// //     fontSize: '1rem',
// //   },
// // }

// export default MoviesList
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
      <p className="loadingText">טוען סרטים...</p>
    </div>
  );

  if (error) return (
    <div className="errorContainer">
      <div className="errorIcon">!</div>
      <p className="errorMessage">שגיאה: {error.message}</p>
      <button 
        className="retryButton"
        onClick={() => queryClient.invalidateQueries(['movies'])}
      >
        נסה שוב
      </button>
    </div>
  );

  return (
    <div className="pageContainer">
      <div className="headerSection">
        <h1 className="header">ספריית הסרטים שלי</h1>
        <div className="statsBar">
          <div className="statItem">
            <span className="statValue">{list?.length || 0}</span>
            <span className="statLabel">סרטים בספרייה</span>
          </div>
          <Link to="/add-movie" className="addButton">
            <span className="addButtonIcon">+</span>
            הוסף סרט חדש
          </Link>
          <Link to="/favorite" className="favoritesButton">❤️ סרטים שאהבתי</Link>
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
                  <span className="viewDetailsButton">צפה בפרטים</span>
                </div>
              </div>
            </Link>

            <div className="movieInfo">
              <h2 className="movieTitle">{movie.title}</h2>
              <p className="movieDescription">{movie.description}</p>

              {/* כפתורי פעולות */}
              <div className="actionsContainer">
                <Link to={`/edit/${movie.id}`} className="updateButton">📝 עדכן</Link>
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
                  🗑️ מחיקה רכה
                </button>

                {showDeleteConfirm === movie.id ? (
                  <>
                    <button 
                      className="deleteButton"
                      onClick={() => permanentDeleteMovie.mutate(movie.id)}
                    >
                      ❌ מחיקה מוחלטת
                    </button>
                    <button 
                      className="cancelButton"
                      onClick={() => setShowDeleteConfirm(null)}
                    >
                      ביטול
                    </button>
                  </>
                ) : (
                  <button 
                    className="deleteButton"
                    onClick={() => setShowDeleteConfirm(movie.id)}
                  >
                    🗑️ מחק
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

