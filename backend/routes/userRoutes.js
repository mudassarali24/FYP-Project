const express = require('express');
const bcrypt = require ('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/Users');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    try {
        console.log('Request body:', req.body); // Log the request body
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            console.error('Validation failed: Missing fields');
            return res.status(400).json({ error: 'All fields are required.' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.error('Validation failed: User already exists');
            return res.status(400).json({ error: 'User already exists.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        console.log('User successfully registered:', newUser);
        res.status(201).json({ message: 'User registered successfully.' });
    } catch (err) {
        console.error('Error during registration:', err); // Log the error
        res.status(500).json({ error: 'Error registering user.' });
    }
});


// Login

router.post('/login', async (req, res) =>
{
    console.log('In Login!');
    console.log(req.body);
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({error: 'Email and password are required!'});
    }
    try
    {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "User not found" });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ error: "Invalid Password!" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, username: user.username, email: user.Email});

    }catch(error)
    {
        console.error("Error in /login route:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }

});

module.exports = router;