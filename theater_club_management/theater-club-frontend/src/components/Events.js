import React, { useEffect, useState, useContext } from 'react';
import styles from './style.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContext';

const Events = () => {
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
            <Link to = "/" state={{user}} className="button_back" > Back </Link>
        </div>
    );
};

export default Events;

