import React, { useEffect, useState, useContext } from 'react';
import styles from './style.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContext';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [editEvent, setEditEvent] = useState(null);
    const [newEvent, setNewEvent] = useState({ event_id: '', event_name: '', types: '', org_team:''});
    const { user } = useContext(UserContext);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/event');
                const sortedEvents = response.data.sort((a, b) => b.event_id - a.event_id); // Sort by event_id descending
                setEvents(sortedEvents);
            } catch (error) {
                console.error('There was an error fetching the events!', error);
            }
        };
        fetchEvents();
    }, []);

    const handleEdit = (event) => {
        setEditEvent({ ...event });
    };

    const handleSave = async (id) => {
        try {
            const response = await axios.put(`http://localhost:3001/api/events/${id}`, editEvent);
            console.log('Event updated:', response.data);
            alert('Event updated successfully');
            setEditEvent(null);
            const updatedEvents = await axios.get('http://localhost:3001/api/event');
            const sortedEvents = updatedEvents.data.sort((a, b) => b.event_id - a.event_id);
            setEvents(sortedEvents);
        } catch (error) {
            console.error('Error updating event:', error);
            alert('An error occurred while updating the event. Please try again.');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/api/events/${id}`);
            alert('Event deleted successfully');
            const updatedEvents = await axios.get('http://localhost:3001/api/event');
            const sortedEvents = updatedEvents.data.sort((a, b) => b.event_id - a.event_id);
            setEvents(sortedEvents);
        } catch (error) {
            console.error('Error deleting event:', error);
            alert('An error occurred while deleting the event. Please try again.');
        }
    };

    const handleNewEventChange = (e) => {
        setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
    };

    const handleEditEventChange = (e) => {
        setEditEvent({ ...editEvent, [e.target.name]: e.target.value });
    };

    const handleNewEventSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/api/events', newEvent);
            console.log('Event added:', response.data);
            alert('Event added successfully');
            setNewEvent({ event_id: '', event_name: '', types: '', org_team:'' });
            const updatedEvents = await axios.get('http://localhost:3001/api/event');
            const sortedEvents = updatedEvents.data.sort((a, b) => b.event_id - a.event_id);
            setEvents(sortedEvents);
        } catch (error) {
            console.error('Error adding event:', error);
            alert('An error occurred while adding the event. Please try again.');
        }
    };

    return (
        <div className='container'>
            <h1 className='title'>EVENTS</h1>
            {user && <form onSubmit={handleNewEventSubmit}>
                <input type="text" name="event_id" placeholder="Event ID" value={newEvent.event_id} onChange={handleNewEventChange} required />
                <input type="text" name="event_name" placeholder="Event Name" value={newEvent.event_name} onChange={handleNewEventChange} required />
                <input type="text" name="types" placeholder="Type" value={newEvent.types} onChange={handleNewEventChange} required />
                <input type="text" name="org_team" placeholder="Organization Team" value={newEvent.org_team} onChange={handleNewEventChange} required />
                <button type="submit" className="button">Add Event</button>
            </form>}
            <ul>
                {events.map(item => (
                    <div key={item.event_id}>
                        {user && editEvent && editEvent.event_id === item.event_id ? (
                            <div>
                                <input type="text" name="event_name" value={editEvent.event_name} onChange={handleEditEventChange} />
                                <input type="text" name="types" value={editEvent.types} onChange={handleEditEventChange} />
                                <input type="text" name="org_team" value={editEvent.org_team} onChange={handleEditEventChange} />
                                <button onClick={() => handleSave(item.event_id)} className="button">Save</button>
                                <button onClick={() => setEditEvent(null)} className="button">Cancel</button>

                            </div>
                        ) : (
                            <div className="play-members">
                                <Link to={`/${item.event_id}/plays`} className='button_big'>
                                    {item.event_name}
                                </Link>
                               {user && <div className='button'>
                                <p>Type: {item.types}</p>
                                <p>Organization Team ID: {item.org_team}</p>
                                </div>}
                                <p></p>
                                {user && <button onClick={() => handleEdit(item)} className="button">Edit</button>}
                                {user && <button onClick={() => handleDelete(item.event_id)} className="button">Delete</button>}
                            </div>
                        )}
                    </div>
                ))}
            </ul>
            <Link to="/" state={{ user }} className="button_back">Back</Link>
        </div>
    );
};

export default Events;