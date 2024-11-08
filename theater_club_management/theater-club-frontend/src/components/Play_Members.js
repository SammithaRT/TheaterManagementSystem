import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import  { useContext } from 'react';

const Play_Members = () => {
  const { playId } = useParams();
  const { eventId } = useParams();
  const [plays, setPlays] = useState([]);
  const { user } = useContext(UserContext);

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
  

  return (
    <div>
      {playId ? (
        plays.length > 0 ? (
          <ul>
           {plays.map((play) => (
  <p key={play.play_id}>{play.mem_name} - {play.role}</p>
  ))}

            </ul>
        ) : (
          <p>No members found for this play.</p>
        )
      ) : (
        <p>Play ID is not available.</p>
      )}
    <Link to = "/" state={{user}} className="button" > Back </Link>

    </div>
  );
};

export default Play_Members;
