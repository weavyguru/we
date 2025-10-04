require('dotenv').config();
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://we_admin:QWMQpwytIM3hnsuz@weavy.ydtz90f.mongodb.net/we';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });

// Set up view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', require('ejs').renderFile);

// Disable view caching in development
if (process.env.NODE_ENV !== 'production') {
  app.set('view cache', false);
}

// Set up express-ejs-layouts
app.use(expressLayouts);
app.set('layout', 'layouts/main');

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Language detection middleware
app.use((req, res, next) => {
  const lang = req.query.lang || req.headers['accept-language']?.split(',')[0]?.split('-')[0];
  res.locals.lang = (lang === 'sv' || lang === 'no' || lang === 'da' || lang === 'fi') ? lang : 'en';
  next();
});

// Routes
const adminRoutes = require('./routes/admin');
const surveyRoutes = require('./routes/survey');
const { translateText } = require('./services/translation');
const { translatePageStrings, homePageStrings, faqPageStrings, headerStrings } = require('./helpers/pageTranslations');

app.get('/', async (req, res) => {
  const lang = res.locals.lang;
  const title = await translateText('We - Turning Ideas into Ventures Together', lang);
  const t = await translatePageStrings(homePageStrings, lang);
  const h = await translatePageStrings(headerStrings, lang);

  res.render('index', { title, lang, t, h });
});

app.get('/faq', async (req, res) => {
  const lang = res.locals.lang;
  const title = await translateText('FAQ - We Venture Studio', lang);
  const t = await translatePageStrings(faqPageStrings, lang);
  const h = await translatePageStrings(headerStrings, lang);

  res.render('faq', { title, lang, t, h });
});

app.use('/admin/survey', adminRoutes);
app.use('/survey', surveyRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
