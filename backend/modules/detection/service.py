import torch
import torchvision.transforms as transforms
from PIL import Image
import requests
import io
from ml_model.loader import get_model, get_class_names
from ml_model.treatments import TREATMENTS, PREVENTION

TRANSFORM = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])

def detect_from_url(image_url: str) -> dict:
    # Fetch image from Cloudinary URL
    response = requests.get(
    image_url,
    timeout=10,
    headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
)
    response.raise_for_status()

    img = Image.open(io.BytesIO(response.content)).convert("RGB")
    tensor = TRANSFORM(img).unsqueeze(0)

    with torch.no_grad():
        outputs = get_model()(tensor)
        probs = torch.softmax(outputs, dim=1)
        confidence, idx = probs.max(dim=1)

    class_names = get_class_names()
    disease_name = class_names[idx.item()]
    confidence_pct = round(confidence.item() * 100, 2)

    return {
        "disease_name": disease_name,
        "confidence": confidence_pct,
        "treatment": TREATMENTS.get(disease_name, "Consult your local agronomist."),
        "prevention": PREVENTION.get(disease_name, "Practice good crop hygiene and regular monitoring.")
    }