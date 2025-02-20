import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';  // Import the MySQL connection
import { validationResult } from 'express-validator';  // For validation (install it)

const validateInput = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new Error(errors.array()[0].msg);
  }
};

// Register new user
export const register = async (req, res) => {
    const { email, password, username } = req.body;  // Get username from request

    try {
        // Validate input data (email, password, and username)
        validateInput(req);

        // Check if the user already exists by email
        const [userExists] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (userExists.length > 0) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Check if the username already exists
        const [usernameExists] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        if (usernameExists.length > 0) {
            return res.status(400).json({ message: 'Username already taken' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert the new user into the database
        const result = await pool.query(
            'INSERT INTO users (email, password_hash, username) VALUES (?, ?, ?)', 
            [email, hashedPassword, username]
        );

        // Send success response
        res.status(201).json({ message: 'User created successfully', userId: result[0].insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || 'Error registering user' });
    }
};

// Login user
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Validate input data (email and password)
        validateInput(req);

        // Find the user by email
        const [user] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        
        if (user.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare the entered password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user[0].password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate a JWT token with a 1-hour expiration (can be customized)
        const token = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET, { expiresIn: '12h' });

        // Send response with token
        res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || 'Error logging in user' });
    }
};
