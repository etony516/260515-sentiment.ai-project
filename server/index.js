require('dotenv').config();
const express = require('express');
const path = require('path');
const { OpenAI } = require('openai');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

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
} else {
  console.warn('Supabase not configured or invalid URL, skipping log.');
}

// API Route: Analyze Sentiment
app.post('/api/analyze', async (req, res) => {
  const { text } = req.body;

  // Validation
  if (!text || typeof text !== 'string' || text.trim() === '') {
    return res.status(400).json({ error: '유효한 텍스트를 입력해주세요.' });
  }

  if (text.length > 1000) {
    return res.status(400).json({ error: '텍스트는 최대 1000자까지 입력 가능합니다.' });
  }

  try {
    // OpenAI Analysis
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // 또는 gpt-3.5-turbo 등
      messages: [
        {
          role: "system",
          content: `너는 한국어 텍스트 감성 분석기다. 
사용자 텍스트를 positive, negative, neutral 중 하나로 분류한다. 
confidence는 0부터 100 사이의 정수로 작성한다. 
reason은 한국어로 한 문장만 작성한다. 
과장하지 말고 텍스트 근거만 사용한다. 
반드시 아래 JSON 형식으로만 응답한다:
{
  "sentiment": "positive | negative | neutral",
  "confidence": number,
  "reason": "string"
}`
        },
        {
          role: "user",
          content: text
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content);

    // Log to Supabase (Async, don't wait if it fails)
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
    } else {
      console.warn('Supabase not configured, skipping log.');
    }

    res.json(result);
  } catch (error) {
    console.error('OpenAI or Server Error:', error);
    res.status(500).json({ error: '분석 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
