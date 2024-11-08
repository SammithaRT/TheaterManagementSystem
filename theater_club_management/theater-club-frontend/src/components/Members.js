import React, { useEffect, useState} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import  { useContext } from 'react';
import { UserContext } from '../context/UserContext';

const Members = () => {
    const [members, setMembers] = useState([]);
    const { user } = useContext(UserContext);   
    
    useEffect(() => {
        const fetchMembers = async () => {
          try {
            const response = await axios.get('http://localhost:3001/api/members');
            setMembers(response.data);
          } catch (error) {
            console.error('There was an error fetching the producers!', error);
            alert('An error occurred while fetching producers. Please try again later.');
          }
        };
    
        fetchMembers();
      }, []);

    if (!user) { 
        return ( 
        <div className="container my-4"> 
        <h2>Access Denied</h2> 
        <p>Please <Link to="/login">log in</Link> to view this page.</p> 
        </div> );
    }

    return (
        <div>
            <h1>Members</h1>
            <ul>
                {members.map(member => (
                    <p className = "container" key={member.mem_id}>
                        {member.mem_name} ({member.dept} - {member.sem})
                    </p>
                ))}
            </ul>
            <Link to = "/account" state={{user}} className="button" > Back </Link>
        </div>
    );
};

export default Members;
