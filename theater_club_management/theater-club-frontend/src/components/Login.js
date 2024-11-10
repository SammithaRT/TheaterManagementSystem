import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { Link } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post('http://localhost:3001/api/login', { username, password })
            .then(response => {
                if (response.data.success) {
                    setUser(response.data.user);
                    setMessage('Login successful!');
                    navigate('/account');
                } else {
                    setMessage('Invalid credentials');
                }
            })
            .catch(error => {
                setMessage('Login failed. Please try again.');
                console.error('There was an error!', error);
            });
    };

    return (
        <div className="container my-4">
            <h2 className='title'>Login</h2>
            <form onSubmit={handleSubmit} className='form'>
                <div className="form-group">
                    <label>Username:  </label>
                    <input 
                        type="text" 
                        className="form-control"
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                    />
                    <p></p>
                </div>
                <div className="form-group">
                    <label>Password:  </label>
                    <input 
                        type="password" 
                        className="form-control"
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                </div>
                <p></p>
                <button type="submit" className="button">Login</button>
            </form>
            {message && <p className="mt-3">{message}</p>}
            <Link to = "/" className="button_back" > Back </Link>
        </div>
    );
};

export default Login;
