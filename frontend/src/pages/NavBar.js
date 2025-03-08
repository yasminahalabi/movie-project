import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <nav style={styles.navbar}>
      <ul style={styles.navList}>
        <li style={styles.navItem}>
          <Link to="/" style={styles.navLink}>Home</Link>
        </li>
        <li style={styles.navItem}>
          <Link to="/add-movie" style={styles.navLink}>Add Movie</Link>
        </li>
        <li style={styles.navItem}>
          <Link to="/list" style={styles.navLink}>Movies</Link>
        </li>
        <li style={styles.navItem}>
          <Link to="/genres" style={styles.navLink}>Genres</Link>
        </li>
        <li style={styles.navItem}>
          <Link to="/genres/add" style={styles.navLink}>Add Genre</Link> 
        </li>
      </ul>
    </nav>
  );
};

const styles = {
  navbar: {
    backgroundColor: '#333',
    padding: '10px 20px',
  },
  navList: {
    display: 'flex',
    listStyleType: 'none',
    justifyContent: 'center',
    margin: 0,
    padding: 0,
  },
  navItem: {
    margin: '0 20px',
  },
  navLink: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '18px',
  },
};

export default NavBar;
