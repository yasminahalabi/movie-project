import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const addGenre = async (genre) => {
  const response = await axios.post('http://localhost:8000/genres', genre);
  return response.data;
};

const updateGenre = async (id, genre) => {
  const response = await axios.put(`http://localhost:8000/genres/${id}`, genre);
  return response.data;
};

const GenreForm = () => {
  const [selectedGenreId, setSelectedGenreId] = useState(null);
  const [message, setMessage] = useState('');

  const { data: genres, isLoading: genresLoading, isError: genresError } = useQuery({
    queryKey: ['genres'],
    queryFn: () => axios.get('http://localhost:8000/genres').then((res) => res.data),
  });

  const { data: genreData } = useQuery({
    queryKey: ['genre', selectedGenreId],
    queryFn: () => axios.get(`http://localhost:8000/genres/${selectedGenreId}`).then((res) => res.data),
    enabled: !!selectedGenreId,
  });

  const formik = useFormik({
    initialValues: {
      name: genreData?.name || '',
      image: genreData?.image || '',
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        if (selectedGenreId) {
          await updateGenre(selectedGenreId, values);
          setMessage('✅ Genre updated successfully!');
        } else {
          await addGenre(values);
          setMessage('🎉 Genre added successfully!');
        }
        formik.resetForm();
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage('❌ Error occurred while processing your request.');
      }
    },
  });

  if (genresLoading) return <div style={styles.loading}>Loading genres...</div>;
  if (genresError) return <div style={styles.error}>Error loading genres.</div>;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.title}>{selectedGenreId ? 'Edit Genre' : 'Add Genre'}</h2>

        <div style={styles.selectWrapper}>
          <label htmlFor="selectGenre" style={styles.label}>Select Genre to Edit:</label>
          <select
            id="selectGenre"
            onChange={(e) => setSelectedGenreId(e.target.value)}
            value={selectedGenreId || ''}
            style={styles.select}
          >
            <option value="">Select a genre</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>{genre.name}</option>
            ))}
          </select>
        </div>

        {message && <div style={message.includes('Error') ? styles.errorMessage : styles.successMessage}>{message}</div>}

        <form onSubmit={formik.handleSubmit} style={styles.form}>
          <div style={styles.inputWrapper}>
            <label htmlFor="name" style={styles.label}>Genre Name:</label>
            <input
              id="name"
              name="name"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.name}
              style={styles.input}
            />
          </div>

          <div style={styles.inputWrapper}>
            <label htmlFor="image" style={styles.label}>Image URL:</label>
            <input
              id="image"
              name="image"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.image}
              style={styles.input}
            />
          </div>

          <button type="submit" style={styles.button}>{selectedGenreId ? 'Update' : 'Add'} Genre</button>
        </form>
      </div>
    </div>
  );
};

const styles = {
    page: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #1E1E2E, #3A3A5E)',
    },
    container: {
      background: 'rgba(40, 42, 54, 0.9)',
      padding: '30px',
      borderRadius: '15px',
      boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.3)',
      width: '450px',
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif',
      color: '#FFF',
      transition: 'all 0.3s ease',
    },
    title: {
      fontSize: '28px',
      fontWeight: 'bold',
      marginBottom: '15px',
      color: '#F4A261',
    },
    selectWrapper: {
      marginBottom: '20px',
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontSize: '16px',
      color: '#E9C46A',
    },
    select: {
      width: '100%',
      padding: '12px',
      borderRadius: '8px',
      border: '1px solid #E76F51',
      fontSize: '16px',
      backgroundColor: '#3A3A5E',
      color: '#FFF',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    inputWrapper: {
      marginBottom: '20px',
    },
    input: {
      width: '100%',
      padding: '14px',
      borderRadius: '8px',
      border: '1px solid #E76F51',
      fontSize: '16px',
      backgroundColor: '#3A3A5E',
      color: '#FFF',
      transition: 'all 0.3s ease',
    },
    button: {
      width: '100%',
      padding: '14px',
      background: 'linear-gradient(90deg, #FF416C, #FF4B2B)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '18px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    successMessage: {
      marginTop: '15px',
      padding: '10px',
      backgroundColor: '#2A9D8F',
      color: '#FFF',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: 'bold',
      transition: 'opacity 0.3s ease-in-out',
    },
    errorMessage: {
      marginTop: '15px',
      padding: '10px',
      backgroundColor: '#D62828',
      color: '#FFF',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: 'bold',
      transition: 'opacity 0.3s ease-in-out',
    },
  };
  

export default GenreForm;
