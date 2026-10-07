# VocaCulture AI

VocaCulture AI is a product-style prototype for voice-aware Indian cultural intelligence. It focuses on understanding spoken language, emotional tone, cultural context, and respectful response generation for Indian communication patterns.

## Included screens

- Landing / login screen
- Dashboard with voice analysis overview
- Voice recording interface with waveform-inspired visuals
- Analytics page with model metrics
- Research / pipeline architecture page
- AI interpretation and response panel

## Run locally

Start the backend first:

```bash
cd "c:\Users\SRI HANUMAN\OneDrive\Desktop\voice-aware"
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
```

Then start the frontend in a second terminal:

```bash
cd "c:\Users\SRI HANUMAN\OneDrive\Desktop\voice-aware"
node server.js
```

Open:

```text
http://localhost:3000
```

## Project files

- `index.html` — product-style landing, dashboard, analytics, and research page layout
- `style.css` — modern dark UI with polished panels, cards, lighting, and waveform styling
- `app.js` — navigation, recording simulation, and backend API calls
- `server.js` — minimal static web server for the frontend
- `backend/main.py` — FastAPI backend for emotion, tone, language, and cultural analysis
- `backend/requirements.txt` — Python dependencies for the API

## Prototype flow

```text
Frontend -> Voice / Audio Input -> FastAPI analysis layer -> emotion / tone / sarcasm / cultural heuristics -> response output
```

This version demonstrates the intended research pipeline in a lightweight way. The current implementation uses a working backend logic layer for demo analysis, rather than full production-grade ASR or deep learning models.
