const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;
const DB_PATH = path.join(__dirname, '..', 'database', 'tasks.db');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Initialize SQLite database
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');

    // Create tasks table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      completed BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
      if (err) {
        console.error('Error creating tasks table:', err.message);
      } else {
        console.log('Tasks table ready');
      }
    });
  }
});

// Routes

// GET all tasks
app.get('/api/tasks', (req, res) => {
  const sql = 'SELECT id, title, completed, created_at AS createdAt FROM tasks ORDER BY created_at DESC';

  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// GET a single task by ID
app.get('/api/tasks/:id', (req, res) => {
  const taskId = req.params.id;
  const sql = 'SELECT id, title, completed, created_at AS createdAt FROM tasks WHERE id = ?';

  db.get(sql, [taskId], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    res.json(row);
  });
});

// POST create a new task
app.post('/api/tasks', (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const sql = 'INSERT INTO tasks (title, completed) VALUES (?, ?)';
  const params = [title, 0];

  db.run(sql, params, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(201).json({
      id: this.lastID,
      title,
      completed: false,
      createdAt: new Date().toISOString()
    });
  });
});

// PUT update a task
app.put('/api/tasks/:id', (req, res) => {
  const taskId = req.params.id;
  const { title, completed } = req.body;

  const sql = 'UPDATE tasks SET title = ?, completed = ? WHERE id = ?';
  const params = [title, completed, taskId];

  db.run(sql, params, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (this.changes === 0) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    res.json({
      id: parseInt(taskId),
      title,
      completed
    });
  });
});

// DELETE a task
app.delete('/api/tasks/:id', (req, res) => {
  const taskId = req.params.id;
  const sql = 'DELETE FROM tasks WHERE id = ?';
  
  db.run(sql, [taskId], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (this.changes === 0) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    
    res.json({ message: 'Task deleted successfully' });
  });
});

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// Start server only if this file is run directly (not imported)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

// Export the app for testing
module.exports = app;