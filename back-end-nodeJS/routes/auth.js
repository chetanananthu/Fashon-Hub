const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Signup Route
router.post('/api/auth/signup', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if email is already taken
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = new User({
            name,
            email,
            password: hashedPassword,
            role: role || 'user', // Default role is 'user'
        });

        // Save the user to the database
        const savedUser = await user.save();

        res.status(201).json({
            message: "User created successfully",
            userId: savedUser._id,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login Route
router.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "No user found with the provided email" });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { email: user.email, userId: user._id, role: user.role },
            'secret_this_should_be_longer', // Change this to a secure environment variable
            { expiresIn: "1h" }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            userId: user._id,
            role: user.role,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
