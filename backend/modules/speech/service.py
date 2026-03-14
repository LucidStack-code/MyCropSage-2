import whisper
import tempfile
import os
from gtts import gTTS
from deep_translator import GoogleTranslator

# Singletons
_whisper_model = None

def get_whisper():
    global _whisper_model
    if _whisper_model is None:
        print("Loading Whisper model...")
        _whisper_model = whisper.load_model("small")
        print("Whisper loaded!")
    return _whisper_model

def transcribe_audio(audio_bytes: bytes) -> dict:
    # Save audio to temp file
    with tempfile.NamedTemporaryFile(
        delete=False, suffix=".webm"
    ) as tmp:
        tmp.write(audio_bytes)
        tmp_path = tmp.name

    try:
        result = get_whisper().transcribe(tmp_path)
        return {
            "text": result["text"].strip(),
            "language": result["language"]
        }
    finally:
        os.unlink(tmp_path)

def translate_text(text: str, source_lang: str, target_lang: str) -> str:
    if source_lang == target_lang:
        return text
    try:
        translated = GoogleTranslator(
            source=source_lang,
            target=target_lang
        ).translate(text)
        return translated
    except Exception as e:
        print(f"Translation error: {e}")
        return text

def text_to_speech(text: str, lang: str) -> bytes:
    # Map locale codes to gTTS language codes
    lang_map = {
        "hi": "hi",
        "mr": "mr",
        "te": "te",
        "ta": "ta",
        "en": "en"
    }
    gtts_lang = lang_map.get(lang, "hi")

    tts = gTTS(text=text, lang=gtts_lang, slow=False)

    with tempfile.NamedTemporaryFile(
        delete=False, suffix=".mp3"
    ) as tmp:
        tts.save(tmp.name)
        with open(tmp.name, "rb") as f:
            audio_data = f.read()

    os.unlink(tmp.name)
    return audio_data

def analyze_crop_query(text_in_english: str) -> str:
    """
    Simple keyword-based crop analysis.
    In Phase 6+ this can be replaced with GPT or a better NLP model.
    """
    text = text_in_english.lower()

    if any(word in text for word in ["yellow", "yellowing", "pale"]):
        return "Yellowing leaves can indicate nitrogen deficiency or early blight. Check soil nutrients and inspect leaves for spots."

    if any(word in text for word in ["spot", "spots", "brown spot", "black spot"]):
        return "Spots on leaves usually indicate fungal infection. Apply copper-based fungicide and remove affected leaves immediately."

    if any(word in text for word in ["wilt", "wilting", "drooping"]):
        return "Wilting can be caused by root rot, lack of water, or bacterial wilt. Check soil moisture and root health."

    if any(word in text for word in ["white", "powder", "powdery"]):
        return "Powdery white coating indicates powdery mildew. Apply sulfur-based fungicide and improve air circulation."

    if any(word in text for word in ["insect", "bug", "pest", "holes"]):
        return "Pest damage detected. Inspect the underside of leaves. Apply neem oil spray or appropriate pesticide."

    if any(word in text for word in ["rot", "rotten", "decay"]):
        return "Rotting suggests fungal or bacterial disease. Remove affected parts immediately and improve drainage."

    if any(word in text for word in ["healthy", "good", "fine", "normal"]):
        return "Your crop appears healthy! Continue regular monitoring and maintain good farming practices."

    return "Based on your description, I recommend consulting a local agronomist for a detailed inspection. Meanwhile, ensure proper irrigation, fertilization, and monitor for pests."