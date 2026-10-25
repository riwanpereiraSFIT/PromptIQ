import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles

from app.config import (
    ALLOWED_ORIGINS,
    API_TITLE,
    API_VERSION,
    MODEL_PATH,
    OBSERVED_SCORE_MIN,
    OBSERVED_SCORE_MAX,
    FRONTEND_DIST_DIR,
)
from app.model_service import get_model_service
from app.feedback import (
    analyze_prompt_structure,
    generate_independent_suggestions,
    generate_suggested_template,
)
from app.schemas import (
    HealthResponse,
    PredictRequest,
    PredictResponse,
    CompareRequest,
    CompareResponse,
    ObservedRange,
    ModelInfoResponse,
    ModelArchitectureInfo,
    DatasetInfo,
    MetricsResponse,
    ModelComparisonRecord,
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("promptiq.api")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: attempt to load the trained Keras BiLSTM model
    service = get_model_service()
    loaded = service.load_model()
    if loaded:
        logger.info(f"Model successfully initialized from {service.model_path}")
    else:
        logger.warning(
            f"Model not loaded at startup: {service.load_error}. "
            "Evaluation endpoints will return 503 until model is supplied."
        )
    yield
    # Shutdown clean up if any
    logger.info("PromptIQ API shutting down.")


app = FastAPI(
    title=API_TITLE,
    version=API_VERSION,
    description="Backend API for Deep Learning-Based Prompt Quality Assessment and Improvement System",
    lifespan=lifespan,
)

# CORS middleware for designated dev/prod origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def global_exception_handler(request, exc: Exception):
    """Ensure raw stack traces are never exposed to the frontend/user."""
    if isinstance(exc, HTTPException):
        return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})
    logger.error(f"Unhandled error during request {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An internal server error occurred while processing the request."},
    )


@app.get("/api/health", response_model=HealthResponse)
async def health_check():
    """
    Check API operational health and model readiness.
    Distinguishes clearly between active server and loaded model artifact.
    """
    service = get_model_service()
    return HealthResponse(
        status="operational",
        model_loaded=service.is_loaded,
        model_identifier="BiLSTM (best_pels_bilstm_model.keras)",
        model_path=str(service.model_path),
        detail=service.load_error if not service.is_loaded else "Model ready for real inference.",
    )


@app.post("/api/predict", response_model=PredictResponse)
async def predict_prompt(req: PredictRequest):
    """
    Perform genuine TensorFlow/Keras inference using the trained BiLSTM model.
    Generates independent writing suggestions without fabricating rubric scores.
    """
    service = get_model_service()
    if not service.is_loaded:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Prediction is temporarily unavailable because the trained model has not been loaded.",
        )

    try:
        score_val, is_within_range = service.predict(req.prompt)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference computation error: {str(exc)}",
        )

    analysis = analyze_prompt_structure(req.prompt)
    suggestions = generate_independent_suggestions(req.prompt, analysis)
    suggested_template = generate_suggested_template(req.prompt, analysis)

    return PredictResponse(
        prompt=req.prompt,
        predicted_score=score_val,
        model="BiLSTM",
        observed_dataset_range=ObservedRange(min=OBSERVED_SCORE_MIN, max=OBSERVED_SCORE_MAX),
        is_within_observed_range=is_within_range,
        disclaimer=(
            "Model-estimated score, not an expert assessment. Numerical prediction is "
            "inferred directly by the trained BiLSTM model."
        ),
        suggestions=suggestions,
        analysis=analysis,
        suggested_template=suggested_template,
    )


@app.post("/api/compare", response_model=CompareResponse)
async def compare_prompts(req: CompareRequest):
    """
    Evaluate both original and revised prompts using the real trained BiLSTM model.
    Computes genuine score difference (revised - original).
    """
    service = get_model_service()
    if not service.is_loaded:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Prediction is temporarily unavailable because the trained model has not been loaded.",
        )

    try:
        orig_score, _ = service.predict(req.original_prompt)
        rev_score, _ = service.predict(req.revised_prompt)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference error during comparison: {str(exc)}",
        )

    score_diff = rev_score - orig_score

    orig_analysis = analyze_prompt_structure(req.original_prompt)
    rev_analysis = analyze_prompt_structure(req.revised_prompt)

    orig_suggestions = generate_independent_suggestions(req.original_prompt, orig_analysis)
    rev_suggestions = generate_independent_suggestions(req.revised_prompt, rev_analysis)

    return CompareResponse(
        original_prompt=req.original_prompt,
        original_score=orig_score,
        revised_prompt=req.revised_prompt,
        revised_score=rev_score,
        score_diff=score_diff,
        model="BiLSTM",
        observed_dataset_range=ObservedRange(min=OBSERVED_SCORE_MIN, max=OBSERVED_SCORE_MAX),
        disclaimer=(
            "Both scores are predicted independently by the same trained BiLSTM model. "
            "Suggestions are generated by an independent rule-based helper."
        ),
        original_suggestions=orig_suggestions,
        revised_suggestions=rev_suggestions,
        original_analysis=orig_analysis,
        revised_analysis=rev_analysis,
    )


@app.get("/api/model-info", response_model=ModelInfoResponse)
async def get_model_info():
    """
    Return documented model architecture specifications and dataset metadata.
    """
    return ModelInfoResponse(
        model_name="BiLSTM Prompt Quality Evaluator",
        architecture_details=ModelArchitectureInfo(
            framework="TensorFlow / Keras",
            keras_format=".keras (Keras 3 archive)",
            vocabulary_limit=5000,
            sequence_length=120,
            embedding_dimension=64,
            bilstm_units=32,
            dropout_rate=0.3,
            dense_output=1,
            output_activation="Linear",
            optimizer="Adam",
            learning_rate=0.001,
            loss_function="Mean Squared Error (MSE)",
            batch_size=16,
            max_epochs=35,
            early_stopping_patience=5,
        ),
        dataset_details=DatasetInfo(
            name="PELS (Prompt Engineering Literacy Scale)",
            source="AIKosh",
            excel_filename="PELS_Final_Justification.xlsx",
            worksheet="PELS_Dataset",
            total_raw_records=1674,
            unique_modeling_records=1665,
            training_samples=1165,
            validation_samples=250,
            testing_samples=250,
            input_feature="Prompt Text",
            target_column="Final\\nScore",
            observed_score_min=OBSERVED_SCORE_MIN,
            observed_score_max=OBSERVED_SCORE_MAX,
            rubric_dimensions=[
                "C1 – Foundations",
                "C2 – Design",
                "C3 – Output Specification",
                "C4 – Domain",
                "C5 – Ethics",
                "C6 – Metacognition",
            ],
        ),
        headline_metrics={
            "MAE": 0.6584,
            "MSE": 0.8712,
            "RMSE": 0.9334,
            "R2": 0.8051,
        },
        architectural_flow=[
            "Raw Input String",
            "TextVectorization (vocab=5000, max_len=120)",
            "Integer Token Sequence",
            "Embedding Layer (input_dim=5000, output_dim=64)",
            "Bidirectional LSTM (32 units each dir, total 64)",
            "Dropout Layer (rate=0.3)",
            "Dense Regression Layer (1 unit, linear)",
            "Predicted Continuous Score",
        ],
    )


@app.get("/api/metrics", response_model=MetricsResponse)
async def get_metrics():
    """
    Return recorded experimental test-set evaluation results from the Colab notebook.
    """
    records = [
        ModelComparisonRecord(
            model="BiLSTM",
            mae=0.6584,
            mse=0.8712,
            rmse=0.9334,
            r2=0.8051,
            rank_by_mae=1,
        ),
        ModelComparisonRecord(
            model="SimpleRNN",
            mae=1.5280,
            mse=3.7120,
            rmse=1.9266,
            r2=0.1695,
            rank_by_mae=2,
        ),
        ModelComparisonRecord(
            model="Baseline (Mean)",
            mae=1.6293,
            mse=4.4701,
            rmse=2.1143,
            r2=-0.0001,
            rank_by_mae=3,
        ),
        ModelComparisonRecord(
            model="LSTM",
            mae=1.6532,
            mse=4.7000,
            rmse=2.1680,
            r2=-0.0516,
            rank_by_mae=4,
        ),
        ModelComparisonRecord(
            model="GRU",
            mae=1.8506,
            mse=6.1847,
            rmse=2.4869,
            r2=-0.3837,
            rank_by_mae=5,
        ),
    ]

    return MetricsResponse(
        records=records,
        best_model="BiLSTM",
        mae_reduction_vs_baseline_pct=59.59,
        regression_notes=(
            "All metrics represent regression evaluation on the held-out test split (250 samples). "
            "R² represents the coefficient of determination (goodness-of-fit) and should not be "
            "interpreted as classification accuracy. Negative R² indicates performance worse than "
            "the horizontal mean baseline."
        ),
    )


# ---------------------------------------------------------------------------
# Single-Port Production Serving & Client-Side SPA Routing
# ---------------------------------------------------------------------------
if (FRONTEND_DIST_DIR / "assets").is_dir():
    app.mount(
        "/assets",
        StaticFiles(directory=str(FRONTEND_DIST_DIR / "assets")),
        name="assets"
    )


@app.get("/")
async def serve_root():
    index_file = FRONTEND_DIST_DIR / "index.html"
    if index_file.is_file():
        return FileResponse(index_file)
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"message": "PromptIQ API operational. Build frontend with 'npm run build' to view the interface."}
    )


@app.get("/{full_path:path}")
async def serve_spa(full_path: str):
    # Ensure unmatched API routes return clean JSON 404
    if full_path == "api" or full_path.startswith("api/"):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="API endpoint not found"
        )

    # Serve static assets from dist root (e.g. vite.svg, favicon.ico, etc.)
    file_path = FRONTEND_DIST_DIR / full_path
    if full_path and file_path.is_file():
        return FileResponse(file_path)

    # SPA routing fallback: return index.html for client-side pages
    index_file = FRONTEND_DIST_DIR / "index.html"
    if index_file.is_file():
        return FileResponse(index_file)

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Frontend build artifact not found. Please run 'npm run build' inside frontend directory."
    )

