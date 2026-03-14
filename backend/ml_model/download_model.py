import urllib.request
import os

print("Downloading plant disease model...")

urls = [
    "https://huggingface.co/linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification/resolve/main/pytorch_model.bin",
    "https://github.com/spMohanty/PlantVillage-Dataset/raw/master/raw/color/model.pth",
]

os.makedirs("ml_model", exist_ok=True)
output_path = "ml_model/plant_disease_model.pth"

# Try downloading from HuggingFace with proper headers
import urllib.request

req = urllib.request.Request(
    "https://huggingface.co/linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification/resolve/main/pytorch_model.bin",
    headers={"User-Agent": "Mozilla/5.0"}
)

try:
    with urllib.request.urlopen(req) as response:
        data = response.read()
        with open(output_path, "wb") as f:
            f.write(data)
    print(f"Downloaded successfully to {output_path}")
except Exception as e:
    print(f"Failed: {e}")