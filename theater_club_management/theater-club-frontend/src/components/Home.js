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
        <div className='container'>
            <h2 className='title'>Welcome to the Theater Club Management System</h2>
            {user && <p>Hello, {user.admin_name}</p>}
            <p>Manage all your theater club activities efficiently.</p>
            {!user && <Link to="/login" className='go_to_account'>Go to Login</Link>}
            {user && <Link to="/account" className="go_to_account">My Account</Link>}
            <h1 className='title'>EVENTS</h1>
            <ul>
                {events.map(item => (
                    <p1 className="container" key={item.event_id}>
                        <Link to={`/${item.event_id}/plays`} className = 'button_big'>
                            {item.event_name}
                        </Link> 
                    </p1>
                ))}
            </ul>
        </div>
    );
};

export default Home;
