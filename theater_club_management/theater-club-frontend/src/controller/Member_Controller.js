// import React, { useEffect, useState} from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';
// import  { useContext } from 'react';
// import { UserContext } from '../context/UserContext';

// const MemberController = () => {
//     const [members, setMembers] = useState([]);
//     const { user } = useContext(UserContext);   
    
//     useEffect(() => {
//         const fetchMembers = async () => {
//           try {
//             const response = await axios.get('http://localhost:3001/api/members');
//             setMembers(response.data);
//           } catch (error) {
//             console.error('There was an error fetching the producers!', error);
//             alert('An error occurred while fetching producers. Please try again later.');
//           }
// })
// };

// export default MemberController;
