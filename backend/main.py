from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from modules.detection.routes import router as detect_router
from modules.speech.routes import router as speech_router
from ml_model.loader import load_model_on_startup
import os

load_dotenv()

allowed_origins = [
    os.getenv("FRONTEND_URL", "http://localhost:3000"),
    "http://localhost:3000",
    "https://my-crop-sage-2-i.vercel.app",
]

app = FastAPI(title="MyCropSage AI Service", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    load_model_on_startup()

app.include_router(detect_router, prefix="/detect")
app.include_router(speech_router, prefix="/speech")

@app.get("/health")
def health():
    return {"status": "ok", "service": "MyCropSage AI"}