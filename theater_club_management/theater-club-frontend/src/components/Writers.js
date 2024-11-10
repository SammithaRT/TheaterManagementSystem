import React, { useEffect, useState} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import  { useContext } from 'react';
import { UserContext } from '../context/UserContext';

const Writer = () => {
    const [data, setData] = useState([]);
    const { user } = useContext(UserContext);
    const [newWriter, setNewWriter] = useState({ writer_id: '', expertise: '' });
    const [editWriter, setEditWriter] = useState(null);

    useEffect(() => {
        const fetchWriters = async () => {
          try {
            const response = await axios.get('http://localhost:3001/api/writer');
            setData(response.data);
          } catch (error) {
            console.error('There was an error fetching the producers!', error);
            alert('An error occurred while fetching producers. Please try again later.');
          }
        };
    
        fetchWriters();
      }, []);

  const updateWriter = async (id, updatedWriter) => {
      try {
        const response = await axios.put(`http://localhost:3001/api/writer/${id}`, updatedWriter);
        console.log('Writer updated:', response.data);
      } catch (error) {
        console.error('Error updating writer:', error);
      }
    };
  
    const addWriter = async (newWriter) => {
      try {
        const response = await axios.post('http://localhost:3001/api/writer', newWriter);
        console.log('Writer added:', response.data);
        alert('Writer added successfully');
        setNewWriter({ writer_id: '', expertise: '' });
        const updatedWriter = await axios.get('http://localhost:3001/api/writer');
        setData(updatedWriter.data);
      } catch (error) {
        console.error('Error adding:', error);
        alert('An error occurred while adding. Please try again.');
      }
    };

    const deleteWriter = async (id) => {
      try {
        await axios.delete(`http://localhost:3001/api/writer/${id}`);
        alert('Writer deleted successfully');
        const updatedWriter = await axios.get('http://localhost:3001/api/writer');
        setData(updatedWriter.data);
      } catch (error) {
        console.error('Error deleting', error);
        alert(`An error occurred while deleting: ${error.response ? error.response.data.message : error.message}`);
      }
    };

    const handleEdit = (data) => {
      setEditWriter({ ...data });
    };
  
    const handleSave = async (id) => {
      await updateWriter(id, editWriter);
      setEditWriter(null);
      alert('Updated successfully');
      const response = await axios.get('http://localhost:3001/api/writer');
      setData(response.data);
    };
  
    const handleNewWriterChange = (e) => {
      setNewWriter({ ...newWriter, [e.target.name]: e.target.value });
    };
  
    const handleNewWriterSubmit = (e) => {
      e.preventDefault();
      addWriter(newWriter);
    };
    if (!user) { 
        return ( 
        <div className="container my-4"> 
        <h2>Access Denied</h2> 
        <p>Please <Link to="/login">log in</Link> to view this page.</p> 
        </div> );
    }

    return (
      <div className="container my-4">
        <h1 className='title'>WRITERS</h1>
        <form onSubmit={handleNewWriterSubmit} className="">
          <input type="text" name="writer_id" placeholder="Writer ID" value={newWriter.writer_id} onChange={handleNewWriterChange} required />
          <input type="text" name="expertise" placeholder="Expertise" value={newWriter.expertise} onChange={handleNewWriterChange} required />
          <button type="submit" className="button">Add Writer</button>
        </form>
        <table className="editTable">
          <thead>
            <tr>
              <th>Writer ID</th>
              <th>Name</th>
              <th>Expertise</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item.writer_id}>
                <td>
                   { item.writer_id}
                </td>
                <td>
                  {item.mem_name}
                </td>
                <td>
                  {editWriter && editWriter.writer_id === item.writer_id ? (
                    <input type="text" value={editWriter.expertise} onChange={(e) => setEditWriter({ ...editWriter, expertise: e.target.value })} />
                  ) : (
                    item.expertise
                  )}
                </td>
                <td>
                  {editWriter && editWriter.writer_id === item.writer_id ? (
                    <button onClick={() => handleSave(item.writer_id)}>Save</button>
                  ) : (
                    <>
                      <button onClick={() => handleEdit(item)}>Edit</button>
                      <button onClick={() => deleteWriter(item.writer_id)}>Delete</button>
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

export default Writer;
