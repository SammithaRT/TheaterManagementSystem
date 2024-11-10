const express = require('express');
const cors = require('cors');
const mysql = require('mysql2'); // Ensure this is imported
const app = express();
const port = 3001;
app.use(cors());

console.log("Starting server...");

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'Theater_Club_Management'
});

db.connect(err => {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + db.threadId);
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
        p.play_name, m.mem_name, w.writer_id, a.actor_id, pr.prod_id
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

app.post('/api/members', (req, res) => {
  const { mem_id, mem_name, dept, sem, dob, date_of_entry} = req.body;
  const query = `INSERT INTO members (mem_id, mem_name, dept, sem, dob, date_of_entry) VALUES (?, ?, ?, ?, ?, ?)`;
  db.query(query, [mem_id, mem_name, dept, sem, dob, date_of_entry], (error, results) => {
      if (error) {
          console.error('Error adding member:', error);
          return res.status(500).send(error);
      }
      res.status(201).send({ id: results.insertId, ...req.body });
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


// Update a member's details
app.put('/api/members/:id', (req, res) => {
  console.log(`Received request to update member with id ${req.params.id}`);
  const { id } = req.params;
  const { mem_name, dept, sem } = req.body;
  console.log(`Updating member with values: ${mem_name}, ${dept}, ${sem}`);
  const query = `UPDATE members SET mem_name = ?, dept = ?, sem = ? WHERE mem_id = ?`;
  db.query(query, [mem_name, dept, sem, id], (error, results) => {
    if (error) {
      console.error('Error updating member:', error);
      return res.status(500).send(error);
    }
    res.status(200).send(results);
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

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});