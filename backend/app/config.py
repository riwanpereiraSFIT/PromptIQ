import os
from pathlib import Path
from typing import List

# Base directories
BASE_DIR = Path(__file__).resolve().parent.parent
WORKSPACE_DIR = BASE_DIR.parent
FRONTEND_DIST_DIR = WORKSPACE_DIR / "frontend" / "dist"

# Configurable Model Path
# Check environment variable first, then backend/models, then workspace root
DEFAULT_MODEL_PATH = BASE_DIR / "models" / "best_pels_bilstm_model.keras"
FALLBACK_MODEL_PATH = WORKSPACE_DIR / "best_pels_bilstm_model.keras"

MODEL_PATH_ENV = os.getenv("PROMPTIQ_MODEL_PATH")
if MODEL_PATH_ENV:
    MODEL_PATH = Path(MODEL_PATH_ENV)
elif DEFAULT_MODEL_PATH.exists():
    MODEL_PATH = DEFAULT_MODEL_PATH
elif FALLBACK_MODEL_PATH.exists():
    MODEL_PATH = FALLBACK_MODEL_PATH
else:
    MODEL_PATH = DEFAULT_MODEL_PATH

# Observed dataset bounds from the PELS training dataset
OBSERVED_SCORE_MIN = 1.0
OBSERVED_SCORE_MAX = 9.35

# Input validation bounds
MIN_PROMPT_LENGTH = 3
MAX_PROMPT_LENGTH = 5000

# CORS Origins
ALLOWED_ORIGINS: List[str] = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:4173",
    "http://127.0.0.1:4173",
]

# Additional environment settings
API_TITLE = "PromptIQ Evaluation API"
API_VERSION = "1.0.0"
