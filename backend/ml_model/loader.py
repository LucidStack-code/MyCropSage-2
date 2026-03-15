import torch
import torchvision.models as models
import torch.nn as nn
import json
import os

_model = None
_class_names = None

def load_model_on_startup():
    global _model, _class_names

    model_path = os.getenv("MODEL_PATH", "./ml_model/plant_disease_model.pth")
    class_names_path = "./ml_model/class_names.json"

    print(f"Loading trained model from {model_path}...")

    # Load class names
    with open(class_names_path) as f:
        _class_names = json.load(f)

    num_classes = len(_class_names)

    # Build exact same architecture used during training
    model = models.mobilenet_v2(weights=None)
    model.classifier[1] = nn.Linear(1280, num_classes)

    # Load trained weights with strict=True
    state_dict = torch.load(model_path, map_location=torch.device("cpu"))
    model.load_state_dict(state_dict, strict=True)
    model.eval()

    _model = model
    print(f"✅ Model loaded successfully — {num_classes} classes, 99.30% accuracy")

def get_model():
    return _model

def get_class_names():
    return _class_names
