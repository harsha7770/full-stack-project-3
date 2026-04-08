const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectDB } = require('./config/db');
const syncDatabase = require('./sync');

// Import Models
const User = require('./models/User');
const Session = require('./models/Session');
const Matching = require('./models/Matching');
const Progress = require('./models/Progress');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to Database and Sync
connectDB().then(() => {
  syncDatabase();
});

// Auth Endpoints
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email, password } });
    
    if (user) {
      // Sequelize instance to JSON
      const safeUser = user.toJSON();
      delete safeUser.password;
      res.json({ success: true, user: safeUser });
    } else {
      res.status(401).json({ error: 'Invalid credentials. Please double check your email and password.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error during login' });
  }
});

app.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }
    
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const newUser = await User.create({
      name,
      email,
      password,
      role,
      expertise: role === 'mentor' ? ['Leadership', 'General Tech'] : [],
      interests: role === 'mentee' ? ['Professional Growth'] : [],
      bio: 'Just joined the platform!'
    });

    const safeUser = newUser.toJSON();
    delete safeUser.password;
    res.status(201).json({ success: true, user: safeUser });
  } catch (error) {
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Users Endpoints
app.get('/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.get('/mentors', async (req, res) => {
  try {
    const mentors = await User.findAll({ where: { role: 'mentor' } });
    res.json(mentors);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch mentors' });
  }
});

app.get('/mentees', async (req, res) => {
  try {
    const mentees = await User.findAll({ where: { role: 'mentee' } });
    res.json(mentees);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch mentees' });
  }
});

// Matching Endpoints
app.get('/match', async (req, res) => {
  try {
    const matchings = await Matching.findAll();
    res.json(matchings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch matchings' });
  }
});

app.post('/match', async (req, res) => {
  try {
    const { mentorId, menteeId } = req.body;
    if (!mentorId || !menteeId) {
      return res.status(400).json({ error: 'mentorId and menteeId are required' });
    }

    const mentor = await User.findOne({ where: { id: mentorId, role: 'mentor' } });
    const mentee = await User.findOne({ where: { id: menteeId, role: 'mentee' } });

    if (!mentor || !mentee) {
      return res.status(404).json({ error: 'Valid mentor or mentee not found' });
    }

    const existingMatch = await Matching.findOne({ where: { mentorId, menteeId } });
    if (existingMatch) {
      return res.status(400).json({ error: 'Mentors are already matched' });
    }

    const newMatch = await Matching.create({
      mentorId,
      menteeId,
      status: 'active'
    });

    // If session details are provided, auto-create a session
    if (req.body.topic && req.body.date) {
      await Session.create({
        mentorId,
        menteeId,
        topic: req.body.topic,
        date: req.body.date,
        time: req.body.time,
        duration: req.body.duration,
        meetingLink: req.body.meetingLink,
        status: 'scheduled'
      });
    }

    res.status(201).json(newMatch);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create matching' });
  }
});

// Sessions Endpoints
app.get('/sessions', async (req, res) => {
  try {
    const sessions = await Session.findAll();
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

app.post('/sessions', async (req, res) => {
  try {
    const { mentorId, menteeId, topic, date } = req.body;
    
    if (!mentorId || !menteeId || !topic || !date) {
      return res.status(400).json({ error: 'mentorId, menteeId, topic, and date are required' });
    }

    const newSession = await Session.create({
      mentorId,
      menteeId,
      topic,
      date,
      status: 'scheduled'
    });

    res.status(201).json(newSession);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create session' });
  }
});

// Progress Endpoints
app.get('/progress', async (req, res) => {
  try {
    const menteeId = req.query.menteeId ? parseInt(req.query.menteeId) : null;
    if(menteeId) {
       const filteredProgress = await Progress.findAll({ where: { menteeId } });
       return res.json(filteredProgress);
    }
    const allProgress = await Progress.findAll();
    res.json(allProgress);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch progress logs' });
  }
});

app.post('/progress', async (req, res) => {
  try {
    const { menteeId, description } = req.body;

    if (!menteeId || !description) {
      return res.status(400).json({ error: 'menteeId and description are required' });
    }

    const newLog = await Progress.create({
      menteeId,
      description
    });

    res.status(201).json(newLog);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create progress log' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
