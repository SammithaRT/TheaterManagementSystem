import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import './style.css'; // Import your CSS file here

const Members = () => {
  const [members, setMembers] = useState([]);
  const [editMember, setEditMember] = useState(null);
  const [newMember, setNewMember] = useState({ mem_id: '', mem_name: '', dept: '', sem: '', dob: '', date_of_entry: '', profile_picture: null });
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/members');
        setMembers(response.data);
      } catch (error) {
        console.error('There was an error fetching the members!', error);
        alert('An error occurred while fetching members. Please try again later.');
      }
    };
    fetchMembers();
  }, []);

  const updateMember = async (id, updatedMember) => {
    try {
      const formData = new FormData();
      formData.append('mem_name', updatedMember.mem_name);
      formData.append('dept', updatedMember.dept);
      formData.append('sem', updatedMember.sem);
      formData.append('dob', updatedMember.dob);
      formData.append('date_of_entry', updatedMember.date_of_entry);
      if (updatedMember.profile_picture) {
        formData.append('profile_picture', updatedMember.profile_picture);
      }

      const response = await axios.put(`http://localhost:3001/api/members/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Member updated:', response.data);
    } catch (error) {
      console.error('Error updating member:', error);
    }
  };

  const addMember = async (formData) => {
    try {
      const response = await axios.post('http://localhost:3001/api/members', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Member added:', response.data);
      alert('Member added successfully');
      setNewMember({ mem_id: '', mem_name: '', dept: '', sem: '', dob: '', date_of_entry: '', profile_picture: null });
      const updatedMembers = await axios.get('http://localhost:3001/api/members');
      setMembers(updatedMembers.data);
    } catch (error) {
      console.error('Error adding member:', error);
      alert('An error occurred while adding the member. Please try again.');
    }
  };

  const deleteMember = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/members/${id}`);
      alert('Member deleted successfully');
      const updatedMembers = await axios.get('http://localhost:3001/api/members');
      setMembers(updatedMembers.data);
    } catch (error) {
      console.error('Error deleting member:', error);
      alert(`An error occurred while deleting the member: ${error.response ? error.response.data.message : error.message}`);
    }
  };

  const handleEdit = (member) => {
    setEditMember({ ...member });
  };

  const handleSave = async (id) => {
    await updateMember(id, editMember);
    setEditMember(null);
    alert('Member updated successfully');
    const response = await axios.get('http://localhost:3001/api/members');
    setMembers(response.data);
  };

  const handleNewMemberChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profile_picture') {
      setNewMember({ ...newMember, profile_picture: files[0] });
    } else {
      setNewMember({ ...newMember, [name]: value });
    }
  };
  
  const handleNewMemberSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('mem_id', newMember.mem_id);
    formData.append('mem_name', newMember.mem_name);
    formData.append('dept', newMember.dept);
    formData.append('sem', newMember.sem);
    formData.append('dob', newMember.dob);
    formData.append('date_of_entry', newMember.date_of_entry);
    if (newMember.profile_picture) {
      formData.append('profile_picture', newMember.profile_picture);
    }
    addMember(formData);
  };
  

  if (!user) {
    return (
      <div className="container">
        <h2>Access Denied</h2>
        <p>Please <Link to="/login">log in</Link> to view this page.</p>
      </div>
    );
  }

  return (
    <div className="container">
      <Link to="/account" state={{ user }} className="button_back">Back</Link>
      <h1 className='title'>MEMBERS</h1>
      <form onSubmit={handleNewMemberSubmit} className="addMemberForm">
        <input type="text" name="mem_id" placeholder="Member ID" value={newMember.mem_id} onChange={handleNewMemberChange} required />
        <input type="text" name="mem_name" placeholder="Member Name" value={newMember.mem_name} onChange={handleNewMemberChange} required />
        <input type="text" name="dept" placeholder="Department" value={newMember.dept} onChange={handleNewMemberChange} required />
        <input type="text" name="sem" placeholder="Semester" value={newMember.sem} onChange={handleNewMemberChange} required />
        <input type="date" name="dob" placeholder="Date of Birth" value={newMember.dob} onChange={handleNewMemberChange} required />
        <input type="date" name="date_of_entry" placeholder="Date of Entry" value={newMember.date_of_entry} onChange={handleNewMemberChange} required />
        <input type="file" name="profile_picture" onChange={handleNewMemberChange} />
        <button type="submit" className="button">Add Member</button>
      </form>
      <table className="editTable">
        <thead>
          <tr>
            <th>Member ID</th>
            <th>Profile Picture</th>
            <th>Member Name</th>
            <th>Department</th>
            <th>Semester</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {members.map(member => (
            <tr key={member.mem_id}>
              <td>{member.mem_id}</td>
              <td>
                <img src={`/${member.profile_picture}`} alt={member.mem_name} className="profile-picture" />
              </td>
              <td>
                {editMember && editMember.mem_id === member.mem_id ? (
                  <input type="text" value={editMember.mem_name} onChange={(e) => setEditMember({ ...editMember, mem_name: e.target.value })} />
                ) : (
                  member.mem_name
                )}
              </td>
              <td>
                {editMember && editMember.mem_id === member.mem_id ? (
                  <input type="text" value={editMember.dept} onChange={(e) => setEditMember({ ...editMember, dept: e.target.value })} />
                ) : (
                  member.dept
                )}
              </td>
              <td>
                {editMember && editMember.mem_id === member.mem_id ? (
                  <input type="text" value={editMember.sem} onChange={(e) => setEditMember({ ...editMember, sem: e.target.value })} />
                ) : (
                  member.sem
                )}
              </td>
              <td>
                {editMember && editMember.mem_id === member.mem_id ? (
                  <div>
                    <button onClick={() => handleSave(member.mem_id)} className="button">Save</button>
                    <button onClick={() => setEditMember(null)} className="button">Cancel</button>
                  </div>
                ) : (
                  <>
                    <button onClick={() => handleEdit(member)} className='button'>Edit</button>
                    <button onClick={() => deleteMember(member.mem_id)} className='button'>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Members;
