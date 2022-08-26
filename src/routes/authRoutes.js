const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  // Check if email already exists in the database
  User.findOne({ email }, (err, user) => {
    if (user) {
      return res.status(400).send('Email already exists');
    }
    if (err) {
      console.log(err);
      return res.status(500).send('Server error');
    }
    // If email doesn't exist, create a new user
    const newUser = new User({ email, password });
    newUser.save((err, user) => {
      if (err) {
        console.log(err);
        return res.status(500).send('Server error');
      }
      const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      });
      return res.status(201).send({ token: token, user: newUser });
    });
  });
});

module.exports = router;