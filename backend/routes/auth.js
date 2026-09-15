const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();

// REGISTER ROUTE
router.post('/register', async (req, res) => {
  try {
    const { username, name, email, password } = req.body;
    const finalUsername = username || name;

    if(!finalUsername || !email || !password){
      return res.status(400).json({ msg: "All fields required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ msg: "Already registered, please login" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username: finalUsername, email, password: hashed });
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ 
      token, 
      user: { id: user._id, username: user.username, email: user.email } 
    });

  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
});

// LOGIN ROUTE
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Please create your account first" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Wrong password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
});

module.exports = router;