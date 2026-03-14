from fastapi import APIRouter, HTTPException, UploadFile, File
from fastapi.responses import Response
from pydantic import BaseModel
from modules.speech.service import (
    transcribe_audio,
    translate_text,
    text_to_speech,
    analyze_crop_query
)

router = APIRouter()

class TTSRequest(BaseModel):
    text: str
    language: str = "hi"

class TranslateRequest(BaseModel):
    text: str
    source_lang: str
    target_lang: str

class TextAnalysisRequest(BaseModel):
    text: str
    locale: str = "hi"

@router.post("/transcribe")
async def transcribe(audio: UploadFile = File(...)):
    try:
        audio_bytes = await audio.read()
        result = transcribe_audio(audio_bytes)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/tts")
async def tts(request: TTSRequest):
    try:
        audio_data = text_to_speech(request.text, request.language)
        return Response(
            content=audio_data,
            media_type="audio/mpeg"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/translate")
async def translate(request: TranslateRequest):
    try:
        translated = translate_text(
            request.text,
            request.source_lang,
            request.target_lang
        )
        return {"translated_text": translated}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analyze-text")
async def analyze_text(request: TextAnalysisRequest):
    try:
        # Translate to English for analysis
        english_text = translate_text(request.text, request.locale, "en")

        # Analyze
        advice_in_english = analyze_crop_query(english_text)

        # Translate advice back to farmer's language
        advice_in_locale = translate_text(advice_in_english, "en", request.locale)

        # Generate audio response
        audio_data = text_to_speech(advice_in_locale, request.locale)

        return {
            "original_text": request.text,
            "english_text": english_text,
            "advice": advice_in_locale,
            "advice_english": advice_in_english,
            "has_audio": True
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))