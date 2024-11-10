import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import  { useContext } from 'react';
import { UserContext } from '../context/UserContext';

const UserAccount = () => {
    const { user } = useContext(UserContext);
    const [members, setMembers] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3001/api/members')
            .then(response => {
                setMembers(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the members!', error);
            });
    }, []);
    // Redirect to login if user is not defined
    if (!user) { 
        return ( 
        <div className="container my-4"> 
        <h2>Access Denied</h2> 
        <p>Please <Link to="/login">log in</Link> to view this page.</p> 
        </div> );
    }

    return (
        <div className="container">
            <h2 className='title'>Welcome, {user.admin_name}</h2>
            {/* <p>Account details here...</p> */}
            <table align='center'>
                <tr> <Link to = "/members" className="button_big"> MEMBERS </Link> </tr>
               <tr> <Link to = "/writers" className="button_big"> WRITERS </Link> </tr>
               <tr> <Link to = "/actor" className="button_big"> ACTORS </Link> </tr>
               <tr> <Link to = "/producers" className="button_big"> PRODUCERS </Link> </tr>
            </table>
            <p><Link to="/" type = "button" className="go_to_account"> Home </Link></p>

        </div>
    );
};

export default UserAccount;
