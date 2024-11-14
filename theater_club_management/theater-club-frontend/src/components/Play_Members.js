import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import  { useContext } from 'react';

const Play_Members = () => {
  const { playId } = useParams();
  const { eventId } = useParams();
  const [plays, setPlays] = useState([]);
  const [editPM, setEditPM] = useState(null);
  const [newPM, setNewPM] = useState({ play_id: '', play_name: '', director_id: '', types: ''});
  const { user } = useContext(UserContext);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchPlayMem = async () => {
      if (playId && eventId) {
        try {
          console.log(`Fetching plays for event ID: ${eventId}, play ID: ${playId}`);
          const response = await fetch(`http://localhost:3001/api/${eventId}/${playId}/play_members`);
  
          if (!response.ok) {
            if (response.status === 404) {
              console.error("Plays not found for this event");
              alert("Plays not found for this event");
            } else {
              console.error(`HTTP error! Status: ${response.status}`);
              alert(`Error: ${response.status}`);
            }
            return;
          }
  
          const contentType = response.headers.get("content-type");
          if (!contentType || !contentType.includes("application/json")) {
            throw new TypeError("Expected JSON response");
          }
  
          const data = await response.json();
          console.log('Fetched plays data:', data);
          setPlays(data);
        } catch (error) {
          console.error("Error fetching plays:", error);
          alert("An error occurred while fetching plays. Please try again later.");
        }
      }
    };
  
    fetchPlayMem();
  }, [playId, eventId]); // Combine the dependencies
  
  const handleGoBack = () => {
    navigate(-1);
  };


  return (
    <div className="play-members">
      {playId ? (
        plays.length > 0 ? (
          <ul className='styled-list'>
           {plays.map((play) => (
              <div className="play-member" key={play.play_id}>
                {/* <img src={`../${play.profile_picture}`} alt={play.mem_name} className="profile-picture" />                 */}
                <img src={`/${play.profile_picture}`} alt={play.mem_name} className="profile-picture" />
                <p className='mem-name'>{play.mem_name}</p>
                <p className='role'>{play.role}</p>
              </div>
            ))}
          </ul>
        ) : (
          <p>No members found for this play.</p>
        )
      ) : (
        <p>Play ID is not available.</p>
      )}
      <button onClick={handleGoBack} className="button_back">Back</button>
    </div>
  );
};

export default Play_Members;