require('dotenv').config();
const express = require('express');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../')));

// Initialize Gemini 1.5 Pro (Most stable and powerful for complex reasoning)
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-pro",
  generationConfig: { responseMimeType: "application/json" }
});

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase = null;
if (supabaseUrl && supabaseUrl.startsWith('http') && supabaseServiceKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseServiceKey);
  } catch (err) {
    console.error('Failed to initialize Supabase:', err.message);
  }
}

// API Route: Analyze Sentiment
app.post('/api/analyze', async (req, res) => {
  const { text } = req.body;

  if (!text || typeof text !== 'string' || text.trim() === '') {
    return res.status(400).json({ error: '유효한 텍스트를 입력해주세요.' });
  }

  try {
    // AI Analysis
    const prompt = `
      Analyze the sentiment of the following Korean text.
      You must respond with ONLY a valid JSON object. No other text.
      JSON structure:
      {
        "sentiment": "positive" | "negative" | "neutral",
        "confidence": integer (0-100),
        "reason": "one sentence explanation in Korean"
      }
      
      IMPORTANT: Ensure strings are properly escaped. Do not include any markdown formatting.
      
      Text to analyze: ${JSON.stringify(text)}
    `;

    const resultGemini = await model.generateContent(prompt);
    const response = await resultGemini.response;
    let rawText = response.text();
    
    const startIdx = rawText.indexOf('{');
    if (startIdx === -1) {
      throw new Error("API response does not contain a starting brace '{'.");
    }

    // Robust extraction: Find the matching closing brace for the first {
    let braceCount = 0;
    let endIdx = -1;
    for (let i = startIdx; i < rawText.length; i++) {
      if (rawText[i] === '{') braceCount++;
      else if (rawText[i] === '}') braceCount--;
      
      if (braceCount === 0) {
        endIdx = i;
        break;
      }
    }
    
    if (endIdx === -1) {
      throw new Error("API response does not contain a matching closing brace '}'.");
    }
    
    const jsonString = rawText.substring(startIdx, endIdx + 1).trim();
    const result = JSON.parse(jsonString);

    // Log to Supabase
    if (supabase) {
      supabase
        .from('sentiment_logs')
        .insert([
          {
            input_text: text,
            sentiment: result.sentiment,
            confidence: result.confidence,
            reason: result.reason
          }
        ])
        .then(({ error }) => {
          if (error) console.error('Supabase Error:', error.message);
        });
    }

    res.json(result);
  } catch (error) {
    console.error('API Error Details:', error);
    // Provide more specific error info to the user for debugging
    res.status(500).json({ 
      error: '분석 중 문제가 발생했습니다.',
      details: error.message 
    });
  }
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}

module.exports = app;
