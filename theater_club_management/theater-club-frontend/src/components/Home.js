import React, { useEffect, useState, useContext } from 'react';
import styles from './style.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContext';

const Home = () => {
    const [events, setEvents] = useState([]);
    const { user } = useContext(UserContext);

    useEffect(() => {
        axios.get('http://localhost:3001/api/event')
            .then(response => {
                setEvents(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the events!', error);
            });
    }, []);

    return (
        <div className='home_container'>
            <h1 className='home_title'>THEATER CLUB</h1>
            {user && <p>Hello, {user.admin_name} !</p>}
            {/* <p>Manage all your theater club activities efficiently.</p> */}
            {!user && <Link to="/login" className='button'>Login</Link>}
             <Link to="/events" className='button'>Events</Link>
            {user && <Link to="/account" className="button">My Account</Link>}
        </div>
    );
};

export default Home;
