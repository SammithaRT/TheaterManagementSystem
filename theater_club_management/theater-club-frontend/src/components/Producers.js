import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const Producers = () => {
  const [producers, setProducers] = useState([]);
  const [newProducer, setNewProducer] = useState({ prod_id: '', domain: '' });
  const [editProducer, setEditProducer] = useState(null);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchProducers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/producer');
        setProducers(response.data);
      } catch (error) {
        console.error('There was an error fetching the producers!', error);
        alert('An error occurred while fetching producers. Please try again later.');
      }
    };

    fetchProducers();
  }, []);

  const updateProducer = async (id, updatedProducer) => {
    try {
      const response = await axios.put(`http://localhost:3001/api/producer/${id}`, updatedProducer);
      console.log('Producer updated:', response.data);
    } catch (error) {
      console.error('Error updating producer:', error);
    }
  };

  const addProducer = async (newProducer) => {
    try {
      const response = await axios.post('http://localhost:3001/api/producer', newProducer);
      console.log('Producer added:', response.data);
      alert('Producer added successfully');
      setNewProducer({ prod_id: '', domain: '' });
      const updatedProducers = await axios.get('http://localhost:3001/api/producer');
      setProducers(updatedProducers.data);
    } catch (error) {
      console.error('Error adding producer:', error);
      alert('An error occurred while adding the producer. Please try again.');
    }
  };

  const deleteProducer = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/producer/${id}`);
      alert('Producer deleted successfully');
      const updatedProducers = await axios.get('http://localhost:3001/api/producer');
      setProducers(updatedProducers.data);
    } catch (error) {
      console.error('Error deleting producer:', error);
      alert(`An error occurred while deleting the producer: ${error.response ? error.response.data.message : error.message}`);
    }
  };

  const handleEdit = (producer) => {
    setEditProducer({ ...producer });
  };

  const handleSave = async (id) => {
    await updateProducer(id, editProducer);
    setEditProducer(null);
    alert('Producer updated successfully');
    const response = await axios.get('http://localhost:3001/api/producer');
    setProducers(response.data);
  };

  const handleNewProducerChange = (e) => {
    setNewProducer({ ...newProducer, [e.target.name]: e.target.value });
  };

  const handleNewProducerSubmit = (e) => {
    e.preventDefault();
    addProducer(newProducer);
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
    <div className="container my-4">
      <h1 className='title'>PRODUCERS</h1>
      <form onSubmit={handleNewProducerSubmit} className="">
        <input type="text" name="prod_id" placeholder="Producer ID" value={newProducer.prod_id} onChange={handleNewProducerChange} required />
        <input type="text" name="domain" placeholder="Domain" value={newProducer.domain} onChange={handleNewProducerChange} required />
        <button type="submit" className="button">Add Producer</button>
      </form>
      <table className="editTable">
        <thead>
          <tr>
            <th>Producer ID</th>
            <th>Name</th>
            <th>Domain</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {producers.map(producer => (
            <tr key={producer.prod_id}>
              <td>
                {producer.prod_id}
              </td>
              <td>
                {producer.mem_name}
              </td>
              <td>
                {editProducer && editProducer.prod_id === producer.prod_id ? (
                  <input type="text" value={editProducer.domain} onChange={(e) => setEditProducer({ ...editProducer, domain: e.target.value })} />
                ) : (
                  producer.domain
                )}
              </td>
              <td>
                {editProducer && editProducer.prod_id === producer.prod_id ? (
                  <button onClick={() => handleSave(producer.prod_id)}>Save</button>
                ) : (
                  <>
                    <button onClick={() => handleEdit(producer)}>Edit</button>
                    <button onClick={() => deleteProducer(producer.prod_id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to="/account" state={{ user }} className="button">Back</Link>
    </div>
  );
};

export default Producers;
