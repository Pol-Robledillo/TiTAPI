const express = require("express");
const { Pool } = require("pg");
const fs = require("fs");
const bcrypt = require("bcrypt");
const cors = require("cors");

const app = express();
const port = 3000;

const dbConfig = JSON.parse(fs.readFileSync("dbConfig.json", "utf-8"));
const pool = new Pool(dbConfig);

app.use(cors());
app.use(express.json());

// Get a player by name
app.get("/players/stats/:name", async (req, res) => {
    const { name } = req.params;
    try {
        const result = await pool.query(
            "SELECT max_points, total_points, max_enemies_killed, total_enemies_killed FROM player WHERE name = $1",
            [name],
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Player not found" });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new player (only requires name and pwd_hash)
app.post("/players", async (req, res) => {
    const { name, pwd_hash } = req.body;
    try {
        const existingPlayer = await pool.query(
            "SELECT * FROM player WHERE name = $1",
            [name],
        );

        if (existingPlayer.rows.length > 0) {
            return res.status(400).json({ error: "Player already exists" });
        }

        const hashedPassword = await bcrypt.hash(pwd_hash, 10);
        const result = await pool.query(
            "INSERT INTO player (name, pwd_hash, max_points, total_points, max_enemies_killed, total_enemies_killed) VALUES ($1, $2, 0, 0, 0, 0) RETURNING *",
            [name, hashedPassword],
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a player
app.put("/players/:name", async (req, res) => {
    const { name } = req.params;
    const {
        max_points,
        total_points,
        max_enemies_killed,
        total_enemies_killed,
    } = req.body;
    try {
        const result = await pool.query(
            "UPDATE player SET max_points = $1, total_points = $2, max_enemies_killed = $3, total_enemies_killed = $4 WHERE name = $5",
            [
                max_points,
                total_points,
                max_enemies_killed,
                total_enemies_killed,
                name,
            ],
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Player not found" });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new game
app.post("/games", async (req, res) => {
    const { player, points, enemies_killed, level, date } = req.body;
    try {
        const playerid = await pool.query(
            "SELECT playerid FROM player WHERE name = $1",
            [player],
        );
        if (playerid.rows.length === 0) {
            return res.status(404).json({ error: "Player not found" });
        }
        const result = await pool.query(
            "INSERT INTO game (player, points, enemies_killed, level, date) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [playerid.rows[0].playerid, points, enemies_killed, level, date],
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get the top 10 games
app.get("/games/top", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM game ORDER BY points DESC LIMIT 10",
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Log in a player
app.post("/players/login", async (req, res) => {
    const { name, pwd_hash } = req.body;
    try {
        const result = await pool.query(
            "SELECT * FROM player WHERE name = $1",
            [name],
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Player not found" });
        }

        const player = result.rows[0];
        const isMatch = await bcrypt.compare(pwd_hash, player.pwd_hash);

        if (isMatch) {
            res.json({ message: "Login successful", player });
        } else {
            res.status(401).json({ error: "Invalid password" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});