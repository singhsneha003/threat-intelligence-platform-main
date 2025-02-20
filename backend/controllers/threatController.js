import pool from '../config/db.js';
import jwt from 'jsonwebtoken';
import stix2 from "stix2";
import { v4 as uuidv4 } from "uuid";

export const reportThreat = async (req, res) => {
    try {
        const { user_id, threat_type, description, url } = req.body;
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) return res.status(401).json({ message: "Unauthorized" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const reported_by = decoded.id;

        // Generate STIX Indicator Object
        const stixIndicator = {
            type: "indicator",
            id: `indicator--${uuidv4()}`,
            created: new Date().toISOString(),
            modified: new Date().toISOString(),
            name: `Threat Indicator - ${threat_type}`,
            description,
            pattern: url ? `[url:value = '${url}']` : "",
            pattern_type: "stix",
            valid_from: new Date().toISOString(),
        };

        // Generate STIX Threat Actor Object
        const stixThreatActor = {
            type: "threat-actor",
            id: `threat-actor--${uuidv4()}`,
            created: new Date().toISOString(),
            modified: new Date().toISOString(),
            name: `Threat Actor - ${reported_by}`,
            description: `Threat reported by user ID: ${reported_by}`,
            roles: ["attacker"],
            first_seen: new Date().toISOString(),
        };

        // Generate STIX Malware Object (if applicable)
        let stixMalware = null;
        if (threat_type.toLowerCase().includes("malware")) {
            stixMalware = {
                type: "malware",
                id: `malware--${uuidv4()}`,
                created: new Date().toISOString(),
                modified: new Date().toISOString(),
                name: "Suspicious Malware",
                description,
                is_family: false,
            };
        }

        // Convert STIX objects to JSON
        const stixData = {
            indicator: stixIndicator,
            threat_actor: stixThreatActor,
            malware: stixMalware || null,
        };

        // Insert into database
        const query = `
            INSERT INTO threats (user_id, reported_by, threat_type, description, votes, stix_data)
            VALUES (?, ?, ?, ?, 0, ?)
        `;
        const values = [reported_by, reported_by, threat_type, description, JSON.stringify(stixData)];

        await pool.query(query, values);
        res.status(201).json({
            message: "Threat reported successfully",
            stix: stixData,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error reporting threat" });
    }
};

export const getThreatById = async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch threat details
        const [threat] = await pool.query("SELECT * FROM threats WHERE id = ?", [id]);

        if (threat.length === 0) {
            return res.status(404).json({ message: "Threat not found" });
        }

        // Fetch related comments
        const [comments] = await pool.query("SELECT * FROM threat_comments WHERE threat_id = ? ORDER BY created_at DESC", [id]);

        res.status(200).json({ threat: threat[0], comments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching threat details" });
    }
};



export const getThreats = async (req, res) => {
    try {
        const { sortBy } = req.query; // "latest", "votes", "unresolved"

        let query = `
            SELECT t.*, u.username 
            FROM threats t
            JOIN users u ON t.user_id = u.id
        `;

        if (sortBy === "latest") {
            query += " ORDER BY t.created_at DESC";
        } else if (sortBy === "votes") {
            query += " ORDER BY t.votes DESC";
        } else if (sortBy === "unresolved") {
            query += " WHERE t.status = 'pending' ORDER BY t.created_at DESC";
        }

        const [threats] = await pool.query(query);
        res.status(200).json(threats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching threats" });
    }
};



export const voteThreat = async (req, res) => {
    try {
        const { id } = req.params;
        const { vote } = req.body; // 1 for upvote, -1 for downvote
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) return res.status(401).json({ message: "Unauthorized" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user_id = decoded.id;

        const [existingVote] = await pool.query(
            'SELECT vote FROM threat_votes WHERE user_id = ? AND threat_id = ?',
            [user_id, id]
        );

        if (existingVote.length > 0) {
            await pool.query(
                'UPDATE threat_votes SET vote = ? WHERE user_id = ? AND threat_id = ?',
                [vote, user_id, id]
            );
        } else {
            await pool.query(
                'INSERT INTO threat_votes (user_id, threat_id, vote) VALUES (?, ?, ?)',
                [user_id, id, vote]
            );
        }

        await pool.query('UPDATE threats SET votes = votes + ? WHERE id = ?', [vote, id]);

        res.status(200).json({ message: "Vote registered" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error voting on threat" });
    }
};


export const commentOnThreat = async (req, res) => {

    console.log("comment");
    
    try {
        const { id } = req.params;
        const { comment } = req.body;
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) return res.status(401).json({ message: "Unauthorized" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user_id = decoded.id;

        await pool.query(
            'INSERT INTO threat_comments (user_id, threat_id, comment) VALUES (?, ?, ?)',
            [user_id, id, comment]
        );

        res.status(201).json({ message: "Comment added successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error adding comment" });
    }
};

export const getThreatComments = async (req, res) => {
    try {
        const { id } = req.params;
        const [comments] = await pool.query(
            'SELECT * FROM threat_comments WHERE threat_id = ? ORDER BY created_at ASC',
            [id]
        );

        res.status(200).json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching comments" });
    }
};

