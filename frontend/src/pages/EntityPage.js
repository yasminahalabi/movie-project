// import React from 'react';
// import { useParams } from 'react-router-dom';
// import { useQuery } from '@tanstack/react-query';
// import axios from 'axios';

// const fetchMovieById = async (id) => {
//   const response = await axios.get(`http://localhost:8000/movies/${id}`);
//   return response.data;
// };

// const EntityPage = () => {
//   const { id } = useParams();
//   const { data, isLoading, error } = useQuery({
//     queryKey: ['movie', id],
//     queryFn: () => fetchMovieById(id),
//   });

//   if (isLoading) return <p>Loading movie...</p>;
//   if (error) return <p style={{ color: 'red' }}>Error: {error.message}</p>;

//   return (
//     <div>
//       <h1>{data.title}</h1>
//       <img src={data.imageUrl} alt={data.title} style={{ width: '100%', height: 'auto' }} />
//       <p>Release Date: {new Date(data.release_date).toLocaleDateString()}</p>
//       <p>Gener IDs: {data.gener_ids.join(', ')}</p>
//     </div>
//   );
// };

// export default EntityPage;
