from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from modules.detection.service import detect_from_url

router = APIRouter()

class DetectRequest(BaseModel):
    image_url: str

@router.post("/image")
async def detect_disease(request: DetectRequest):
    try:
        result = detect_from_url(request.image_url)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))