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
  // Extract language from URL path (e.g., /sv, /sv/faq)
  const pathParts = req.path.split('/').filter(p => p);
  const firstSegment = pathParts[0];

  // Check if first segment is a supported language code
  const supportedLangs = ['sv', 'no', 'da', 'fi'];
  if (supportedLangs.includes(firstSegment)) {
    res.locals.lang = firstSegment;
    // Store the path without language prefix for building links
    res.locals.basePath = '/' + pathParts.slice(1).join('/');
  } else {
    // Default to English
    res.locals.lang = 'en';
    res.locals.basePath = req.path;
  }

  // Check for retranslate parameter to clear cache
  if (req.query.retranslate === 'true') {
    const { translationCache } = require('./services/translation');
    translationCache.cache.clear();
    console.log('🔄 Translation cache cleared');
  }

  next();
});

// Routes
const adminRoutes = require('./routes/admin');
const surveyRoutes = require('./routes/survey');
const { translateText } = require('./services/translation');
const { translatePageStrings, homePageStrings, faqPageStrings, headerStrings, footerStrings } = require('./helpers/pageTranslations');

// Home page - English
app.get('/', async (req, res) => {
  const lang = res.locals.lang;
  const titleSuffix = await translateText('Turning Ideas into Ventures Together', lang);
  const title = `We - ${titleSuffix}`;
  const t = await translatePageStrings(homePageStrings, lang);
  const h = await translatePageStrings(headerStrings, lang);
  const f = await translatePageStrings(footerStrings, lang);

  res.render('index', { title, lang, t, h, f });
});

// Home page - with language prefix
app.get('/:lang(sv|no|da|fi)', async (req, res) => {
  const lang = res.locals.lang;
  const titleSuffix = await translateText('Turning Ideas into Ventures Together', lang);
  const title = `We - ${titleSuffix}`;
  const t = await translatePageStrings(homePageStrings, lang);
  const h = await translatePageStrings(headerStrings, lang);
  const f = await translatePageStrings(footerStrings, lang);

  res.render('index', { title, lang, t, h, f });
});

// FAQ page - English
app.get('/faq', async (req, res) => {
  const lang = res.locals.lang;
  const title = lang === 'en' ? 'FAQ - We Venture Studio' : `FAQ - We Venture Studio`;
  const t = await translatePageStrings(faqPageStrings, lang);
  const h = await translatePageStrings(headerStrings, lang);
  const f = await translatePageStrings(footerStrings, lang);

  res.render('faq', { title, lang, t, h, f });
});

// FAQ page - with language prefix
app.get('/:lang(sv|no|da|fi)/faq', async (req, res) => {
  const lang = res.locals.lang;
  const title = lang === 'en' ? 'FAQ - We Venture Studio' : `FAQ - We Venture Studio`;
  const t = await translatePageStrings(faqPageStrings, lang);
  const h = await translatePageStrings(headerStrings, lang);
  const f = await translatePageStrings(footerStrings, lang);

  res.render('faq', { title, lang, t, h, f });
});

app.use('/admin/survey', adminRoutes);
app.use('/survey', surveyRoutes);
app.use('/:lang(sv|no|da|fi)/survey', surveyRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
