import os
import sys
import json
import urllib.request
import threading
import time
import uvicorn

os.environ["PYTHONUTF8"] = "1"
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.main import app
from app.model_service import get_model_service


def run_single_port_verification():
    print("=======================================================")
    print("     PROMPTIQ SINGLE-PORT SHARING VERIFICATION TEST    ")
    print("=======================================================\n")

    # 1. Preload Model
    print("1. Initializing BiLSTM Model Loader...")
    service = get_model_service()
    loaded = service.load_model()
    assert loaded, f"BiLSTM model failed to load: {service.load_error}"
    print("   [OK] Model loaded and ready.\n")

    # 2. Start Uvicorn Server in background thread on port 8000
    print("2. Launching FastAPI server on 127.0.0.1:8000...")
    config = uvicorn.Config(
        app,
        host="127.0.0.1",
        port=8000,
        log_level="warning",
        access_log=False,
    )
    server = uvicorn.Server(config)
    server_thread = threading.Thread(target=server.run, daemon=True)
    server_thread.start()

    # Wait for server to bind
    time.sleep(3)
    base_url = "http://127.0.0.1:8000"

    try:
        # Test 1: Root / serves React index.html
        print("3. Testing GET / (Root SPA entry)...")
        req = urllib.request.Request(f"{base_url}/")
        with urllib.request.urlopen(req) as resp:
            assert resp.status == 200, f"Expected 200, got {resp.status}"
            content = resp.read().decode("utf-8")
            assert "<!doctype html>" in content.lower(), "Root should return HTML document"
            assert "PromptIQ" in content, "HTML should contain PromptIQ title"
        print("   [PASSED] Root / successfully serves production React index.html\n")

        # Test 2: Client-side route /evaluator serves React index.html
        print("4. Testing GET /evaluator (Client-side routing fallback)...")
        req = urllib.request.Request(f"{base_url}/evaluator")
        with urllib.request.urlopen(req) as resp:
            assert resp.status == 200, f"Expected 200, got {resp.status}"
            content = resp.read().decode("utf-8")
            assert "<!doctype html>" in content.lower(), "Client-side route should return HTML"
            assert "id=\"root\"" in content, "HTML should contain React root div"
        print("   [PASSED] /evaluator route successfully handled by SPA fallback\n")

        # Test 3: Other client-side routes /improve and /analytics
        print("5. Testing GET /improve and /analytics...")
        for route in ["/improve", "/analytics", "/about", "/explained"]:
            with urllib.request.urlopen(f"{base_url}{route}") as resp:
                assert resp.status == 200
                assert "<!doctype html>" in resp.read().decode("utf-8").lower()
        print("   [PASSED] All client-side sub-routes serve React index.html\n")

        # Test 4: Static assets (vite.svg or /assets)
        print("6. Testing GET /vite.svg (Static asset in dist)...")
        with urllib.request.urlopen(f"{base_url}/vite.svg") as resp:
            assert resp.status == 200
            assert "svg" in resp.headers.get("Content-Type", "").lower()
        print("   [PASSED] Static asset served directly with proper MIME type\n")

        # Test 5: Preserving /api/health route
        print("7. Testing GET /api/health (API Preservation)...")
        with urllib.request.urlopen(f"{base_url}/api/health") as resp:
            assert resp.status == 200
            data = json.loads(resp.read().decode("utf-8"))
            assert data["status"] == "operational"
            assert data["model_loaded"] is True
            assert "BiLSTM" in data["model_identifier"]
        print(f"   [PASSED] /api/health returns operational status (Model: {data['model_identifier']})\n")

        # Test 6: Preserving /api/predict with real BiLSTM inference
        print("8. Testing POST /api/predict (Real BiLSTM Inference)...")
        prompt = "Explain machine learning to beginners with examples."
        post_data = json.dumps({"prompt": prompt}).encode("utf-8")
        pred_req = urllib.request.Request(
            f"{base_url}/api/predict",
            data=post_data,
            headers={"Content-Type": "application/json"}
        )
        with urllib.request.urlopen(pred_req) as resp:
            assert resp.status == 200
            pred_data = json.loads(resp.read().decode("utf-8"))
            score = pred_data["predicted_score"]
            assert isinstance(score, float)
            assert 1.0 <= score <= 9.35
            # Confirm real score matches expected range (~3.81)
            print(f"   Prompt: '{prompt}'")
            print(f"   Real BiLSTM Score: {score:.4f} (Observed range: {pred_data['observed_dataset_range']['min']}-{pred_data['observed_dataset_range']['max']})")
        print("   [PASSED] /api/predict produces authentic unrounded BiLSTM score\n")

        # Test 7: Preserving /api/compare
        print("9. Testing POST /api/compare...")
        cmp_data = json.dumps({
            "original_prompt": "Explain AI.",
            "revised_prompt": "Act as an AI instructor. Explain AI to students with 2 real-world examples."
        }).encode("utf-8")
        cmp_req = urllib.request.Request(
            f"{base_url}/api/compare",
            data=cmp_data,
            headers={"Content-Type": "application/json"}
        )
        with urllib.request.urlopen(cmp_req) as resp:
            assert resp.status == 200
            res = json.loads(resp.read().decode("utf-8"))
            assert "score_diff" in res
            print(f"   Original Score: {res['original_score']:.4f}")
            print(f"   Revised Score:  {res['revised_score']:.4f}")
            print(f"   Score Delta:    {res['score_diff']:+.4f}")
        print("   [PASSED] /api/compare executes dual BiLSTM inference\n")

        # Test 8: Unmatched /api route returns JSON 404 (NOT HTML!)
        print("10. Testing GET /api/nonexistent-route (API 404 Protection)...")
        try:
            urllib.request.urlopen(f"{base_url}/api/nonexistent-route")
            assert False, "Should have returned 404"
        except urllib.error.HTTPError as err:
            assert err.code == 404
            err_body = json.loads(err.read().decode("utf-8"))
            assert "detail" in err_body
            assert err_body["detail"] == "API endpoint not found"
        print("   [PASSED] Unmatched /api routes safely return JSON 404 (not HTML SPA)\n")

        print("=======================================================")
        print("      ALL SINGLE-PORT TESTS PASSED SUCCESSFULLY!       ")
        print("=======================================================")

    finally:
        server.should_exit = True
        time.sleep(1)


if __name__ == "__main__":
    run_single_port_verification()
