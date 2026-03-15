from fastapi import APIRouter, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel
from modules.speech.service import translate_text, text_to_speech, analyze_crop_query

router = APIRouter()

class TTSRequest(BaseModel):
    text: str
    language: str = "en"

class TranslateRequest(BaseModel):
    text: str
    source_lang: str
    target_lang: str

class TextAnalysisRequest(BaseModel):
    text: str
    locale: str = "en"

@router.post("/tts")
async def tts(request: TTSRequest):
    try:
        audio_data = text_to_speech(request.text, request.language)
        return Response(content=audio_data, media_type="audio/mpeg")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/translate")
async def translate(request: TranslateRequest):
    try:
        translated = translate_text(request.text, request.source_lang, request.target_lang)
        return {"translated_text": translated}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analyze-text")
async def analyze_text(request: TextAnalysisRequest):
    try:
        english_text = translate_text(request.text, request.locale, "en")
        advice_english = analyze_crop_query(english_text)
        advice_locale = translate_text(advice_english, "en", request.locale)
        audio_data = text_to_speech(advice_locale, request.locale)
        return {
            "original_text": request.text,
            "english_text": english_text,
            "advice": advice_locale,
            "advice_english": advice_english,
            "has_audio": True
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))