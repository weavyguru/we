# Swedish Translation Setup

## Overview

The site now supports automatic translation to Swedish (and other Nordic languages) using Claude Haiku with intelligent caching. English remains the source of truth - no maintenance needed for Swedish content!

## How It Works

1. **Auto-Detection**: Language is detected from URL parameter (`?lang=sv`) or browser headers
2. **Smart Translation**: Claude Haiku translates content on-the-fly
3. **Caching**: Translations are cached in memory (LRU cache with 1000 items) to minimize API calls
4. **Batch Processing**: Survey questions are translated in batches for efficiency

## Setup Instructions

### 1. Add Your Anthropic API Key

Create a `.env` file (copy from `.env.example`):

```bash
cp .env.example .env
```

Edit `.env` and add your Anthropic API key:

```
ANTHROPIC_API_KEY=sk-ant-your-actual-key-here
```

Get your API key from: https://console.anthropic.com/

### 2. Start the Server

```bash
npm run dev
```

### 3. Test Swedish Translation

Visit:
- English: `http://localhost:3000/`
- Swedish: `http://localhost:3000/?lang=sv`

## Supported Languages

Currently configured for Nordic languages:
- `sv` - Swedish (Svenska)
- `no` - Norwegian (Norsk)
- `da` - Danish (Dansk)
- `fi` - Finnish (Suomi)

Default: English (`en`)

## Translation Coverage

### Pages Translated:
- ✅ Home page (`/`)
- ✅ FAQ page (`/faq`)
- ✅ Survey page (`/survey`)
- ✅ Header navigation
- ✅ Survey questions (dynamic from database)

### What Gets Translated:
- All static text content
- Section headings and descriptions
- Button labels and CTAs
- Survey questions and responses
- Success messages

## Performance & Costs

### Caching Strategy
- **In-memory LRU cache** with 1000 item limit
- Each unique text string is translated once and cached
- Cache persists until server restart
- Survey questions use **batch translation** (more efficient)

### Cost Optimization
- **Model**: Claude 3 Haiku (cheapest, fastest)
- **Caching**: Reduces API calls by ~95% after initial load
- **Batch API calls**: Survey questions translated together

### Estimated Costs
For a typical page with ~50 text strings:
- First load: ~$0.001 (1 batch translation)
- Subsequent loads: $0 (fully cached)
- Monthly cost (1000 visitors): ~$1-2

## How to Add More Languages

Edit `app.js` middleware:

```javascript
app.use((req, res, next) => {
  const lang = req.query.lang || req.headers['accept-language']?.split(',')[0]?.split('-')[0];
  res.locals.lang = (lang === 'sv' || lang === 'no' || lang === 'da' || lang === 'fi' || lang === 'de' || lang === 'fr') ? lang : 'en';
  next();
});
```

Add language name mapping in `services/translation.js`:

```javascript
const languageNames = {
  'sv': 'Swedish',
  'no': 'Norwegian',
  'da': 'Danish',
  'fi': 'Finnish',
  'de': 'German',
  'fr': 'French'
};
```

## Language Switcher

The header includes an EN/SV switcher. To add more languages, edit `views/partials/header.ejs`.

## Technical Details

### Files Modified:
- `app.js` - Added language middleware and translation imports
- `routes/survey.js` - Added question translation with batch processing
- `services/translation.js` - Translation service with Haiku + caching
- `views/index.ejs` - Added translation calls
- `views/faq.ejs` - Added translation calls
- `views/survey/index.ejs` - Added translation calls
- `views/partials/header.ejs` - Added language switcher

### Translation Service API:

```javascript
// Single text translation
const translated = await translateText('Hello', 'sv'); // => "Hej"

// Batch translation (more efficient)
const translations = await translateBatch(['Hello', 'World'], 'sv'); // => ["Hej", "Värld"]

// In EJS templates
<%= await translateText('Welcome', lang) %>
```

## Troubleshooting

### Translation not working?
1. Check `.env` file has `ANTHROPIC_API_KEY`
2. Restart server after adding API key
3. Check console for error messages

### Translations seem wrong?
- Haiku is fast but may occasionally miss nuance
- English content is the source of truth
- Consider upgrading to Sonnet for higher quality (more expensive)

### Cache not working?
- Cache resets on server restart
- Consider Redis for persistent caching in production

## Production Considerations

For production deployment:

1. **Use persistent cache** (Redis/Memcached)
2. **Pre-warm cache** on startup with common phrases
3. **Set up monitoring** for API usage/costs
4. **Consider CDN caching** for translated pages
5. **Implement fallback** if API is unavailable

## Future Enhancements

- [ ] Persistent cache with Redis
- [ ] Pre-translation of static content at build time
- [ ] Admin panel to override auto-translations
- [ ] Support for more languages
- [ ] Translation quality feedback mechanism
