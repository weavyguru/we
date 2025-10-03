const express = require('express');
const router = express.Router();
const Question = require('../models/Question');

// Admin Dashboard
router.get('/', async (req, res) => {
  try {
    const questions = await Question.find().sort({ order: 1 });
    res.render('admin/dashboard', {
      title: 'Admin - Survey Questions',
      questions,
      layout: 'layouts/main'
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).send('Server Error: ' + error.message);
  }
});

// Get all questions (API)
router.get('/questions', async (req, res) => {
  try {
    const questions = await Question.find().sort({ order: 1 });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reorder questions (MUST be before /:id routes)
router.put('/questions/reorder', async (req, res) => {
  try {
    const { questions } = req.body; // Array of { id, order }

    const bulkOps = questions.map(q => ({
      updateOne: {
        filter: { _id: q.id },
        update: { order: q.order }
      }
    }));

    await Question.bulkWrite(bulkOps);
    res.json({ message: 'Questions reordered successfully' });
  } catch (error) {
    console.error('Reorder error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create question
router.post('/questions', async (req, res) => {
  try {
    const { questionText, body, type, required } = req.body;

    // Get the highest order number and add 1
    const maxOrder = await Question.findOne().sort({ order: -1 }).select('order');
    const order = maxOrder ? maxOrder.order + 1 : 0;

    const question = new Question({
      questionText,
      body: body || '',
      type,
      required: required === 'true' || required === true,
      order
    });

    await question.save();
    res.json(question);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update question
router.put('/questions/:id', async (req, res) => {
  try {
    const { questionText, body, type, required } = req.body;
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      { questionText, body: body || '', type, required: required === 'true' || required === true },
      { new: true, runValidators: true }
    );

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    res.json(question);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete question
router.delete('/questions/:id', async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    // Reorder remaining questions
    await Question.updateMany(
      { order: { $gt: question.order } },
      { $inc: { order: -1 } }
    );

    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
