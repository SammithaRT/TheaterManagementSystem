const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const directory = 'public/profile_pictures/';


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/profile_pictures', express.static(path.join(__dirname, 'public/profile_pictures')));

if (!fs.existsSync(directory)) {
   fs.mkdirSync(
    directory, { recursive: true }); 
  }

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/profile_pictures/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'Theater_Club_Management'
});
const port= 3001;

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database.');
});


// Middleware to parse JSON
app.use(express.json());

// Route to fetch all members
app.get('/api/members', (req, res) => {
    db.query('SELECT * FROM members', (error, results) => {
        if (error) {
            console.error('Database query error: ' + error);
            res.status(500).send('Server error');
            return;
        }
        res.send(results);
    });
});
app.use(express.json());

app.get('/api/members/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM members WHERE mem_id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error fetching member details:', err);
      res.status(500).json({ error: 'Error fetching member details.' });
    } else {
      res.json(results[0]);
    }
  });
});

app.get('/api/writer', (req, res) => {
    db.query('SELECT * FROM writer a join members m on a.writer_id = m.mem_id', (error, results) => {
        if (error) {
            console.error('Database query error: ' + error);
            res.status(500).send('Server error');
            return;
        }
        res.send(results);
    });
});


app.get('/api/actor', (req, res) => {
    db.query('SELECT * FROM actor a join members m on a.actor_id = m.mem_id', (error, results) => {
        if (error) {
            console.error('Database query error: ' + error);
            res.status(500).send('Server error');
            return;
        }
        res.send(results);
    });
});

app.get('/api/producer', (req, res) => {
    db.query('SELECT * FROM producer a join members m on a.prod_id = m.mem_id', (error, results) => {
        if (error) {
            console.error('Database query error: ' + error);
            res.status(500).send('Server error');
            return;
        }
        res.send(results);
    });
});

app.get('/api/:eventId/plays', (req, res) => {
  const eventId = req.params.eventId;
  console.log(`Received request for event ID: ${eventId}`);
  const query = `SELECT * FROM play WHERE event_id = ?`;
  db.query('SELECT * FROM play WHERE event_id = ?', [eventId], (err, results) => {
      if (err) {
          console.error('Error executing query:', err);
          return res.status(500).send('Server error');
      }
      console.log('Query results:', results);
      res.json(results);  // Always ensure this sends JSON
  });
});

app.get('/api/:eventId/:playId/play_members', (req, res) => {
    const playId = req.params.playId;
    const eventId = req.params.eventId;
    const query = `
       SELECT 
    p.play_name, 
    m.mem_name,
    p.play_id,
    MAX(m.profile_picture) as profile_picture, -- Use MAX or any other aggregate function
    CASE
        WHEN w.writer_id IS NOT NULL THEN 'Writer'
        WHEN a.actor_id IS NOT NULL THEN 'Actor'
        WHEN pr.prod_id IS NOT NULL THEN 'Producer'
        ELSE 'Unknown'
    END AS role
    FROM 
        play_members pm
    JOIN 
        play p ON pm.play_id = p.play_id
    JOIN 
        members m ON m.mem_id = pm.mem_id
    LEFT JOIN 
        writer w ON m.mem_id = w.writer_id
    LEFT JOIN 
        actor a ON m.mem_id = a.actor_id
    LEFT JOIN 
        producer pr ON m.mem_id = pr.prod_id
    WHERE 
        p.play_id = ?
    GROUP BY 
        p.play_name, m.mem_name, p.play_id, w.writer_id, a.actor_id, pr.prod_id
    ORDER BY 
        role;
    `;
  
    db.query(query, [playId, eventId], (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).send('Server error');
      }
      res.json(results);
    });
  });


app.get('/api/event', (req, res) => {
  db.query('SELECT * FROM event', (error, results) => {
      if (error) {
          console.error('Database query error: ' + error);
          res.status(500).send('Server error');
          return;
      }
      res.send(results);
  });
});

app.post('/api/login', (req, res) => { 
    const { username, password } = req.body; 
    const query = 'SELECT * FROM admins WHERE admin_name = ? AND password = ?'; 
    db.query(query, [username, password], (error, results) => {
        if (error) { 
            console.error('Database query error: ' + error); 
            res.status(500).send('Server error'); 
            return; 
        } 
        if (results.length > 0) { 
            console.log('Login successful');
             const user = results[0]; 
             res.json({ success: true, message: 'Login successful!', user });
             } 
            else { console.log('Invalid credentials'); 
                res.status(401).json({ success: false, message: 'Invalid credentials' });
         } 
        });
});


// app.post('/api/members', (req, res) => {
//   const { mem_id, mem_name, dept, sem, dob, date_of_entry} = req.body;
//   const query = `INSERT INTO members (mem_id, mem_name, dept, sem, dob, date_of_entry) VALUES (?, ?, ?, ?, ?, ?)`;
//   db.query(query, [mem_id, mem_name, dept, sem, dob, date_of_entry], (error, results) => {
//       if (error) {
//           console.error('Error adding member:', error);
//           return res.status(500).send(error);
//       }
//       res.status(201).send({ id: results.insertId, ...req.body });
//   });
// });
app.post('/api/members', upload.single('profile_picture'), (req, res) => {
  const { mem_id, mem_name, dept, sem, dob, date_of_entry } = req.body;
  const profile_picture = req.file ? `profile_pictures/${req.file.filename}` : 'profile_pictures/default.png';
  const query = 'INSERT INTO members (mem_id, mem_name, dept, sem, dob, date_of_entry, profile_picture) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [mem_id, mem_name, dept, sem, dob, date_of_entry, profile_picture], (err, results) => {
    if (err) {
      console.error('Error adding member:', err);
      res.status(500).json({ error: 'Error adding member.' });
    } else {
      res.json({ message: 'Member added successfully.', memberId: results.insertId });
    }
  });
});
app.post('/api/actor', (req, res) => {
  const { actor_id, expertise } = req.body;
  const addActorQuery = 'INSERT INTO actor (actor_id, expertise) VALUES (?, ?)';

  db.query(addActorQuery, [actor_id, expertise], (err, results) => {
    if (err) {
      console.error('Error adding actor:', err);
      return res.status(500).json({ message: 'An error occurred while adding the actor', error: err.message });
    }
    return res.status(201).json({ message: 'Actor added successfully', actor: { actor_id, expertise } });
  });
})

app.post('/api/writer', (req, res) => {
  const { writer_id, expertise } = req.body;
  const addWriterQuery = 'INSERT INTO writer (writer_id , expertise) VALUES (?, ?)';

  db.query(addWriterQuery, [writer_id, expertise], (err, results) => {
    if (err) {
      console.error('Error adding writer:', err);
      return res.status(500).json({ message: 'An error occurred while adding the writer', error: err.message });
    }
    return res.status(201).json({ message: 'Writer added successfully', writer: { writer_id, expertise } });
  });
})

app.post('/api/producer', (req, res) => {
  const { prod_id, domain } = req.body;
  const addProdQuery = 'INSERT INTO producer (prod_id , domain) VALUES (?, ?)';

  db.query(addProdQuery, [prod_id, domain], (err, results) => {
    if (err) {
      console.error('Error adding producers:', err);
      return res.status(500).json({ message: 'An error occurred while adding the producers', error: err.message });
    }
    return res.status(201).json({ message: 'Writer added successfully', writer: { prod_id, domain } });
  });
})



app.post('/api/events', (req, res) => {
  const { event_id, event_name, types, org_team } = req.body;
  const addEventQuery = 'INSERT INTO event (event_id, event_name, types, org_team) VALUES (?, ?, ?, ?)';

  db.query(addEventQuery, [event_id, event_name, types, org_team], (err, results) => {
    if (err) {
      console.error('Error adding producers:', err);
      return res.status(500).json({ message: 'An error occurred while adding', error: err.message });
    }
    return res.status(201).json({ message: 'Added successfully', writer: { event_id, event_name, types, org_team } });
  });
})

app.post('/api/plays', (req, res) => {
  const { play_id, play_name, director_id, types, event_id } = req.body;
  const query = 'INSERT INTO play (play_id, play_name, director_id, types, event_id) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [play_id, play_name, director_id, types, event_id], (err, results) => {
      if (err) {
          console.error('Error adding play:', err);
          res.status(500).json({ error: 'Error adding play.' });
      } else {
          res.json({ message: 'Play added successfully.', playId: results.insertId });
      }
  });
});

app.post('/api/members', upload.single('profile_picture'), (req, res) => {
  const { mem_id, mem_name, dept, sem, dob, date_of_entry } = req.body;
  const profile_picture = req.file ? `profile_pictures/${req.file.filename}` : null;
  const query = 'INSERT INTO members (mem_id, mem_name, dept, sem, dob, date_of_entry, profile_picture) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [mem_id, mem_name, dept, sem, dob, date_of_entry, profile_picture], (err, results) => {
    if (err) {
      console.error('Error adding member:', err);
      res.status(500).json({ error: 'Error adding member.' });
    } else {
      res.json({ message: 'Member added successfully.', memberId: results.insertId });
    }
  });
});


// Update a member's details
// app.put('/api/members/:id', (req, res) => {
//   console.log(`Received request to update member with id ${req.params.id}`);
//   const { id } = req.params;
//   const { mem_name, dept, sem } = req.body;
//   console.log(`Updating member with values: ${mem_name}, ${dept}, ${sem}`);
//   const query = `UPDATE members SET mem_name = ?, dept = ?, sem = ? WHERE mem_id = ?`;
//   db.query(query, [mem_name, dept, sem, id], (error, results) => {
//     if (error) {
//       console.error('Error updating member:', error);
//       return res.status(500).send(error);
//     }
//     res.status(200).send(results);
//   });
// });

app.put('/api/members/:id', upload.single('profile_picture'), (req, res) => {
  const { id } = req.params;
  const { mem_name, dept, sem, dob, date_of_entry } = req.body;
  const profile_picture = req.file ? `profile_pictures/${req.file.filename}` : req.body.profile_picture;
  const query = 'UPDATE members SET mem_name = ?, dept = ?, sem = ?, dob = ?, date_of_entry = ?, profile_picture = ? WHERE mem_id = ?';
  db.query(query, [mem_name, dept, sem, dob, date_of_entry, profile_picture, id], (err, results) => {
      if (err) {
          console.error('Error updating member:', err);
          res.status(500).json({ error: 'Error updating member.' });
      } else {
          res.json({ message: 'Member updated successfully.' });
      }
  });
});


// Update actor details
app.put('/api/actor/:id', (req, res) => {
  const { id } = req.params;
  const {expertise } = req.body;
  const updateActorQuery = 'UPDATE actor SET expertise = ? WHERE actor_id = ?';

  db.query(updateActorQuery, [expertise, id], (err, results) => {
    if (err) {
      console.error('Error updating actor:', err);
      return res.status(500).json({ message: 'An error occurred while updating the actor', error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Actor not found' });
    }
    return res.status(200).json({ message: 'Actor updated successfully', actor: { actor_id: id, expertise } });
  });
});

app.put('/api/writer/:id', (req, res) => {
  const { id } = req.params;
  const {expertise } = req.body;
  const updateWriterQuery = 'UPDATE writer SET expertise = ? WHERE writer_id = ?';

  db.query(updateWriterQuery, [expertise, id], (err, results) => {
    if (err) {
      console.error('Error updating actor:', err);
      return res.status(500).json({ message: 'An error occurred while updating the writer', error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Writer not found' });
    }
    return res.status(200).json({ message: 'Writer updated successfully', writer: { writer_id: id, expertise } });
  });
});

app.put('/api/producer/:id', (req, res) => {
  const { id } = req.params;
  const {domain } = req.body;
  const updateProdQuery = 'UPDATE producer SET domain = ? WHERE prod_id = ?';

  db.query(updateProdQuery, [domain, id], (err, results) => {
    if (err) {
      console.error('Error updating actor:', err);
      return res.status(500).json({ message: 'An error occurred while updating the producer', error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Producer not found' });
    }
    return res.status(200).json({ message: 'Producer updated successfully', writer: { prod_id: id, domain } });
  });
});

app.put('/api/events/:id', (req, res) => {
  const { id } = req.params;
  const {event_name, types, org_team} = req.body;
  const updateEventQuery = 'UPDATE event SET event_name = ?, types = ?, org_team = ? WHERE event_id = ?';

  db.query(updateEventQuery, [event_name, types, org_team, id], (err, results) => {
    if (err) {
      console.error('Error updating actor:', err);
      return res.status(500).json({ message: 'An error occurred while updating', error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Not found' });
    }
    return res.status(200).json({ message: 'Updated successfully', event: { event_id: id, event_name, types, org_team } });
  });
});

app.put('/api/plays/:id', (req, res) => {
  const { id } = req.params;
  const { play_name, director_id, types } = req.body;
  const query = 'UPDATE play SET play_name = ?, director_id = ?, types = ? WHERE play_id = ?';
  db.query(query, [play_name, director_id, types, id], (err, results) => {
      if (err) {
          console.error('Error updating play:', err);
          res.status(500).json({ error: 'Error updating play.' });
      } else {
          res.json({ message: 'Play updated successfully.' });
      }
  });
});

app.put('/api/members/:id', upload.single('profile_picture'), (req, res) => {
  const { id } = req.params;
  const { mem_name, dept, sem, dob, date_of_entry } = req.body;
  const profile_picture = req.file ? `profile_pictures/${req.file.filename}` : req.body.profile_picture;
  const query = 'UPDATE members SET mem_name = ?, dept = ?, sem = ?, dob = ?, date_of_entry = ?, profile_picture = ? WHERE mem_id = ?';
  db.query(query, [mem_name, dept, sem, dob, date_of_entry, profile_picture, id], (err, results) => {
    if (err) {
      console.error('Error updating member:', err);
      res.status(500).json({ error: 'Error updating member.' });
    } else {
      res.json({ message: 'Member updated successfully.' });
    }
  });
});

app.delete('/api/members/:id', (req, res) => {
  const { id } = req.params;

  // Delete the member using raw SQL query
  const deleteMemberQuery = 'DELETE FROM members WHERE mem_id = ?';

  db.query(deleteMemberQuery, [id], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ message: 'An error occurred while deleting the member', error: err.message });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Member not found' });
    }

    return res.status(200).json({ message: 'Member deleted successfully' });
  });
});

app.delete('/api/actor/:id', (req, res) => {
  const { id } = req.params;
  const deleteActorQuery = 'DELETE FROM actor WHERE actor_id = ?';

  db.query(deleteActorQuery, [id], (err, results) => {
    if (err) {
      console.error('Error deleting actor:', err);
      return res.status(500).json({ message: 'An error occurred while deleting the actor', error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Actor not found' });
    }
    return res.status(200).json({ message: 'Actor deleted successfully' });
  });
});

app.delete('/api/writer/:id', (req, res) => {
  const { id } = req.params;
  const deleteWriterQuery = 'DELETE FROM writer WHERE writer_id = ?';

  db.query(deleteWriterQuery, [id], (err, results) => {
    if (err) {
      console.error('Error deleting actor:', err);
      return res.status(500).json({ message: 'An error occurred while deleting', error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Not found' });
    }
    return res.status(200).json({ message: 'Deleted successfully' });
  });
});

app.delete('/api/producer/:id', (req, res) => {
  const { id } = req.params;
  const deleteProdQuery = 'DELETE FROM producer WHERE prod_id = ?';

  db.query(deleteProdQuery, [id], (err, results) => {
    if (err) {
      console.error('Error deleting actor:', err);
      return res.status(500).json({ message: 'An error occurred while deleting the prod', error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Producer not found' });
    }
    return res.status(200).json({ message: 'Producer deleted successfully' });
  });
});

app.delete('/api/events/:id', (req, res) => {
  const { id } = req.params;
  const deleteEventQuery = 'DELETE FROM event WHERE event_id = ?';

  db.query(deleteEventQuery, [id], (err, results) => {
    if (err) {
      console.error('Error deleting event:', err);
      return res.status(500).json({ message: 'An error occurred while deleting the event', error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }
    return res.status(200).json({ message: 'Event deleted successfully' });
  });
});

app.delete('/api/plays/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM play WHERE play_id = ?';
  db.query(query, [id], (err, results) => {
      if (err) {
          console.error('Error deleting play:', err);
          res.status(500).json({ error: 'Error deleting play.' });
      } else {
          res.json({ message: 'Play deleted successfully.' });
      }
  });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});