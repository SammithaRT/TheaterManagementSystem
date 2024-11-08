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
        <div className={styles.container}>
            <h2 className={styles.title}>Welcome to the Theater Club Management System</h2>
            {user && <p>Hello, {user.admin_name}</p>}
            <p>Manage all your theater club activities efficiently.</p>
            {!user && <Link to="/login" className='button'>Go to Login</Link>}
            {user && <Link to="/account" className="button">Go to my account</Link>}
            <h1>Events</h1>
            <ul>
                {events.map(item => (
                    <p className="container" key={item.event_id}>
                        <Link to={`/${item.event_id}/plays`} className = 'button'>
                            {item.event_name}
                        </Link> 
                    </p>
                ))}
            </ul>
        </div>
    );
};

export default Home;
