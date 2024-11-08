import React, { useEffect, useState} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import  { useContext } from 'react';
import { UserContext } from '../context/UserContext';

const Producers = () => {
    const [prod, setProducers] = useState([]);
    const { user } = useContext(UserContext);

    useEffect(() => {
        const fetchProducers = async () => {
          try {
            const response = await axios.get('http://localhost:3001/api/producers');
            setProducers(response.data);
          } catch (error) {
            console.error('There was an error fetching the producers!', error);
            alert('An error occurred while fetching producers. Please try again later.');
          }
        };
    
        fetchProducers();
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
            <h1>Producers</h1>
            <ul>
                {prod.map(item => (
                    <p className = "container" key={item.prod_id}>
                        {item.mem_name} ({item.domain})
                    </p>
                ))}
            </ul>
            <Link to = "/account" state={{user}} className="button" > Back </Link>
        </div>
    );
};

export default Producers;
