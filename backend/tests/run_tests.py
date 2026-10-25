import os
import sys

os.environ["PYTHONUTF8"] = "1"
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.model_service import get_model_service
from app.feedback import analyze_prompt_structure, generate_independent_suggestions, generate_suggested_template
from app.schemas import PredictRequest, CompareRequest
from pydantic import ValidationError


def test_model_loading_and_prediction():
    print("Test 1: Model Loading and Real Inference...")
    service = get_model_service()
    loaded = service.load_model()
    assert loaded, f"Model failed to load: {service.load_error}"
    assert service.is_loaded

    # Test Basic Prompt
    p1 = "Explain machine learning."
    score1, in_range1 = service.predict(p1)
    print(f"  Basic prompt score: {score1:.4f} (in range: {in_range1})")
    assert isinstance(score1, float)
    assert 1.0 <= score1 <= 10.0

    # Test Intermediate Prompt
    p2 = "Explain machine learning to beginners with examples."
    score2, in_range2 = service.predict(p2)
    print(f"  Intermediate prompt score: {score2:.4f} (in range: {in_range2})")
    assert isinstance(score2, float)

    # Test Detailed Prompt
    p3 = (
        "Act as a machine learning instructor. Explain supervised and unsupervised learning "
        "to first-year engineering students using simple language, two real-world examples, "
        "and a comparison table."
    )
    score3, in_range3 = service.predict(p3)
    print(f"  Detailed prompt score: {score3:.4f} (in range: {in_range3})")
    assert isinstance(score3, float)
    assert score3 > score1, "Detailed prompt should score higher than basic prompt"
    print("  [PASSED] Model Loading & Real Inference\n")


def test_schema_validations():
    print("Test 2: Request Schema & Input Validations...")
    # Empty prompt
    try:
        PredictRequest(prompt="")
        assert False, "Should have failed on empty prompt"
    except (ValidationError, ValueError):
        pass

    # Whitespace-only prompt
    try:
        PredictRequest(prompt="    \t\n  ")
        assert False, "Should have failed on whitespace prompt"
    except (ValidationError, ValueError):
        pass

    # Valid prompt
    req = PredictRequest(prompt="Valid prompt for testing.")
    assert req.prompt == "Valid prompt for testing."

    # Compare request whitespace check
    try:
        CompareRequest(original_prompt="AI", revised_prompt="   ")
        assert False, "Should have failed on whitespace revised prompt"
    except (ValidationError, ValueError):
        pass

    print("  [PASSED] Schema & Input Validations\n")


def test_independent_feedback_engine():
    print("Test 3: Feedback & Suggestion Engine...")
    short_prompt = "Explain AI"
    analysis_short = analyze_prompt_structure(short_prompt)
    assert analysis_short.word_count == 2
    assert analysis_short.structural_breadth == "Minimal"
    suggestions_short = generate_independent_suggestions(short_prompt, analysis_short)
    assert any("brief" in s.lower() for s in suggestions_short)

    detailed_prompt = (
        "Act as a computer science professor. Explain transformer neural networks "
        "to undergraduate students using simple analogies, 2 practical examples, "
        "and format as a markdown table under 300 words."
    )
    analysis_det = analyze_prompt_structure(detailed_prompt)
    assert analysis_det.has_role_or_context
    assert analysis_det.has_task_instruction
    assert analysis_det.has_audience
    assert analysis_det.has_format_specification
    assert analysis_det.has_constraints
    assert analysis_det.has_examples_request
    assert analysis_det.structural_breadth == "Comprehensive"

    template = generate_suggested_template("Write a python unit test", analysis_short)
    assert "Act as a domain expert" in template
    print("  [PASSED] Independent Feedback Engine\n")


def run_all():
    print("========================================")
    print("      RUNNING PROMPTIQ BACKEND TESTS    ")
    print("========================================\n")
    test_model_loading_and_prediction()
    test_schema_validations()
    test_independent_feedback_engine()
    print("========================================")
    print("      ALL BACKEND TESTS PASSED (3/3)    ")
    print("========================================")


if __name__ == "__main__":
    run_all()
