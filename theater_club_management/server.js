const express = require('express');
const cors = require('cors');
const mysql = require('mysql2'); // Ensure this is imported
const app = express();
const port = 3001;
app.use(cors());

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

app.get('/api/writers', (req, res) => {
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

app.get('/api/producers', (req, res) => {
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

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});