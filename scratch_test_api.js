require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testModels() {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.error("No GOOGLE_API_KEY found in .env");
    return;
  }
  
  console.log("Testing API with key starting with:", apiKey.substring(0, 10) + "...");
  const genAI = new GoogleGenerativeAI(apiKey);

  const modelsToTest = ["gemini-1.5-flash", "gemini-1.5-pro", "gemma-4-31b-it", "gemma-4-e4b-it"];

  for (const modelName of modelsToTest) {
    console.log(`\n--- Testing ${modelName} ---`);
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("안녕하세요. 테스트입니다.");
      console.log("SUCCESS. Response:", result.response.text().trim());
    } catch (e) {
      console.error(`ERROR (${e.status}):`, e.message);
    }
  }
}

testModels();
