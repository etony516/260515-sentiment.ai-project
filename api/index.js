require('dotenv').config();
const express = require('express');
const path = require('path');
const { OpenAI } = require('openai');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// For local development, serve static files from root
// Vercel will serve these automatically from the root
app.use(express.static(path.join(__dirname, '../')));

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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
// On Vercel, this file handles everything under /api
app.post('/api/analyze', async (req, res) => {
  const { text } = req.body;

  if (!text || typeof text !== 'string' || text.trim() === '') {
    return res.status(400).json({ error: '유효한 텍스트를 입력해주세요.' });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `너는 한국어 텍스트 감성 분석기다. 사용자 텍스트를 positive, negative, neutral 중 하나로 분류한다. confidence는 0부터 100 사이의 정수로 작성한다. reason은 한국어로 한 문장만 작성한다. 반드시 아래 JSON 형식으로 응답한다: {"sentiment": "positive | negative | neutral", "confidence": number, "reason": "string"}`
        },
        { role: "user", content: text }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content);

    if (supabase) {
      supabase.from('sentiment_logs').insert([{
        input_text: text,
        sentiment: result.sentiment,
        confidence: result.confidence,
        reason: result.reason
      }]).then(({ error }) => { if (error) console.error('Supabase Error:', error.message); });
    }

    res.json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: '분석 중 문제가 발생했습니다.' });
  }
});

// Only start the server if not running as a Vercel function
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}

module.exports = app;
