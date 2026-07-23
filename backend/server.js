const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

const db = new sqlite3.Database('./portfolio.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the portfolio database.');
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        description TEXT
    )`);

    db.get("SELECT COUNT(*) AS count FROM projects", (err, row) => {
        if (row && row.count === 0) {
            const stmt = db.prepare("INSERT INTO projects (title, description) VALUES (?, ?)");
            stmt.run("Mood-Based Music Recommender", "An application that recommends music based on user mood.");
            stmt.run("AI Chatbot Prototype", "A conversational AI chatbot designed for various tasks.");
            stmt.run("Data Analysis using Pandas", "Analysis of datasets to extract meaningful insights using Python and Pandas.");
            stmt.finalize();
        }
    });
});

app.get('/api/projects', (req, res) => {
    db.all("SELECT * FROM projects", [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
