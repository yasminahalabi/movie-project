import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import MoviesList from './pages/MovieList'
import MovieItem from './pages/MovieItem'
// import EntityPage from './pages/EntityPage';
import MovieForm from './pages/MovieForm'
import NavBar from './pages/NavBar';
import Home from './pages/Home';
import GenresList from './pages/GenresList';
import GenreForm from './pages/GenreForm';

function App() {
  return (
    <BrowserRouter>
    <div className="App">
      <NavBar/>
      <Routes>
          <Route path="/" element={<Home />} /> 
          <Route path='list' element={<MoviesList/>}/>
          <Route path="/list/:movieId" element={<MovieItem />} />
          {/* <Route path="/movies/:id" element={<EntityPage />} />  */}
          <Route path='/add-movie' element={<MovieForm />} />
          <Route path="/edit/:id" element={<MovieForm />} />
          <Route path="/genres" element={<GenresList />} />
          <Route path="/genres/add" element={<GenreForm />} />
          <Route path="/genres/edit/:id" element={<GenreForm />} /> 
      </Routes> 
    </div>
    </BrowserRouter>
  );
}

export default App;
