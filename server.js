const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Initialize SQLite Database
const dbPath = path.join(__dirname, 'knighthawks.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error('Database connection error:', err);
    else console.log('Connected to SQLite database');
});

// Create tables if they don't exist
db.serialize(() => {
    // Timeline Events Table
    db.run(`
        CREATE TABLE IF NOT EXISTS timeline_events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            year INTEGER NOT NULL,
            title TEXT NOT NULL,
            desc TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Members Table
    db.run(`
        CREATE TABLE IF NOT EXISTS members (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            bio TEXT,
            image TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Comics Table
    db.run(`
        CREATE TABLE IF NOT EXISTS comics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            featured BOOLEAN DEFAULT 0,
            title TEXT NOT NULL,
            pubDate TEXT,
            description TEXT,
            foundBy TEXT,
            thumbnail TEXT,
            mediaType TEXT,
            mediaContent TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Custom Artifacts Table
    db.run(`
        CREATE TABLE IF NOT EXISTS custom_artifacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            cols INTEGER,
            rows INTEGER,
            pieceWidth INTEGER,
            pieceHeight INTEGER,
            src TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Users Table
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            callsign TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            registered_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Seed initial data if empty
    db.get('SELECT COUNT(*) as count FROM timeline_events', (err, row) => {
        if (err) return;
        if (row.count === 0) {
            seedInitialData();
        }
    });
});

function seedInitialData() {
    const initialEvents = [
        [1930, "The Bishop Knight Chess Association", "The original Knight Hawks squadron is formed and starts doing missions around the world, fighting warlords, mad scientists, occultists and other ancient evils, and even dinosaurs."],
        [1931, "Japan invades Manchuria", "Establishes the puppet state of Manchukuo in 1932."],
        [1933, "Hitler comes to power", "The BK Chess Association starts scaling, anticipating war. The Knight Hawks start being more active in Europe and Germany in specific."],
        [1933, "Ace Drummond Comic premiers", "Clayton Knight & Eddie Rickenbacker start the Ace Drummond comic which features occasional appearances of the Knight Hawks."],
        [1934, "Knight Hawks comic strip introduced", "The news stories of their global missions and their popularity in Ace Drummond leads to the Knight Hawks getting its daily and Sunday comic strip."],
        [1934, "Missions in China", "Dragoness (Katherine Sui Fun Cheung) starts leading Knight Hawk missions in China."],
        [1936, "Spanish Civil War starts", "Field Marshal Wolfram von Richthofen takes command of the Nazi Condor Legion. The Knight Hawks shift to combat footing and relocate to Spain to fight the Condor Legion."],
        [1936, "The Knight Hawk comic books start", "The Knight Hawks first comic book premiers with the lead story Knight Hawks VS The Condor Legion."],
        [1937, "Permanent Presence in China", "Claire Lee Chennault brings in the Knight Hawks who establish a permanent base commanded by The Dragoness."],
        [1938, "Germany absorbs Austria", "Tensions rise across Europe."],
        [1938, "Cliff Secord joins the Knight Hawks", "Introduced by Howard Hughes, a long time supporter of the Knight Hawks. The Rocketeer flies again."],
        [1938, "Airboy Comic books spins out", "A spin-off series featuring the younger recruits."],
        [1939, "WWII Begins", "Germany invades Poland. The world is at war."],
        [1940, "Flyin Jenny Comic strip", "Another spin-off featuring the daring female aviators of the squadron."],
        [1941, "Flying Tiger combat missions begin", "The American Volunteer Group (AVG) enters the fray."],
        [1942, "The United States enters the war", "After Pearl Harbor, the Knight Hawks are integrated into Allied special operations."]
    ];

    initialEvents.forEach(([year, title, desc]) => {
        db.run(
            'INSERT INTO timeline_events (year, title, desc) VALUES (?, ?, ?)',
            [year, title, desc],
            (err) => {
                if (err) console.error('Error seeding timeline:', err);
            }
        );
    });

    const initialMembers = [
        ["Katherine 'The Dragoness' Cheung", "A pioneering aviatrix and the first Chinese-American woman to earn a pilot license. Known for her daring maneuvers and leadership in the China theater.", "Gemini_Generated_Image_f0ep3uf0ep3uf0ep.jpg"],
        ["Cliff 'Rocketeer' Secord", "A stunt pilot turned hero after discovering a prototype jetpack. Introduced to the squadron by Howard Hughes, he brings aerial superiority where planes cannot reach.", "Screenshot 2025-11-23 at 2.14.26 PM.jpg"],
        ["General 'Iron' Richter", "A tactical genius and WWI veteran who commands the squadron's European operations. Known for his stoic demeanor and unshakeable will.", "Gemini_Generated_Image_4i0m2s4i0m2s4i0m.jpg"],
        ["The Huntress", "A mysterious operative specializing in stealth and infiltration. Her true identity is classified.", "Gemini_Generated_Image_d9ojsrd9ojsrd9oj.jpg"]
    ];

    initialMembers.forEach(([name, bio, image]) => {
        db.run(
            'INSERT INTO members (name, bio, image) VALUES (?, ?, ?)',
            [name, bio, image],
            (err) => {
                if (err) console.error('Error seeding members:', err);
            }
        );
    });

    const initialComics = [
        [1, "The Silver Aviator", "1934-10-01", "The first appearance of the Silver Aviator.", "Jordan Weisman", "Gemini_Generated_Image_d9ojsrd9ojsrd9oj.jpg", "comic_front", JSON.stringify({ front: "Gemini_Generated_Image_d9ojsrd9ojsrd9oj.jpg" })],
        [0, "Skies over Shanghai", "1934-11-01", "The Dragoness takes flight over Shanghai.", "Michael Stackpole", "Gemini_Generated_Image_f0ep3uf0ep3uf0ep.jpg", "comic_front", JSON.stringify({ front: "Gemini_Generated_Image_f0ep3uf0ep3uf0ep.jpg" })],
        [1, "Radio: The Shadow's Warning", "1935-02-15", "A rare radio serial recording featuring a guest appearance by the Knight Hawks.", "Dave McCoy", "Black Swan of Death with Jimmy the monkey.jpg", "radio", JSON.stringify({ link: "#" })]
    ];

    initialComics.forEach(([featured, title, pubDate, description, foundBy, thumbnail, mediaType, mediaContent]) => {
        db.run(
            'INSERT INTO comics (featured, title, pubDate, description, foundBy, thumbnail, mediaType, mediaContent) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [featured, title, pubDate, description, foundBy, thumbnail, mediaType, mediaContent],
            (err) => {
                if (err) console.error('Error seeding comics:', err);
            }
        );
    });
}

// ===== TIMELINE API ENDPOINTS =====
app.get('/api/timeline', (req, res) => {
    db.all('SELECT id, year, title, desc FROM timeline_events ORDER BY year ASC', (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/timeline', (req, res) => {
    const { year, title, desc } = req.body;
    if (!year || !title || !desc) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    db.run(
        'INSERT INTO timeline_events (year, title, desc) VALUES (?, ?, ?)',
        [year, title, desc],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, year, title, desc });
        }
    );
});

app.delete('/api/timeline/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM timeline_events WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// ===== MEMBERS API ENDPOINTS =====
app.get('/api/members', (req, res) => {
    db.all('SELECT id, name, bio, image FROM members ORDER BY id ASC', (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/members', (req, res) => {
    const { name, bio, image } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }
    db.run(
        'INSERT INTO members (name, bio, image) VALUES (?, ?, ?)',
        [name, bio || '', image || ''],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, name, bio, image });
        }
    );
});

app.delete('/api/members/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM members WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// ===== COMICS API ENDPOINTS =====
app.get('/api/comics', (req, res) => {
    db.all('SELECT * FROM comics ORDER BY id ASC', (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        const parsed = rows.map(row => ({
            ...row,
            featured: Boolean(row.featured),
            mediaContent: typeof row.mediaContent === 'string' ? JSON.parse(row.mediaContent) : row.mediaContent
        }));
        res.json(parsed);
    });
});

app.post('/api/comics', (req, res) => {
    const { featured, title, pubDate, description, foundBy, thumbnail, mediaType, mediaContent } = req.body;
    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }
    db.run(
        'INSERT INTO comics (featured, title, pubDate, description, foundBy, thumbnail, mediaType, mediaContent) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [featured ? 1 : 0, title, pubDate || '', description || '', foundBy || '', thumbnail || '', mediaType || '', JSON.stringify(mediaContent || {})],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, featured, title, pubDate, description, foundBy, thumbnail, mediaType, mediaContent });
        }
    );
});

app.delete('/api/comics/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM comics WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// ===== CUSTOM ARTIFACTS API ENDPOINTS =====
app.get('/api/artifacts', (req, res) => {
    db.all('SELECT * FROM custom_artifacts ORDER BY id ASC', (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/artifacts', (req, res) => {
    const { name, description, cols, rows, pieceWidth, pieceHeight, src } = req.body;
    if (!name || !src) {
        return res.status(400).json({ error: 'Name and src are required' });
    }
    db.run(
        'INSERT INTO custom_artifacts (name, description, cols, rows, pieceWidth, pieceHeight, src) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [name, description || '', cols || 1, rows || 1, pieceWidth || 100, pieceHeight || 100, src],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, name, description, cols, rows, pieceWidth, pieceHeight, src });
        }
    );
});

app.delete('/api/artifacts/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM custom_artifacts WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// ===== USERS API ENDPOINTS =====
app.get('/api/users', (req, res) => {
    db.all('SELECT id, callsign, email, registered_at FROM users ORDER BY registered_at DESC', (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/users', (req, res) => {
    const { callsign, email } = req.body;
    if (!callsign || !email) {
        return res.status(400).json({ error: 'Callsign and email are required' });
    }
    db.run(
        'INSERT INTO users (callsign, email) VALUES (?, ?)',
        [callsign, email],
        function (err) {
            if (err) {
                if (err.message.includes('UNIQUE')) {
                    return res.status(409).json({ error: 'Email already registered' });
                }
                return res.status(500).json({ error: err.message });
            }
            res.json({ id: this.lastID, callsign, email, registered_at: new Date().toISOString() });
        }
    );
});

app.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM users WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Knight Hawks Website V28 improved Comcis and Serials.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`Knight Hawks server running on port ${PORT}`);
});
