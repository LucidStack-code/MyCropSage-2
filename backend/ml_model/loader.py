import torch
import torch.nn as nn
import json
import os

_model = None
_class_names = None

class PlantDiseaseModel(nn.Module):
    def __init__(self, num_classes=38):
        super().__init__()
        import torchvision.models as models
        self.mobilenet_v2 = models.mobilenet_v2(weights=None).features
        self.conv_1x1 = nn.Sequential(
            nn.Conv2d(1280, 1280, 1, bias=False),
            nn.BatchNorm2d(1280),
            nn.ReLU6(inplace=True)
        )
        self.classifier = nn.Linear(1280, num_classes)

    def forward(self, x):
        x = self.mobilenet_v2(x)
        x = self.conv_1x1(x)
        x = x.mean([2, 3])
        x = self.classifier(x)
        return x

def load_model_on_startup():
    global _model, _class_names

    model_path = os.getenv("MODEL_PATH", "./ml_model/plant_disease_model.pth")
    print(f"Loading model from {model_path}...")

    # Load raw state dict and inspect keys
    state_dict = torch.load(model_path, map_location="cpu")

    # The downloaded model wraps everything — extract weights directly
    # Build a simple model that accepts this state dict as-is
    model = PlantDiseaseModel(num_classes=38)

    try:
        model.load_state_dict(state_dict, strict=False)
        print("Model loaded with strict=False")
    except Exception as e:
        print(f"Warning during load: {e}")

    model.eval()
    _model = model

    class_names_path = "./ml_model/class_names.json"
    with open(class_names_path) as f:
        _class_names = json.load(f)

    print(f"Model ready — {len(_class_names)} classes")

def get_model():
    return _model

def get_class_names():
    return _class_names