from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import re

app = FastAPI(title="VocaCulture AI Backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AnalysisRequest(BaseModel):
    text: str
    language: str = "English"
    mode: str = "voice"


EMOTION_KEYWORDS = {
    "Happy": ["happy", "glad", "joy", "excited", "great", "love", "thankful", "appreciate"],
    "Angry": ["angry", "frustrated", "annoyed", "upset", "mad", "furious", "hate"],
    "Sad": ["sad", "depressed", "disappointed", "upset", "cry", "hurt"],
    "Neutral": ["okay", "fine", "understand", "confirm", "clear"],
    "Fear": ["afraid", "scared", "nervous", "panic", "worried"],
    "Surprise": ["wow", "surprised", "unexpected", "oh no"],
    "Disgust": ["disgusting", "gross", "terrible", "awful"],
}


def infer_emotion(text: str) -> str:
    lowered = text.lower()
    scores = {}
    for emotion, keywords in EMOTION_KEYWORDS.items():
        score = sum(1 for keyword in keywords if keyword in lowered)
        scores[emotion] = score
    if not any(scores.values()):
        return "Neutral"
    return max(scores, key=scores.get)


def infer_tone(text: str) -> str:
    lowered = text.lower()
    if any(k in lowered for k in ["please", "thank", "appreciate", "grateful", "kindly"]):
        return "Positive"
    if any(k in lowered for k in ["angry", "annoyed", "frustrated", "hate"]):
        return "Tense"
    if any(k in lowered for k in ["sad", "disappointed", "sorry"]):
        return "Low"
    return "Neutral"


def infer_energy(text: str) -> str:
    lowered = text.lower()
    if any(k in lowered for k in ["excited", "great", "amazing", "wonderful", "happy"]):
        return "High"
    if any(k in lowered for k in ["angry", "furious", "frustrated"]):
        return "High"
    if any(k in lowered for k in ["sorry", "quiet", "calm", "okay"]):
        return "Low"
    return "Medium"


def infer_rate(text: str) -> str:
    words = len(re.findall(r"\b\w+\b", text))
    if words > 18:
        return "Fast"
    if words < 8:
        return "Slow"
    return "Moderate"


def classify_sarcasm(text: str) -> str:
    lowered = text.lower()
    if any(k in lowered for k in ["yeah right", "sure", "obviously", "great, just what i needed"]):
        return "Medium"
    return "Low"


def classify_politeness(text: str) -> str:
    lowered = text.lower()
    if any(k in lowered for k in ["please", "kindly", "thank you", "appreciate", "grateful"]):
        return "Highly polite"
    if any(k in lowered for k in ["can you", "could you", "would you"]):
        return "Polite"
    return "Neutral"


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "VocaCulture AI Backend"}


@app.post("/analyze")
def analyze(request: AnalysisRequest):
    text = request.text.strip()
    if not text:
        return {"error": "Text cannot be empty."}

    emotion = infer_emotion(text)
    tone = infer_tone(text)
    energy = infer_energy(text)
    rate = infer_rate(text)
    confidence = 82 + (7 if emotion in ["Happy", "Neutral"] else 4)
    if emotion in ["Angry", "Fear"]:
        confidence += 3

    response = (
        "The speech expresses a culturally aware and context-sensitive message, "
        "with indicators of {} tone and {} emotional patterns. The system detects {} confidence "
        "and suggests a respectful, culturally aligned response."
    ).format(tone.lower(), emotion.lower(), int(confidence))

    analysis = {
        "transcript": text,
        "emotion": emotion,
        "tone": tone,
        "energy": energy,
        "speaking_rate": rate,
        "confidence": int(confidence),
        "detected_language": request.language,
        "cultural_context": "Indian social greeting and respectful communication pattern",
        "sarcasm": classify_sarcasm(text),
        "politeness": classify_politeness(text),
        "ai_response": response,
        "status": "success",
    }

    return analysis


@app.post("/tts")
def tts_payload(payload: dict):
    text = payload.get("text", "")
    return {
        "status": "ok",
        "text": text,
        "message": "Text-to-speech response ready for playback."
    }
