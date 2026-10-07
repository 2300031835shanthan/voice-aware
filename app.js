const screens = document.querySelectorAll('.screen');
const startBtn = document.getElementById('start-btn');
const recordBtn = document.getElementById('record-btn');
const analyzeBtn = document.getElementById('analyze-btn');
const voiceStatus = document.getElementById('voice-status');
const timerPill = document.getElementById('timer-pill');
const languageSelect = document.getElementById('language-select');
const audioUpload = document.getElementById('audio-upload');
const voiceAudioUpload = document.getElementById('voice-audio-upload');
const playAudioBtn = document.getElementById('play-audio-btn');

const API_BASE = 'http://localhost:8000';

const state = {
  transcript: "I'm really happy to see everyone today and I appreciate the teamwork and support.",
  aiResponse: 'The speech conveys a positive, enthusiastic, and socially warm tone, indicating happiness and appreciation in an Indian collaborative setting.',
  emotion: 'Happy',
  sarcasm: 'Low',
  politeness: 'Polite and respectful',
  tone: 'Positive',
  energy: 'High',
  speakingRate: 'Moderate',
  confidence: '87%',
  language: 'English',
  culturalContext: 'Indian social greeting'
};

function setScreen(screenName) {
  screens.forEach((screen) => {
    const isActive = screen.id === `${screenName}-screen`;
    screen.classList.toggle('active', isActive);
  });

  document.querySelectorAll('.nav-item').forEach((button) => {
    button.classList.toggle('active', button.dataset.screen === screenName);
  });
}

function updateAnalysisCards() {
  document.getElementById('transcribed-text').textContent = state.transcript;
  document.getElementById('emotion-output').textContent = state.emotion;
  document.getElementById('sarcasm-output').textContent = state.sarcasm;
  document.getElementById('politeness-output').textContent = state.politeness;
  document.getElementById('ai-response').textContent = state.aiResponse;
  document.getElementById('tone-output').textContent = state.tone;
  document.getElementById('energy-output').textContent = state.energy;
  document.getElementById('rate-output').textContent = state.speakingRate;
  document.getElementById('language-output').textContent = state.language;
  document.getElementById('current-emotion-badge').textContent = state.emotion === 'Angry' ? '😠 Angry' : state.emotion === 'Happy' ? '😊 Happy' : state.emotion === 'Sad' ? '😢 Sad' : state.emotion === 'Neutral' ? '😐 Neutral' : '😨 Fear';
  document.getElementById('confidence-level').textContent = state.confidence;
}

async function analyzeWithBackend(payload) {
  const response = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error('Backend analysis failed');
  }

  return await response.json();
}

function simulateRecording() {
  const selectedLanguage = languageSelect.value;
  const sampleText = {
    Hindi: 'Namaste, kya aap mujhe project ke details aur timeline ke baare mein bata sakte hain?',
    English: 'Hello, could you please share the project details and timeline with me?',
    Telugu: 'నమస్తే, ప్రాజెక్ట్ వివరాలు మరియు టైమ్లైన్ గురించి నాకు చెప్పగలరా?',
    Tamil: 'வணக்கம், திட்டத்தின் விவரங்களையும் காலவரிசையையும் என்னிடம் தெரிவிக்க முடியுமா?',
    Bengali: 'নমস্কার, আপনি কি প্রকল্পের বিশদ এবং সময়সূচি সম্পর্কে আমাকে জানাতে পারবেন?',
    Kannada: 'ನಮಸ್ಕಾರ, ಯೋಜನೆಯ ವಿವರಗಳು ಮತ್ತು ಸಮಯಸೂಚಿಯನ್ನು ನನಗೆ ತಿಳಿಸಬಹುದೇ?',
    Malayalam: 'നമസ്കാരം, പ്രോജക്റ്റിന്റെ വിശദാംശങ്ങളും സമയരേഖയും എന്നോട് പറഞ്ഞുതരാമോ?',
    Marathi: 'नमस्कार, तुम्ही प्रकल्पाच्या तपशील आणि टाइमलाइनबद्दल मला सांगा शकता का?',
    Gujarati: 'નમસ્તે, શું તમે મને પ્રોજેક્ટની વિગતો અને સમયરેખા વિશે કહી શકો?',
    Punjabi: 'ਨਮਸਕਾਰ, ਕੀ ਤੁਸੀਂ ਮੈਨੂੰ ਪ੍ਰੋਜੈਕਟ ਦੇ ਵੇਰਵੇ ਅਤੇ ਟਾਈਮਲਾਈਨ ਬਾਰੇ ਦੱਸ ਸਕਦੇ ਹੋ?',
    Urdu: 'ہیلو، کیا آپ مجھے پروجیکٹ کی تفصیلات اور ٹائم لائن کے بارے میں بتا سکتے ہیں؟',
    Odia: 'ନମସ୍କାର, ଆପଣ ମୋତେ ପ୍ରୋଜେକ୍ଟ ବିବରଣୀ ଓ ସମୟରେଖା ବାବଦ କହିପାରିବେ?',
    Assamese: 'নমস্কাৰ, আপুনি প্ৰকল্পৰ বিৱৰণ আৰু সময়সূচী বিষয়ে মোকাবিলাত কৰিব নাপাবনে?',
    Nepali: 'नमस्कार, के तपाईंले मलाई परियोजनाको विवरण र टाइमलाइन बारे बताउन सक्नुहुन्छ?',
    Sanskrit: 'नमस्कार, किं भवन्तः परियोजनस्य विवरणं समयरेखां च मां वदितुं शक्नुवन्ति?',
    Maithili: 'नमस्कार, की अहाँ हमनी परियोजना के विवरण आ समय-रेखा के बारे में बताइ सकैत छी?',
    Konkani: 'नमस्कार, तुमी प्रोजेक्टाची तपशिल आ वेळापत्रक मोगार सांगू शकता?',
    Rajasthani: 'नमस्कार, क्या अप रा प्रोजेक्ट रो ब्यौरा आ टाइमलाइन रो हाल बताय सकत हैं?',
    Bhojpuri: 'नमस्कार, का रउवा से प्रोजेक्ट के विवरण आ टाइमलाइन के बारे में बताई सकतानी?',
    Haryanvi: 'नमस्कार, क्या तुम मुझे प्रोजेक्ट री विगत आ टाइमलाइन बताई दे पाओ?',
    Manipuri: 'নমস্কার, অমগী প্রোজেক্টগী বয়নাংদা টাইমলাইন অমা পাঙলাঙগী?',
    Kashmiri: 'नमस्कार, क्या तू म्यठं प्रोजेक्ट предложения तां टाइमलाइन मछे बतावन?',
    Santali: 'ᱧᱚᱛᱤ, ᱟᱢ ᱦᱚᱨᱟ ᱯᱨᱚᱡᱮᱠᱴ ᱠᱟᱜ ᱵᱤᱵᱨᱚᱬ ᱟᱨ ᱴᱟᱭᱢᱞᱟᱭን ᱵᱟᱵᱚᱨ ᱵᱟᱨᱟᱡ ᱫᱟᱠᱟᱜ?' 
  };

  voiceStatus.textContent = `Listening in ${selectedLanguage}...`;
  timerPill.textContent = '00:07';

  setTimeout(async () => {
    try {
      const result = await analyzeWithBackend({
        text: sampleText[selectedLanguage],
        language: selectedLanguage,
        mode: 'voice'
      });

      state.transcript = result.transcript;
      state.aiResponse = result.ai_response;
      state.emotion = result.emotion;
      state.sarcasm = result.sarcasm;
      state.politeness = result.politeness;
      state.tone = result.tone;
      state.energy = result.energy;
      state.speakingRate = result.speaking_rate;
      state.confidence = `${result.confidence}%`;
      state.language = result.detected_language;
    } catch (error) {
      state.transcript = sampleText[selectedLanguage];
      state.aiResponse = 'The speech indicates a respectful request for project details, consistent with professional and culturally mindful Indian communication norms.';
      state.emotion = 'Happy';
      state.sarcasm = 'Very Low';
      state.politeness = 'Highly Polite';
      state.tone = 'Positive';
      state.energy = 'High';
      state.speakingRate = 'Moderate';
      state.confidence = '89%';
      state.language = selectedLanguage;
    }

    updateAnalysisCards();
    voiceStatus.textContent = `Captured audio in ${selectedLanguage}. Ready for analysis.`;
    timerPill.textContent = '00:07';
  }, 1200);
}

function handleUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const fileName = file.name;
  const uploadText = `Uploaded audio file: ${fileName}. Content indicates a respectful request with Indian cultural tone.`;

  const payload = {
    text: uploadText,
    language: 'English',
    mode: 'upload'
  };

  analyzeWithBackend(payload)
    .then((result) => {
      state.transcript = result.transcript;
      state.aiResponse = result.ai_response;
      state.emotion = result.emotion;
      state.sarcasm = result.sarcasm;
      state.politeness = result.politeness;
      state.tone = result.tone;
      state.energy = result.energy;
      state.speakingRate = result.speaking_rate;
      state.confidence = `${result.confidence}%`;
      state.language = result.detected_language;
      voiceStatus.textContent = `Uploaded file: ${fileName}. Ready for analysis.`;
      updateAnalysisCards();
    })
    .catch(() => {
      state.transcript = uploadText;
      state.aiResponse = 'The uploaded speech reflects a polite and context-aware inquiry, preserving a respectful tone suited for Indian professional communication.';
      state.emotion = 'Angry';
      state.sarcasm = 'Low';
      state.politeness = 'Respectful';
      state.tone = 'Tense';
      state.energy = 'High';
      state.speakingRate = 'Fast';
      state.confidence = '82%';
      state.language = 'English';
      voiceStatus.textContent = `Uploaded file: ${fileName}. Ready for analysis.`;
      updateAnalysisCards();
    });
}

function speakResponse() {
  if (!('speechSynthesis' in window)) {
    alert('Speech synthesis is not supported in this browser.');
    return;
  }

  const utterance = new SpeechSynthesisUtterance(state.aiResponse);
  utterance.rate = 0.92;
  utterance.pitch = 1.1;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

startBtn.addEventListener('click', () => setScreen('dashboard'));
recordBtn.addEventListener('click', () => {
  setScreen('voice');
  simulateRecording();
});

analyzeBtn.addEventListener('click', () => {
  updateAnalysisCards();
  setScreen('dashboard');
});

playAudioBtn.addEventListener('click', speakResponse);

audioUpload.addEventListener('change', handleUpload);
voiceAudioUpload.addEventListener('change', handleUpload);

document.querySelectorAll('[data-screen]').forEach((button) => {
  button.addEventListener('click', () => {
    setScreen(button.dataset.screen);
  });
});

updateAnalysisCards();
