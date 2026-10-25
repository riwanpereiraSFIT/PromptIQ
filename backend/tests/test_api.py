import os
import unittest
from fastapi.testclient import TestClient

os.environ["PYTHONUTF8"] = "1"

from app.main import app
from app.model_service import get_model_service


class TestPromptIQAPI(unittest.TestCase):
    def setUp(self):
        self.service = get_model_service()
        self.service.load_model()
        self.client_ctx = TestClient(app)
        self.client = self.client_ctx.__enter__()

    def tearDown(self):
        self.client_ctx.__exit__(None, None, None)

    def test_health_endpoint(self):
        response = self.client.get("/api/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "operational")
        self.assertTrue(data["model_loaded"])
        self.assertIn("BiLSTM", data["model_identifier"])

    def test_model_info_endpoint(self):
        response = self.client.get("/api/model-info")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["model_name"], "BiLSTM Prompt Quality Evaluator")
        self.assertEqual(data["architecture_details"]["vocabulary_limit"], 5000)
        self.assertEqual(data["architecture_details"]["sequence_length"], 120)
        self.assertEqual(data["architecture_details"]["embedding_dimension"], 64)
        self.assertEqual(data["architecture_details"]["bilstm_units"], 32)
        self.assertEqual(data["headline_metrics"]["MAE"], 0.6584)

    def test_metrics_endpoint(self):
        response = self.client.get("/api/metrics")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["best_model"], "BiLSTM")
        self.assertEqual(len(data["records"]), 5)
        self.assertEqual(data["records"][0]["model"], "BiLSTM")
        self.assertAlmostEqual(data["records"][0]["mae"], 0.6584, places=4)

    def test_predict_endpoint_valid_prompt(self):
        prompt = "Explain machine learning to beginners with examples."
        response = self.client.post("/api/predict", json={"prompt": prompt})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("predicted_score", data)
        self.assertIsInstance(data["predicted_score"], float)
        self.assertGreater(data["predicted_score"], 0)
        self.assertEqual(data["model"], "BiLSTM")
        self.assertEqual(data["observed_dataset_range"]["min"], 1.0)
        self.assertEqual(data["observed_dataset_range"]["max"], 9.35)
        self.assertIsInstance(data["suggestions"], list)
        self.assertIn("analysis", data)
        self.assertEqual(data["analysis"]["word_count"], 7)

    def test_predict_endpoint_empty_prompt_validation(self):
        response = self.client.post("/api/predict", json={"prompt": ""})
        self.assertEqual(response.status_code, 422)

        response_ws = self.client.post("/api/predict", json={"prompt": "    "})
        self.assertEqual(response_ws.status_code, 422)

    def test_compare_endpoint(self):
        payload = {
            "original_prompt": "Explain AI.",
            "revised_prompt": "Act as an AI professor. Explain AI to undergraduate engineers with 2 practical industry examples."
        }
        response = self.client.post("/api/compare", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("original_score", data)
        self.assertIn("revised_score", data)
        self.assertIn("score_diff", data)
        self.assertAlmostEqual(
            data["score_diff"],
            data["revised_score"] - data["original_score"],
            places=4
        )
        self.assertIsInstance(data["original_suggestions"], list)
        self.assertIsInstance(data["revised_suggestions"], list)


if __name__ == "__main__":
    unittest.main()
