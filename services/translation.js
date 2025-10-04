const Anthropic = require('@anthropic-ai/sdk');

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// Simple in-memory LRU cache
class LRUCache {
  constructor(maxSize = 1000) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  get(key) {
    if (!this.cache.has(key)) return null;
    const value = this.cache.get(key);
    // Move to end (most recently used)
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  set(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // Remove oldest (first) item
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }

  has(key) {
    return this.cache.has(key);
  }
}

// Create cache instance
const translationCache = new LRUCache(1000);

/**
 * Translate text from English to target language using Claude Haiku
 * @param {string} text - Text to translate
 * @param {string} targetLang - Target language code (e.g., 'sv' for Swedish)
 * @returns {Promise<string>} - Translated text
 */
async function translateText(text, targetLang = 'sv') {
  if (!text || text.trim() === '') return text;

  // Return original if target is English
  if (targetLang === 'en') return text;

  const cacheKey = `${targetLang}:${text}`;

  // Check cache first
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }

  try {
    const languageNames = {
      'sv': 'Swedish',
      'no': 'Norwegian',
      'da': 'Danish',
      'fi': 'Finnish'
    };

    const targetLanguage = languageNames[targetLang] || 'Swedish';

    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `Translate the following English text to ${targetLanguage}. Return ONLY the translation, no explanations or additional text:\n\n${text}`
      }]
    });

    const translatedText = message.content[0].text.trim();

    // Cache the result
    translationCache.set(cacheKey, translatedText);

    return translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    // Return original text on error
    return text;
  }
}

/**
 * Translate multiple texts in a single API call (more efficient)
 * @param {string[]} texts - Array of texts to translate
 * @param {string} targetLang - Target language code
 * @returns {Promise<string[]>} - Array of translated texts
 */
async function translateBatch(texts, targetLang = 'sv') {
  if (!texts || texts.length === 0) return [];
  if (targetLang === 'en') return texts;

  // Check which texts are already cached
  const results = new Array(texts.length);
  const toTranslate = [];
  const toTranslateIndices = [];

  texts.forEach((text, index) => {
    const cacheKey = `${targetLang}:${text}`;
    if (translationCache.has(cacheKey)) {
      results[index] = translationCache.get(cacheKey);
    } else {
      toTranslate.push(text);
      toTranslateIndices.push(index);
    }
  });

  // If everything is cached, return early
  if (toTranslate.length === 0) return results;

  try {
    const languageNames = {
      'sv': 'Swedish',
      'no': 'Norwegian',
      'da': 'Danish',
      'fi': 'Finnish'
    };

    const targetLanguage = languageNames[targetLang] || 'Swedish';

    // Create numbered list for translation
    const numberedTexts = toTranslate.map((text, i) => `${i + 1}. ${text}`).join('\n');

    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 4096,
      messages: [{
        role: 'user',
        content: `Translate the following numbered English texts to ${targetLanguage}. Return ONLY the translations in the same numbered format, no explanations:\n\n${numberedTexts}`
      }]
    });

    const response = message.content[0].text.trim();
    const translatedLines = response.split('\n').filter(line => line.trim());

    // Parse the numbered responses
    translatedLines.forEach((line, i) => {
      const match = line.match(/^\d+\.\s*(.+)$/);
      if (match && i < toTranslateIndices.length) {
        const translatedText = match[1].trim();
        const originalIndex = toTranslateIndices[i];
        results[originalIndex] = translatedText;

        // Cache the result
        const cacheKey = `${targetLang}:${toTranslate[i]}`;
        translationCache.set(cacheKey, translatedText);
      }
    });

    // Fill any missing translations with originals
    toTranslateIndices.forEach((index, i) => {
      if (!results[index]) {
        results[index] = toTranslate[i];
      }
    });

    return results;
  } catch (error) {
    console.error('Batch translation error:', error);
    // Fill remaining with originals on error
    toTranslateIndices.forEach((index, i) => {
      results[index] = toTranslate[i];
    });
    return results;
  }
}

/**
 * Translation helper function for views
 * @param {string} text - Text to translate
 * @param {string} lang - Target language
 * @returns {Promise<string>} - Translated text or original
 */
async function t(text, lang) {
  if (lang === 'en' || !lang) return text;
  return await translateText(text, lang);
}

module.exports = {
  translateText,
  translateBatch,
  t,
  translationCache
};
