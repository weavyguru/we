const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const Response = require('../models/Response');
const { v4: uuidv4 } = require('uuid');

// Display survey
router.get('/', async (req, res) => {
  try {
    const questions = await Question.find().sort({ order: 1 });
    res.render('survey/index', {
      title: 'Share Your Idea - We Venture Studio',
      questions
    });
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

// Submit survey responses
router.post('/submit', async (req, res) => {
  try {
    const { answers } = req.body; // Array of { questionId, answer }
    const sessionId = uuidv4();

    const response = new Response({
      sessionId,
      answers,
      completedAt: new Date()
    });

    await response.save();
    res.json({ message: 'Survey submitted successfully', sessionId });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
