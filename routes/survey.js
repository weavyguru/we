const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const Response = require('../models/Response');
const { v4: uuidv4 } = require('uuid');
const { translateText, translateBatch } = require('../services/translation');
const { translatePageStrings, surveyPageStrings, headerStrings, footerStrings } = require('../helpers/pageTranslations');

// Display survey
router.get('/', async (req, res) => {
  try {
    const lang = res.locals.lang;
    const questions = await Question.find().sort({ order: 1 });

    // Translate questions if not English
    if (lang !== 'en') {
      // Prepare all texts to translate
      const textsToTranslate = [];
      questions.forEach(q => {
        textsToTranslate.push(q.questionText);
        if (q.body) textsToTranslate.push(q.body);
      });

      // Batch translate for efficiency
      const translations = await translateBatch(textsToTranslate, lang);

      // Apply translations back to questions
      let translationIndex = 0;
      questions.forEach(q => {
        q.questionText = translations[translationIndex++];
        if (q.body) {
          q.body = translations[translationIndex++];
        }
      });
    }

    const titleSuffix = await translateText('Share Your Idea', lang);
    const title = `${titleSuffix} - We Venture Studio`;
    const t = await translatePageStrings(surveyPageStrings, lang);
    const h = await translatePageStrings(headerStrings, lang);
    const f = await translatePageStrings(footerStrings, lang);

    res.render('survey/index', {
      title,
      questions,
      lang,
      t,
      h,
      f
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
