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
          <Link to="/list" style={styles.navLink}>Movies</Link>
        </li>
        <li style={styles.navItem}>
          <Link to="/add-movie" style={styles.navLink}>Add Movie</Link>
        </li>
        <li style={styles.navItem}>
          <Link to="/genres" style={styles.navLink}>Genres</Link>
        </li>
        <li style={styles.navItem}>
          <Link to="/genres/add" style={styles.navLink}>Add Genre</Link> 
        </li>
        <li style={styles.navItem}>
          <Link to="/favorite" style={styles.navLink}>Favorites</Link> 
        </li>
      </ul>
    </nav>
  );
};

const styles = {
  navbar: {
    backgroundColor: '#1a1a2e',
    padding: '15px 0',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    width: '100%'
  },
  navList: {
    display: 'flex',
    listStyleType: 'none',
    justifyContent: 'center',
    margin: 0,
    padding: 0,
  },
  navItem: {
    margin: '0 15px',
  },
  navLink: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '17px',
    padding: '10px 15px',
    borderRadius: '5px',
    fontWeight: '500',
    letterSpacing: '0.5px',
    transition: 'background-color 0.3s, color 0.3s',
    display: 'block',
  }
};

export default NavBar;