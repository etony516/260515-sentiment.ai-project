document.addEventListener('DOMContentLoaded', () => {
  const textInput = document.getElementById('text-input');
  const analyzeBtn = document.getElementById('analyze-btn');
  const resultArea = document.getElementById('result-area');
  const sentimentDisplay = document.getElementById('sentiment-display');
  const confidenceDisplay = document.getElementById('confidence-display');
  const reasonDisplay = document.getElementById('reason-display');
  const errorBox = document.getElementById('error-box');
  const loader = document.getElementById('loader');

  const sentimentMap = {
    'positive': '긍정',
    'negative': '부정',
    'neutral': '중립'
  };

  analyzeBtn.addEventListener('click', async () => {
    const text = textInput.value.trim();

    // Reset UI
    errorBox.classList.add('hidden');
    resultArea.classList.add('hidden');
    
    if (!text) {
      showError('분석할 문장을 입력해주세요.');
      return;
    }

    try {
      // Set Loading State
      setLoading(true);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text })
      });

      const data = await response.json();

      if (!response.ok) {
        // Log details to console for developers
        if (data.details) console.error('API Error Details:', data.details);
        throw new Error(data.error || '분석 중 오류가 발생했습니다.');
      }

      // Display Result
      displayResult(data);
    } catch (error) {
      console.error('Error:', error);
      showError(error.message);
    } finally {
      setLoading(false);
    }
  });

  function setLoading(isLoading) {
    if (isLoading) {
      analyzeBtn.disabled = true;
      analyzeBtn.textContent = '분석 중...';
      loader.classList.remove('hidden');
    } else {
      analyzeBtn.disabled = false;
      analyzeBtn.textContent = '분석하기';
      loader.classList.add('hidden');
    }
  }

  function displayResult(data) {
    const confidenceBar = document.getElementById('confidence-bar');
    
    sentimentDisplay.textContent = sentimentMap[data.sentiment] || '알 수 없음';
    confidenceDisplay.textContent = `${data.confidence}%`;
    reasonDisplay.textContent = data.reason;

    // Animate bar
    confidenceBar.style.width = '0%';
    setTimeout(() => {
      confidenceBar.style.width = `${data.confidence}%`;
    }, 100);

    // Color logic
    const color = getSentimentColor(data.sentiment);
    sentimentDisplay.style.color = color;
    confidenceBar.style.backgroundColor = color;

    resultArea.classList.remove('hidden');
    resultArea.scrollIntoView({ behavior: 'smooth' });
  }

  function showError(message) {
    errorBox.textContent = message;
    errorBox.classList.remove('hidden');
  }

  function getSentimentColor(sentiment) {
    switch(sentiment) {
      case 'positive': return '#10b981'; // Emerald
      case 'negative': return '#ef4444'; // Rose
      case 'neutral': return '#f59e0b';  // Amber
      default: return '#6366f1';        // Indigo
    }
  }
});
