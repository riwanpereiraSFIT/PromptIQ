import os
os.environ.setdefault("PYTHONUTF8", "1")

import logging
import math
from pathlib import Path
from typing import Optional, Tuple
import numpy as np
from app.config import MODEL_PATH, OBSERVED_SCORE_MIN, OBSERVED_SCORE_MAX

logger = logging.getLogger("promptiq.model_service")

class ModelService:
    """
    Singleton service managing the trained TensorFlow/Keras BiLSTM model.
    Accepts raw string prompts without manual tokenization (TextVectorization
    is embedded directly within the saved Keras model).
    """

    _instance: Optional["ModelService"] = None

    def __init__(self):
        self.model = None
        self.is_loaded: bool = False
        self.model_path: Path = MODEL_PATH
        self.load_error: Optional[str] = None
        self.model_summary_str: Optional[str] = None

    @classmethod
    def get_instance(cls) -> "ModelService":
        if cls._instance is None:
            cls._instance = ModelService()
        return cls._instance

    def load_model(self) -> bool:
        """
        Loads the trained Keras model from disk.
        Returns True if successful, False otherwise.
        """
        if self.is_loaded and self.model is not None:
            return True

        logger.info(f"Attempting to load model from: {self.model_path}")
        if not self.model_path.exists():
            self.is_loaded = False
            self.load_error = (
                f"Model file not found at '{self.model_path}'. Please ensure "
                "best_pels_bilstm_model.keras is placed in backend/models/."
            )
            logger.warning(self.load_error)
            return False

        try:
            # Import tensorflow inside the loader to keep startup flexible
            import tensorflow as tf

            # Force CPU inference for consistent, reliable execution
            try:
                tf.config.set_visible_devices([], 'GPU')
            except Exception:
                pass

            # Load without compilation since we only perform regression inference
            self.model = tf.keras.models.load_model(
                str(self.model_path),
                compile=False
            )
            self.is_loaded = True
            self.load_error = None
            logger.info("Successfully loaded BiLSTM Keras model for inference.")
            return True

        except Exception as exc:
            self.is_loaded = False
            self.load_error = f"Failed to load Keras model: {type(exc).__name__}: {str(exc)}"
            logger.error(self.load_error, exc_info=True)
            return False

    def predict(self, prompt: str) -> Tuple[float, bool]:
        """
        Executes real inference on a user prompt string.
        Returns (predicted_score: float, is_within_observed_range: bool).
        Raises RuntimeError if model is not loaded, or ValueError on invalid outputs.
        """
        if not self.is_loaded or self.model is None:
            raise RuntimeError(
                "Prediction is temporarily unavailable because the trained model has not been loaded."
            )

        # Build numpy input array with dtype=object to support raw strings
        # matching the training notebook specification
        input_array = np.array([prompt], dtype=object)

        try:
            raw_prediction = self.model.predict(input_array, verbose=0)
            score_val = float(raw_prediction[0][0])

            if math.isnan(score_val) or math.isinf(score_val):
                raise ValueError("Model inference produced an invalid numerical value (NaN or Inf).")

            is_within_range = (OBSERVED_SCORE_MIN <= score_val <= OBSERVED_SCORE_MAX)
            return score_val, is_within_range

        except Exception as exc:
            logger.error(f"Inference error on prompt: {exc}")
            raise


# Global singleton helper
def get_model_service() -> ModelService:
    return ModelService.get_instance()
