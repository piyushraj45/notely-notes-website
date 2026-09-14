const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// REGISTER ROUTE
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // CHECK - agar email pehle se exist karta hai to error bhejo
    const existing = await User.findOne({ email });
    if (existing) {
      // Yaha message change kiya - pehle "User already exists" tha
      return res.status(400).json({ msg: "Already registered, please login" });
    }

    // Password ko hash karo
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashed });
    
    // User create hua to success
    res.status(201).json({ msg: "User created" });

  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
});

// LOGIN ROUTE
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // CHECK - user database me hai ya nahi
    const user = await User.findOne({ email });
    if (!user) {
      // Yaha message change kiya - pehle "Invalid credentials" tha
      // Ab bina signup ke login karega to ye message jayega frontend pe
      return res.status(400).json({ msg: "Please create your account first" });
    }

    // Password match check
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Password galat hua to ye message
      return res.status(400).json({ msg: "Wrong password" });
    }

    // Token banao aur login success
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });

  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
});

module.exports = router;