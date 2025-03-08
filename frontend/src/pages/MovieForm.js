import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useQuery , useMutation, useQueryClient } from '@tanstack/react-query'

const fetchGenres = async () => {
    const res = await axios.get("http://localhost:8000/genres"); // כאן צריך להיות ה-API שמחזיר את הז'אנרים
    return res.data;
};

const fetchMovie = async (movieId) => {
    const res = await axios.get(`http://localhost:8000/movies/${movieId}`);
    return res.data;
};

const sendNewMovie = async (movieData, isEditMode, id) => {
    return isEditMode
        ? axios.put(`http://localhost:8000/movies/${id}`, movieData)
        : axios.post("http://localhost:8000/movies", movieData);
};

const validationSchema = Yup.object({
    title: Yup.string().required("שדה חובה"),
    release_date: Yup.string().required("שדה חובה"),
    genre_ids: Yup.array().min(1, "יש לבחור לפחות ז'אנר אחד"),
    duration: Yup.number().positive().required("שדה חובה"),
    url_image: Yup.string().url("יש להזין כתובת URL תקינה").required("שדה חובה"),
    description: Yup.string().required("שדה חובה"),
    actors: Yup.string().required("שדה חובה"),
    director: Yup.string().required("שדה חובה"),
    language: Yup.string().required("שדה חובה"),
    rating: Yup.number().min(0).max(10).required("שדה חובה"),
    awards: Yup.string(),
    age_restriction: Yup.number().min(0).required("שדה חובה"),
    watchurl: Yup.string().url("יש להזין כתובת URL תקינה").required("שדה חובה"),
});

const MovieForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);
    const queryClient = useQueryClient();

    const { data: genres } = useQuery({
        queryKey: ["genres"],
        queryFn: fetchGenres,
    });

    const { data: movieData } = useQuery({
    queryKey: ["movie", id],
    queryFn: () => fetchMovie(id),
    enabled: isEditMode,
});

    const movieForm = useFormik({
        initialValues: {
            title: "",
            release_date: "",
            genre_ids: [],
            duration: "",
            url_image: "",
            description: "",
            actors: "",
            director: "",
            language: "",
            rating: "",
            awards: "",
            age_restriction: "",
            watchurl: "",
        },
        validationSchema,
        onSubmit: (values) => {
            const formattedData = {
                ...values,
                genre_ids: values.genre_ids.map(Number),
                actors: values.actors.split(",").map((actor) => actor.trim()),
                awards: values.awards ? values.awards.split(",").map(award => award.trim()) : [],
            };
            mutation.mutate(formattedData);
        },
    });

    useEffect(() => {
        if (movieData && !movieForm.values.title) {  // רק אם הנתונים נטענו וערכי הטופס עדיין לא הוגדרו
            movieForm.setValues({
                title: movieData.title,
                release_date: movieData.release_date,
                genre_ids: movieData.genre_ids,
                duration: movieData.duration,
                url_image: movieData.url_image,
                description: movieData.description,
                actors: movieData.actors.join(", "),
                director: movieData.director,
                language: movieData.language,
                rating: movieData.rating,
                awards: movieData.awards.join(", "),
                age_restriction: movieData.age_restriction,
                watchurl: movieData.watchurl,
            });
        }
    }, [movieData, movieForm.values.title]);  // נוודא שה־useEffect רץ רק כש־movieData משתנה וערך title לא עודכן
    

    const mutation = useMutation({
        mutationFn: (movieData) => sendNewMovie(movieData, isEditMode, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["movies"] });
            movieForm.resetForm();
            navigate("/movies");
        },
    });
    

    return (
        <div style={styles.pageContainer}>
            <h1 style={styles.heading}>Add Movie Form</h1>
            <form style={styles.formContainer}
                onSubmit={movieForm.handleSubmit}>

                <div style={styles.formField}>
                    <label style={styles.label}>{"Title"}</label>   
                    <input
                    type="text"
                    name="title"
                    placeholder="Enter movie title"
                    value={movieForm.values.title}
                    onChange={movieForm.handleChange}
                    style={styles.inputField}
                    />
                    {movieForm.errors.title  && (
                        <div style={styles.error}>{movieForm.errors.title}</div>
                    )}
                </div>

                <div style={styles.formField}>
                    <label style={styles.label}>{"release_date"}</label>
                    <input
                    type="date"
                    name="release_date"
                    placeholder="Enter release date"
                    value={movieForm.values.release_date}
                    onChange={movieForm.handleChange}
                    style={styles.inputField}
                    />
                    {movieForm.errors.release_date  && (
                        <div style={styles.error}>{movieForm.errors.release_date}</div>
                    )}
                </div> 

                <div style={styles.formField}>
                    <label style={styles.label}>Genres</label>
                    <div style={styles.checkboxGroup}>
                        {genres?.map((g) => (
                            <label key={g.id} style={styles.checkboxLabel}>
                                <input
                                type="checkbox"
                                name="genre_ids"
                                value={g.id}
                                onChange={(e) => {
                                    const value = parseInt(e.target.value); 
                                    const isChecked = e.target.checked;
                                    const newGenreIds = isChecked
                                        ? [...movieForm.values.genre_ids, value]  
                                        : movieForm.values.genre_ids.filter((id) => id !== value);  
                                    movieForm.setFieldValue("genre_ids", newGenreIds); 
                                }}
                                checked={movieForm.values?.genre_ids?.includes(g.id)}
                                style={styles.checkboxField}
                                />
                                {g.name}
                            </label>
                        ))}
                    </div>
                    {movieForm.errors.genre_ids && (
                        <div style={styles.error}>{movieForm.errors.genre_ids}</div>
                    )}

                    
                </div>    

                <div style={styles.formField}>
                    <label style={styles.label}>Duration (minutes): {movieForm.values.duration} min</label>
                    <input
                        type="range"
                        name="duration"
                        min="30"
                        max="300"
                        value={movieForm.values.duration}
                        onChange={movieForm.handleChange}
                        style={styles.slider}
                    />
                    {movieForm.errors.duration && (
                        <div style={styles.error}>{movieForm.errors.duration}</div>
                    )}
                </div>

                <div style={styles.formField}>
                    <label style={styles.label}>Movie Poster URL</label>
                    <input
                        type="text"
                        name="url_image"
                        placeholder="Enter image URL"
                        value={movieForm.values.url_image}
                        onChange={movieForm.handleChange}
                        style={styles.inputField}
                    />
                    {movieForm.errors.url_image&& (
                        <div style={styles.error}>{movieForm.errors.url_image}</div>
                    )}
                    
                </div>
                                
                <div style={styles.formField}>
                    <label style={styles.label}>Description</label>
                    <textarea
                        name="description"
                        placeholder="Enter movie description"
                        value={movieForm.values.description}
                        onChange={movieForm.handleChange}
                        style={styles.textArea}
                    />
                    {movieForm.errors.description && (
                        <div style={styles.error}>{movieForm.errors.description}</div>
                    )}
                </div>

                <div style={styles.formField}>
                    <label style={styles.label}>Actors (comma separated)</label>
                    <input
                        type="text"
                        name="actors"
                        placeholder="Enter actors"
                        value={movieForm.values.actors}
                        onChange={movieForm.handleChange}
                        style={styles.inputField}
                    />
                    {movieForm.errors.actors && (
                        <div style={styles.error}>{movieForm.errors.actors}</div>
                    )}
                </div>

                <div style={styles.formField}>
                    <label style={styles.label}>Director</label>
                    <input
                        type="text"
                        name="director"
                        placeholder="Enter director's name"
                        value={movieForm.values.director}
                        onChange={movieForm.handleChange}
                        style={styles.inputField}
                    />
                    {movieForm.errors.director && (
                        <div style={styles.error}>{movieForm.errors.director}</div>
                    )}
                </div>

                <div style={styles.formField}>
                    <label style={styles.label}>Language</label>
                    <input
                        type="text"
                        name="language"
                        placeholder="Enter movie language"
                        value={movieForm.values.language}
                        onChange={movieForm.handleChange}
                        style={styles.inputField}
                    />
                    {movieForm.errors.language && (
                        <div style={styles.error}>{movieForm.errors.language}</div>
                    )}
                </div>

                <div style={styles.formField}>
                    <label style={styles.label}>Rating: {movieForm.values.rating} ⭐</label>
                    <input
                        type="range"
                        name="rating"
                        min="1"
                        max="5"
                        step="1"
                        value={movieForm.values.rating}
                        onChange={movieForm.handleChange}
                        style={styles.slider}
                    />
                    {movieForm.errors.rating && (
                        <div style={styles.error}>{movieForm.errors.rating}</div>
                    )}
                </div>

                <div style={styles.formField}>
                    <label style={styles.label}>Awards (comma separated)</label>
                    <input
                        type="text"
                        name="awards"
                        placeholder="Enter awards"
                        value={movieForm.values.awards}
                        onChange={movieForm.handleChange}
                        style={styles.inputField}
                    />
                    {movieForm.errors.awards && (
                        <div style={styles.error}>{movieForm.errors.awards}</div>
                    )}
                </div>

                {/* הגבלת גיל */}
                <div style={styles.formField}>
                    <label style={styles.label}>Age Limit</label>
                    <input
                        type="number"
                        name="age_restriction"
                        min="0"
                        max="18"
                        value={movieForm.values.age_restriction}
                        onChange={movieForm.handleChange}
                        style={styles.inputField}
                    />
                    {movieForm.errors.age_restriction && (
                        <div style={styles.error}>{movieForm.errors.age_restriction}</div>
                    )}
                </div>

                <div style={styles.formField}>
                    <label style={styles.label}>Watch URL</label>
                    <input
                        type="text"
                        name="watchurl"
                        placeholder="Enter watch URL"
                        value={movieForm.values.watchurl}
                        onChange={movieForm.handleChange}
                        style={styles.inputField}
                    />
                    {movieForm.errors.watchurl && (
                        <div style={styles.error}>{movieForm.errors.watchurl}</div>
                    )}
                </div>


                <button 
                    disabled={!movieForm.isValid || mutation.isLoading} 
                    type="submit" 
                    style={styles.submitButton}
                >
                    {mutation.isLoading ? 'Adding...' : 'Submit'}
                </button>

                {mutation.isSuccess && (
                    <div style={styles.messageSuccess}>
                        Movie added successfully!
                    </div>
                )}

                {mutation.isError && (
                    <div style={styles.messageError}>
                        Failed to add the movie. Please try again.
                    </div>
                )}
                <button type="submit">
                   {isEditMode ? "עדכון סרט" : "הוספת סרט"}
                </button>
            </form>
        </div>
    );
};


const styles = {
    pageContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        width: '100%',
        backgroundImage: 'url("https://wallpaperbat.com/img/125814121-movie-poster-background-wallpaper.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
    },
    heading: {
        color: '#fff',
        fontSize: '32px',
        fontWeight: 'bold',
        marginBottom: '30px',
        textShadow: '2px 2px 10px rgba(0,0,0,0.5)',
    },
    formContainer: {
        width: '80%',
        maxWidth: '900px',
        padding: '30px',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(10px)',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
    },
    formField: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        marginBottom: '15px',
    },
    label: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#fff',
    },
    slider: {
        width: '100%',
        cursor: 'pointer',
    },
    checkboxGroup: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
    },
    checkboxLabel: {
        fontSize: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        background: '#fde2e4',
        padding: '8px 12px',
        borderRadius: '6px',
    },
    checkboxField: {
        transform: 'scale(1.5)',
    },
    error: {
        color: 'red',
        fontSize: '14px',
    },
    messageSuccess: {
        color: '#4CAF50',
        fontSize: '16px',
        fontWeight: 'bold',
        marginBottom: '20px',
    },
    messageError: {
        color: '#F44336',
        fontSize: '16px',
        fontWeight: 'bold',
        marginBottom: '20px',
    },
    textarea: {
        width: '100%',
        minHeight: '120px',
        padding: '10px',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        resize: 'vertical',
        fontSize: '14px',
        color: '#000',
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        backdropFilter: 'blur(5px)',
    },
    submitButton: {
        width: '100%',
        padding: '15px',
        fontSize: '18px',
        backgroundColor: 'rgba(255, 77, 121, 0.8)',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: '0.3s',
    }
    
    
};

export default MovieForm;


// import React , { useState , useEffect } from 'react';
// import { useFormik, Formik, Form, Field } from 'formik';
// import {object, string, array, date , number} from "yup";
// import axios from "axios"
// import { useQuery, useMutation, useQueryClient  } from "@tanstack/react-query"
// import { useParams, useNavigate } from "react-router-dom";
// // import { useParams } from "react-router-dom";

// const MovieForm = () => {
//     // const {id} = useParams() // getting an id from the path
//     // const isEditMode = Boolean(id) // If there is an id, we are in edit mode
        

//     const sendNewMovie = async(movieData) => {
//         const res = await axios.post("http://localhost:8000/movies", movieData)
//         return res.data;
//     }


//     const mockGenres = [
//         { id: 1, name: 'Sci-fi' },
//         { id: 2, name: 'Comedy' },
//         { id: 3, name: 'Drama' },
//         { id: 4, name: 'Action' },
//         { id: 5, name: 'Animation' },
//         { id: 6, name: 'Adventure' },
//         { id: 7, name: 'Musical' },
//         { id: 8, name: 'Family' },
//         { id: 9, name: 'Fantasy' },
//         { id: 10, name: 'Horror' },
//         { id: 11, name: 'Thriller' },
//         { id: 12, name: 'Mystery' },
//         { id: 13, name: 'Crime' },
//         { id: 14, name: 'Romance' },
//         { id: 15, name: 'Western' },
//         { id: 16, name: 'History' },
//         { id: 17, name: 'War' },
//         { id: 18, name: 'Documentary' },
//         { id: 19, name: 'Sport' },
//         { id: 20, name: 'Biography' },
//     ];
        

//     const queryClient = useQueryClient();
  
//     const mutation = useMutation({
//         mutationFn: sendNewMovie,
//         onSuccess: () => {
//             queryClient.invalidateQueries(['movies']);
//             movieForm.resetForm();
//         },
//         onError: () => {},
//     });
    
//     const movieForm = useFormik({
//         initialValues: {
//             title: '',
//             release_date: "",
//             genre_ids: [],
//             duration: 90,
//             url_image: "",
//             description: "",
//             actors: "",
//             director: "",
//             language: "",
//             rating: 3, // דירוג בין 1 ל-5 כוכבים
//             awards: "",
//             age_restriction: 0 ,
//             watchurl: "" ,
//         },
//         onSubmit: async (form) => {
//             const formattedForm = {
//                 ...form,
//                 actors: form.actors.split(',').map(actor => actor.trim()), // המרת השמות לרשימה
//                 awards: form.awards.split(',').map(award => award.trim()), // המרת הפרסים לרשימה
//             };
//             await mutation.mutate(formattedForm);
//         },
//         validationSchema: object({
//             title: string().required("Title is required").min(2, "Title must be at least 2 characters"),
//             release_date: date().nullable().required("Release date is required"),
//             genre_ids: array().min(1, "At least one genre must be selected"),
//             duration: number().min(30, "Duration must be at least 30 minutes").required(),
//             url_image: string().url("Must be a valid URL").required("Image URL is required"),
//             description: string().required("Description is required").min(10, "Description must be at least 10 characters"),
//             actors: string().required("Actors are required"),
//             director: string().required("Director is required"),
//             language: string().required("Language is required"),
//             rating: number().min(1).max(5).required(),
//             awards: string().nullable(),
//             age_restriction: number().min(0).max(18).required(),
//             watchurl: string().url("Must be a valid URL").nullable(),

//         })
//     });

//     return (
//         <div style={styles.pageContainer}>
//             <h1 style={styles.heading}>Add Movie Form</h1>
//             <form style={styles.formContainer}
//                 onSubmit={movieForm.handleSubmit}>

//                 <div style={styles.formField}>
//                     <label style={styles.label}>{"Title"}</label>   
//                     <input
//                     type="text"
//                     name="title"
//                     placeholder="Enter movie title"
//                     value={movieForm.values.title}
//                     onChange={movieForm.handleChange}
//                     style={styles.inputField}
//                     />
//                     {movieForm.errors.title  && (
//                         <div style={styles.error}>{movieForm.errors.title}</div>
//                     )}
//                 </div>

//                 <div style={styles.formField}>
//                     <label style={styles.label}>{"release_date"}</label>
//                     <input
//                     type="date"
//                     name="release_date"
//                     placeholder="Enter release date"
//                     value={movieForm.values.release_date}
//                     onChange={movieForm.handleChange}
//                     style={styles.inputField}
//                     />
//                     {movieForm.errors.release_date  && (
//                         <div style={styles.error}>{movieForm.errors.release_date}</div>
//                     )}
//                 </div> 

//                 <div style={styles.formField}>
//                     <label style={styles.label}>Genres</label>
//                     <div style={styles.checkboxGroup}>
//                         {mockGenres.map((g) => (
//                             <label key={g.id} style={styles.checkboxLabel}>
//                                 <input
//                                 type="checkbox"
//                                 name="genre_ids"
//                                 value={g.id}
//                                 onChange={(e) => {
//                                     const value = parseInt(e.target.value); 
//                                     const isChecked = e.target.checked;
//                                     const newGenreIds = isChecked
//                                         ? [...movieForm.values.genre_ids, value]  
//                                         : movieForm.values.genre_ids.filter((id) => id !== value);  
//                                     movieForm.setFieldValue("genre_ids", newGenreIds); 
//                                 }}
//                                 checked={movieForm.values?.genre_ids?.includes(g.id)}
//                                 style={styles.checkboxField}
//                                 />
//                                 {g.name}
//                             </label>
//                         ))}
//                     </div>
//                     {movieForm.errors.genre_ids && (
//                         <div style={styles.error}>{movieForm.errors.genre_ids}</div>
//                     )}

                    
//                 </div>    

//                 <div style={styles.formField}>
//                     <label style={styles.label}>Duration (minutes): {movieForm.values.duration} min</label>
//                     <input
//                         type="range"
//                         name="duration"
//                         min="30"
//                         max="300"
//                         value={movieForm.values.duration}
//                         onChange={movieForm.handleChange}
//                         style={styles.slider}
//                     />
//                     {movieForm.errors.duration && (
//                         <div style={styles.error}>{movieForm.errors.duration}</div>
//                     )}
//                 </div>

//                 <div style={styles.formField}>
//                     <label style={styles.label}>Movie Poster URL</label>
//                     <input
//                         type="text"
//                         name="url_image"
//                         placeholder="Enter image URL"
//                         value={movieForm.values.url_image}
//                         onChange={movieForm.handleChange}
//                         style={styles.inputField}
//                     />
//                     {movieForm.errors.url_image&& (
//                         <div style={styles.error}>{movieForm.errors.url_image}</div>
//                     )}
                    
//                 </div>
                                
//                 <div style={styles.formField}>
//                     <label style={styles.label}>Description</label>
//                     <textarea
//                         name="description"
//                         placeholder="Enter movie description"
//                         value={movieForm.values.description}
//                         onChange={movieForm.handleChange}
//                         style={styles.textArea}
//                     />
//                     {movieForm.errors.description && (
//                         <div style={styles.error}>{movieForm.errors.description}</div>
//                     )}
//                 </div>

//                 <div style={styles.formField}>
//                     <label style={styles.label}>Actors (comma separated)</label>
//                     <input
//                         type="text"
//                         name="actors"
//                         placeholder="Enter actors"
//                         value={movieForm.values.actors}
//                         onChange={movieForm.handleChange}
//                         style={styles.inputField}
//                     />
//                     {movieForm.errors.actors && (
//                         <div style={styles.error}>{movieForm.errors.actors}</div>
//                     )}
//                 </div>

//                 <div style={styles.formField}>
//                     <label style={styles.label}>Director</label>
//                     <input
//                         type="text"
//                         name="director"
//                         placeholder="Enter director's name"
//                         value={movieForm.values.director}
//                         onChange={movieForm.handleChange}
//                         style={styles.inputField}
//                     />
//                     {movieForm.errors.director && (
//                         <div style={styles.error}>{movieForm.errors.director}</div>
//                     )}
//                 </div>

//                 <div style={styles.formField}>
//                     <label style={styles.label}>Language</label>
//                     <input
//                         type="text"
//                         name="language"
//                         placeholder="Enter movie language"
//                         value={movieForm.values.language}
//                         onChange={movieForm.handleChange}
//                         style={styles.inputField}
//                     />
//                     {movieForm.errors.language && (
//                         <div style={styles.error}>{movieForm.errors.language}</div>
//                     )}
//                 </div>

//                 <div style={styles.formField}>
//                     <label style={styles.label}>Rating: {movieForm.values.rating} ⭐</label>
//                     <input
//                         type="range"
//                         name="rating"
//                         min="1"
//                         max="5"
//                         step="1"
//                         value={movieForm.values.rating}
//                         onChange={movieForm.handleChange}
//                         style={styles.slider}
//                     />
//                     {movieForm.errors.rating && (
//                         <div style={styles.error}>{movieForm.errors.rating}</div>
//                     )}
//                 </div>

//                 <div style={styles.formField}>
//                     <label style={styles.label}>Awards (comma separated)</label>
//                     <input
//                         type="text"
//                         name="awards"
//                         placeholder="Enter awards"
//                         value={movieForm.values.awards}
//                         onChange={movieForm.handleChange}
//                         style={styles.inputField}
//                     />
//                     {movieForm.errors.awards && (
//                         <div style={styles.error}>{movieForm.errors.awards}</div>
//                     )}
//                 </div>

//                 {/* הגבלת גיל */}
//                 <div style={styles.formField}>
//                     <label style={styles.label}>Age Limit</label>
//                     <input
//                         type="number"
//                         name="age_restriction"
//                         min="0"
//                         max="18"
//                         value={movieForm.values.age_restriction}
//                         onChange={movieForm.handleChange}
//                         style={styles.inputField}
//                     />
//                     {movieForm.errors.age_restriction && (
//                         <div style={styles.error}>{movieForm.errors.age_restriction}</div>
//                     )}
//                 </div>

//                 <div style={styles.formField}>
//                     <label style={styles.label}>Watch URL</label>
//                     <input
//                         type="text"
//                         name="watchurl"
//                         placeholder="Enter watch URL"
//                         value={movieForm.values.watchurl}
//                         onChange={movieForm.handleChange}
//                         style={styles.inputField}
//                     />
//                     {movieForm.errors.watchurl && (
//                         <div style={styles.error}>{movieForm.errors.watchurl}</div>
//                     )}
//                 </div>


//                 <button 
//                     disabled={!movieForm.isValid || mutation.isLoading} 
//                     type="submit" 
//                     style={styles.submitButton}
//                 >
//                     {mutation.isLoading ? 'Adding...' : 'Submit'}
//                 </button>

//                 {mutation.isSuccess && (
//                     <div style={styles.messageSuccess}>
//                         Movie added successfully!
//                     </div>
//                 )}

//                 {mutation.isError && (
//                     <div style={styles.messageError}>
//                         Failed to add the movie. Please try again.
//                     </div>
//                 )}
//             </form>
//         </div>
//     );
// };


// const styles = {
//     pageContainer: {
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center',
//         minHeight: '100vh',
//         width: '100%',
//         backgroundImage: 'url("https://wallpaperbat.com/img/125814121-movie-poster-background-wallpaper.jpg")',
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//         backgroundRepeat: 'no-repeat',
//     },
//     heading: {
//         color: '#fff',
//         fontSize: '32px',
//         fontWeight: 'bold',
//         marginBottom: '30px',
//         textShadow: '2px 2px 10px rgba(0,0,0,0.5)',
//     },
//     formContainer: {
//         width: '80%',
//         maxWidth: '900px',
//         padding: '30px',
//         backgroundColor: 'rgba(255, 255, 255, 0.15)',
//         backdropFilter: 'blur(10px)',
//         borderRadius: '12px',
//         boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
//     },
//     formField: {
//         display: 'flex',
//         flexDirection: 'column',
//         gap: '10px',
//         marginBottom: '15px',
//     },
//     label: {
//         fontSize: '16px',
//         fontWeight: 'bold',
//         color: '#fff',
//     },
//     slider: {
//         width: '100%',
//         cursor: 'pointer',
//     },
//     checkboxGroup: {
//         display: 'flex',
//         flexWrap: 'wrap',
//         gap: '10px',
//     },
//     checkboxLabel: {
//         fontSize: '16px',
//         display: 'flex',
//         alignItems: 'center',
//         gap: '5px',
//         background: '#fde2e4',
//         padding: '8px 12px',
//         borderRadius: '6px',
//     },
//     checkboxField: {
//         transform: 'scale(1.5)',
//     },
//     error: {
//         color: 'red',
//         fontSize: '14px',
//     },
//     messageSuccess: {
//         color: '#4CAF50',
//         fontSize: '16px',
//         fontWeight: 'bold',
//         marginBottom: '20px',
//     },
//     messageError: {
//         color: '#F44336',
//         fontSize: '16px',
//         fontWeight: 'bold',
//         marginBottom: '20px',
//     },
//     textarea: {
//         width: '100%',
//         minHeight: '120px',
//         padding: '10px',
//         borderRadius: '8px',
//         border: '1px solid rgba(255, 255, 255, 0.5)',
//         resize: 'vertical',
//         fontSize: '14px',
//         color: '#000',
//         backgroundColor: 'rgba(255, 255, 255, 0.4)',
//         backdropFilter: 'blur(5px)',
//     },
//     submitButton: {
//         width: '100%',
//         padding: '15px',
//         fontSize: '18px',
//         backgroundColor: 'rgba(255, 77, 121, 0.8)',
//         color: 'white',
//         border: 'none',
//         borderRadius: '8px',
//         cursor: 'pointer',
//         fontWeight: 'bold',
//         transition: '0.3s',
//     }
    
    
// };

// export default MovieForm;