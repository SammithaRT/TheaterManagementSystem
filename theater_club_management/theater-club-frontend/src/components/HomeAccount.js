import React from 'react';
import styles from './style.css';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import  { useContext } from 'react';
import { UserContext } from '../context/UserContext';

const HomeAccount = () => {
    const [events, setEvents] = useState([]);
    const { user } = useContext(UserContext);

    useEffect(() => {
        axios.get('http://localhost:3001/api/event')
            .then(response => {
                setEvents(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the members!', error);
            });
    }, []);


    if (!user) { 
        return ( 
        <div className="container my-4"> 
        <h2 className='title'>Access Denied</h2> 
        <p>Please <Link to="/login">log in</Link> to view this page.</p> 
        </div> );
    }


    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Welcome to the Theater Club Management System Home Page, {user.admin_name}</h2>
            <p>Manage all your theater club activities efficiently.</p>
            <Link to="/login" className={styles.button}>Go to Login</Link>
            <h1>Plays</h1>
            <ul>
                {events.map(item => (
                    <li key={item.event_id}>
                        {item.event_name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default HomeAccount;
