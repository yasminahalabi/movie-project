import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import MoviesList from './pages/MovieList'
import MovieItem from './pages/MovieItem'
// import EntityPage from './pages/EntityPage';
import MovieForm from './pages/MovieForm'
import NavBar from './pages/NavBar';
import HomePage from './pages/Home';
import GenresList from './pages/GenresList';

function App() {
  return (
    <BrowserRouter>
    <div className="App">
      <NavBar/>
      <Routes>
          <Route path="/" element={<HomePage />} /> {/* הוספת Route לדף הבית */}
          <Route path='list' element={<MoviesList/>}/>
          <Route path="/list/:movieId" element={<MovieItem />} />
          {/* <Route path="/movies/:id" element={<EntityPage />} />  */}
          <Route path='/add-movie' element={<MovieForm />} />
          <Route path="/edit/:id" element={<MovieForm />} />
          <Route path="/genres" element={<GenresList />} />

      </Routes> 
    </div>
    </BrowserRouter>
  );
}

export default App;
