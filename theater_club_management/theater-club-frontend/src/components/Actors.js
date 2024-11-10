import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import './style.css'; // Import your CSS file here

const Actors = () => {
  const [actors, setActors] = useState([]);
  const [editActor, setEditActor] = useState(null);
  const [newActor, setNewActor] = useState({ actor_id: '', expertise: '' });
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchActors = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/actor');
        setActors(response.data);
      } catch (error) {
        console.error('There was an error fetching the actors!', error);
        alert('An error occurred while fetching actors. Please try again later.');
      }
    };

    fetchActors();
  }, []);

  const updateActor = async (id, updatedActor) => {
    try {
      const response = await axios.put(`http://localhost:3001/api/actor/${id}`, updatedActor);
      console.log('Actor updated:', response.data);
    } catch (error) {
      console.error('Error updating actor:', error);
    }
  };

  const addActor = async (newActor) => {
    try {
      const response = await axios.post('http://localhost:3001/api/actor', newActor);
      console.log('Actor added:', response.data);
      alert('Actor added successfully');
      setNewActor({ actor_id: '', expertise: '' });
      const updatedActors = await axios.get('http://localhost:3001/api/actor');
      setActors(updatedActors.data);
    } catch (error) {
      console.error('Error adding actor:', error);
      alert('An error occurred while adding the actor. Please try again.');
    }
  };

  const deleteActor = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/actor/${id}`);
      alert('Actor deleted successfully');
      const updatedActors = await axios.get('http://localhost:3001/api/actor');
      setActors(updatedActors.data);
    } catch (error) {
      console.error('Error deleting actor:', error);
      alert(`An error occurred while deleting the actor: ${error.response ? error.response.data.message : error.message}`);
    }
  };

  const handleEdit = (actor) => {
    setEditActor({ ...actor });
  };

  const handleSave = async (id) => {
    await updateActor(id, editActor);
    setEditActor(null);
    alert('Actor updated successfully');
    const response = await axios.get('http://localhost:3001/api/actor');
    setActors(response.data);
  };

  const handleNewActorChange = (e) => {
    setNewActor({ ...newActor, [e.target.name]: e.target.value });
  };

  const handleNewActorSubmit = (e) => {
    e.preventDefault();
    addActor(newActor);
  };

  if (!user) {
    return (
      <div className="container my-4">
        <h2>Access Denied</h2>
        <p>Please <Link to="/login">log in</Link> to view this page.</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className='title'>ACTORS</h1>
      <form onSubmit={handleNewActorSubmit} className="">
        <input type="text" name="actor_id" placeholder="Actor ID" value={newActor.actor_id} onChange={handleNewActorChange} required />
        {/* <input type="text" name="mem_name" placeholder="Member Name" value={newActor.mem_name} onChange={handleNewActorChange} required /> */}
        <input type="text" name="expertise" placeholder="Expertise" value={newActor.expertise} onChange={handleNewActorChange} required />
        <button type="submit" className="button">Add Actor</button>
      </form>
      <table className="editTable">
        <thead>
          <tr>
            <th>Actor ID</th>
            <th>Name</th>
            <th>Expertise</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {actors.map(actor => (
            <tr key={actor.actor_id}>
              <td>
                 { actor.actor_id}
              </td>
              <td>
                {actor.mem_name}
              </td>
              <td>
                {editActor && editActor.actor_id === actor.actor_id ? (
                  <input type="text" value={editActor.expertise} onChange={(e) => setEditActor({ ...editActor, expertise: e.target.value })} />
                ) : (
                  actor.expertise
                )}
              </td>
              <td>
                {editActor && editActor.actor_id === actor.actor_id ? (
                  <button onClick={() => handleSave(actor.actor_id)}>Save</button>
                ) : (
                  <>
                    <button onClick={() => handleEdit(actor)}>Edit</button>
                    <button onClick={() => deleteActor(actor.actor_id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to="/account" state={{ user }} className="button_back">Back</Link>
    </div>
  );
};

export default Actors;
