import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import axios from 'axios';

const Plays = () => {
  const { eventId } = useParams();
  const [plays, setPlays] = useState([]);
  const [editPlay, setEditPlay] = useState(null);
  const [newPlay, setNewPlay] = useState({ play_id: '', play_name: '', director_id: '', types: '' });
  const [showModal, setShowModal] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [studentSrn, setStudentSrn] = useState('');
  const [studentDept, setStudentDept] = useState('');
  const [studentSem, setStudentSem] = useState('');
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  // Fetch plays when the component mounts or when the eventId changes
  useEffect(() => {
    const fetchPlays = async () => {
      if (eventId) {
        try {
          const response = await axios.get(`http://localhost:3001/api/${eventId}/plays`);
          setPlays(response.data);
        } catch (error) {
          console.error('Error fetching plays:', error);
          alert('An error occurred while fetching plays. Please try again later.');
        }
      }
    };

    fetchPlays();
  }, [eventId]);

  // Handle edit play functionality
  const handleEdit = (play) => {
    setEditPlay({ ...play });
  };

  const handleEditPlayChange = (e) => {
    setEditPlay({ ...editPlay, [e.target.name]: e.target.value });
  };

  const handleSave = async (id) => {
    try {
      await axios.put(`http://localhost:3001/api/plays/${id}`, editPlay);
      alert('Play updated successfully');
      setEditPlay(null);
      const updatedPlays = await axios.get(`http://localhost:3001/api/${eventId}/plays`);
      setPlays(updatedPlays.data);
    } catch (error) {
      console.error('Error updating play:', error);
      alert('An error occurred while updating the play. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/plays/${id}`);
      alert('Play deleted successfully');
      const updatedPlays = await axios.get(`http://localhost:3001/api/${eventId}/plays`);
      setPlays(updatedPlays.data);
    } catch (error) {
      console.error('Error deleting play:', error);
      alert('An error occurred while deleting the play. Please try again.');
    }
  };

  const handleNewPlayChange = (e) => {
    setNewPlay({ ...newPlay, [e.target.name]: e.target.value });
  };

  const handleNewPlaySubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/plays', { ...newPlay, event_id: eventId });
      alert('Play added successfully');
      setNewPlay({ play_id: '', play_name: '', director_id: '', types: '' });
      const updatedPlays = await axios.get(`http://localhost:3001/api/${eventId}/plays`);
      setPlays(updatedPlays.data);
    } catch (error) {
      console.error('Error adding play:', error);
      alert('An error occurred while adding the play. Please try again.');
    }
  };

  // Handle event booking functionality
  const bookEvent = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post(`http://localhost:3001/api/${eventId}/book_event`, {
            user_id: studentSrn,
            event_id: eventId,
            student_name: studentName,
            student_dept: studentDept,
            student_sem: studentSem,
        });

        if (response.status === 200 || response.status === 201 || response.status === 202) {
            alert('Event booked successfully!');
        } else {
            console.error('Failed to book event:', response);
            alert('Failed to book the event. Please try again.');
        }
    } catch (error) {
        console.error('Error booking event:', error);
        if (error.response) {
            console.error('Response data:', error.response.data);
            alert(`Error: ${error.response.data.message || 'An error occurred while booking the event.'}`);
        } else {
            alert('An error occurred while booking the event. Please try again.');
        }
    }
};


  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className='container'>
      <h1 className='title'>PLAYS</h1>

      {/* Admin can add a new play */}
      {user && (
        <form className="styled-form" onSubmit={handleNewPlaySubmit}>
          <input
            type="text"
            name="play_id"
            placeholder="Play ID"
            value={newPlay.play_id}
            onChange={handleNewPlayChange}
            required
          />
          <input
            type="text"
            name="play_name"
            placeholder="Play Name"
            value={newPlay.play_name}
            onChange={handleNewPlayChange}
            required
          />
          <input
            type="number"
            name="director_id"
            placeholder="Director ID"
            value={newPlay.director_id}
            onChange={handleNewPlayChange}
            required
          />
          <input
            type="text"
            name="types"
            placeholder="Type"
            value={newPlay.types}
            onChange={handleNewPlayChange}
            required
          />
          <button type="submit" className="button">Add Play</button>
        </form>
      )}

      {/* Display plays */}
      <ul className="plays-list">
        {plays.length > 0 ? (
          plays.map((play) => (
            <div key={play.play_id} className="play-item">
              {user && editPlay && editPlay.play_id === play.play_id ? (
                <div className="edit-play">
                  <input
                    type="text"
                    name="play_name"
                    value={editPlay.play_name}
                    onChange={handleEditPlayChange}
                    className="input-edit"
                  />
                  <input
                    type="number"
                    name="director_id"
                    value={editPlay.director_id}
                    onChange={handleEditPlayChange}
                    className="input-edit"
                  />
                  <input
                    type="text"
                    name="types"
                    value={editPlay.types}
                    onChange={handleEditPlayChange}
                    className="input-edit"
                  />
                  <button onClick={() => handleSave(play.play_id)} className="button">Save</button>
                  <button onClick={() => setEditPlay(null)} className="button">Cancel</button>
                </div>
              ) : (
                <div className="play-details">
                  <Link to={`/${play.event_id}/${play.play_id}/play_members`} className="button_big">
                    {play.play_name}
                  </Link>
                  <div className="button">
                    <p className="play-type">    Type: {play.types}             </p>
                    {user && <p className="play-director">Director ID: {play.director_id}</p>}
                  </div>
                  {user && (
                    <>
                      <button onClick={() => handleEdit(play)} className="button">Edit</button>
                      <button onClick={() => handleDelete(play.play_id)} className="button">Delete</button>
                    </>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No plays found for this event.</p>
        )}
      </ul>

      {/* Book Event Modal */}
      <div>
        <button onClick={() => setShowModal(true)} className='button'>
            Book Event
        </button>
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={() => setShowModal(false)}>&times;</span>
              <h2>Enter Student Details</h2>
              <form onSubmit={bookEvent}>
                <label>
                  Name:
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    required
                    className="input-field"
                  />
                </label>
                <label>
                  SRN:
                  <input
                    type="text"
                    value={studentSrn}
                    onChange={(e) => setStudentSrn(e.target.value)}
                    required
                    className="input-field"
                  />
                </label>
                <label>
                  Department:
                  <input
                    type="text"
                    value={studentDept}
                    onChange={(e) => setStudentDept(e.target.value)}
                    required
                    className="input-field"
                  />
                </label>
                <label>
                  Semester:
                  <input
                    type="text"
                    value={studentSem}
                    onChange={(e) => setStudentSem(e.target.value)}
                    required
                    className="input-field"
                  />
                </label>
                <button type="submit" className="button">
                  Submit
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      <button onClick={handleGoBack} className="button_back">Back</button>
    </div>
  );
};

export default Plays;
