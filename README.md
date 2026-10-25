# PromptIQ: Deep Learning-Based Prompt Quality Assessment and Improvement System

> **Tagline:** "Write Better Prompts. Get Smarter Results."  
> **Academic Course:** Deep Learning Mini Project  
> **Institution:** St. Francis Institute of Technology (SFIT), Mumbai  
> **Project Guide:** Prof. Joanne Gomes  
> **Team:** Roll No. 54 (Kennan), Roll No. 55 (Neel), Roll No. 56 (Noslen), Roll No. 63 (Riwan)  
> **United Nations SDG Alignment:** SDG 4 — Quality Education (AI Literacy & Prompt Engineering)

---

## 1. Project Overview

The effectiveness of Generative AI systems depends heavily on the quality of prompts provided by users. Vague, under-specified prompts lack context, structure, and operational boundaries, frequently producing hallucinatory or irrelevant answers.

**PromptIQ** is a full-stack AI web application that automatically evaluates prompt quality using a trained **Bidirectional Long Short-Term Memory (BiLSTM)** deep neural network. The model predicts a continuous numerical quality score directly from raw prompt text and provides transparent, independent writing suggestions to guide users in refining their prompts.

### Key Capabilities

1. **AI-Powered Prompt Scoring:** Instant inference using a genuine trained TensorFlow/Keras BiLSTM model.
2. **Transparent Writing Suggestions:** Rule-based prompt-engineering heuristics (task, audience, format, context, constraints, examples).
3. **Prompt Improvement Workspace:** Side-by-side iterative comparison between original and revised prompts with real score deltas.
4. **Interactive Architecture Visualizer:** Complete tensor dataflow diagram displaying layers, parameters, and shapes for college viva demonstrations.
5. **Research Analytics Dashboard:** Visual comparison of all benchmarked architectures (BiLSTM, SimpleRNN, LSTM, GRU, and Mean Baseline).
6. **Academic Background:** Literature review connecting modern prompt engineering surveys (*Sahoo et al., 2024*) with automated essay scoring (*Taghipour & Ng, 2016*).

---

## 2. Deep Learning Architecture & Empirical Benchmarks

### Neural Network Pipeline

```
Raw Input String (batch_size, 1)
       ↓
TextVectorization (vocab_limit=5000, sequence_length=120)
       ↓
Integer Token Sequence (batch_size, 120)
       ↓
Embedding Layer (input_dim=5000, output_dim=64) [320,000 weights]
       ↓
Bidirectional LSTM (32 units each dir = 64 units) [24,832 weights]
       ↓
Dropout Layer (rate=0.3)
       ↓
Dense Regression Head (1 linear unit) [65 weights]
       ↓
Predicted Continuous Score (Observed PELS range: 1.0 – 9.35)
```

### Dataset Specifications

- **Dataset:** Prompt Engineering Literacy Scale (PELS)
- **Source:** AIKosh (`PELS_Final_Justification.xlsx`, sheet `PELS_Dataset`)
- **Raw Records:** 1,674 entries
- **Deduplicated Non-Leakage Set:** 1,665 unique prompt entries
- **Partitions:** 70% Train (1,165) | 15% Validation (250) | 15% Held-out Test (250)
- **Target Feature:** `Final\nScore` (Continuous observed range: 1.0 – 9.35)

### Recorded Experimental Results (Held-Out Test Set, n = 250)

| Model Architecture | MAE (Lower is Better) | MSE | RMSE | R² (Goodness-of-Fit) | Rank |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **BiLSTM (Selected)** | **0.6584** | **0.8712** | **0.9334** | **0.8051** | **#1** |
| SimpleRNN | 1.5280 | 3.7120 | 1.9266 | 0.1695 | #2 |
| Baseline (Mean Regressor) | 1.6293 | 4.4701 | 2.1143 | -0.0001 | #3 |
| LSTM (Unidirectional) | 1.6532 | 4.7000 | 2.1680 | -0.0516 | #4 |
| GRU | 1.8506 | 6.1847 | 2.4869 | -0.3837 | #5 |

> **Academic Viva Note:** BiLSTM reduced Mean Absolute Error by **~59.6%** compared to the baseline mean regressor. All metrics represent continuous **regression**. The R² score of 0.8051 represents variance explained by the model; it is **NOT** a classification accuracy metric and must never be cited as "80.51% accuracy".

---

## 3. Technology Stack

- **Frontend:**
  - React 18 (TypeScript)
  - Vite 5 (Bundler & Dev Server)
  - Tailwind CSS 3.4 (Modern AI theme: Dark mode default with light mode toggle)
  - Lucide React (Icons)
  - Recharts (Interactive research bar and donut charts)
- **Backend:**
  - Python 3.12 (also compatible with 3.10 and 3.11)
  - FastAPI (REST API with OpenAPI documentation)
  - TensorFlow / Keras 3 (Model loading and inference)
  - NumPy (Array processing for raw string inputs)
  - Pydantic v2 (Request/response schemas and input validation)
  - Uvicorn (ASGI web server)

---

## 4. Project Directory Structure

```text
DL mini project/
│
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI endpoints (/health, /predict, /compare, /metrics, etc.)
│   │   ├── model_service.py     # Singleton Keras BiLSTM loader & raw-string inference
│   │   ├── schemas.py           # Pydantic v2 request & response models
│   │   ├── feedback.py          # Independent rule-based suggestion & template engine
│   │   └── config.py            # Model path & CORS settings
│   ├── models/
│   │   └── best_pels_bilstm_model.keras   # Trained BiLSTM Keras model artifact
│   ├── requirements.txt
│   └── tests/
│       ├── run_tests.py         # Full backend verification test suite
│       └── test_api.py          # Unit tests
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── PromptEditor.tsx
│   │   │   ├── ScoreDisplay.tsx
│   │   │   ├── SuggestionPanel.tsx
│   │   │   ├── ComparisonPanel.tsx
│   │   │   ├── ArchitectureDiagram.tsx
│   │   │   └── ModelChart.tsx
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── Evaluator.tsx
│   │   │   ├── Improve.tsx
│   │   │   ├── ModelExplained.tsx
│   │   │   ├── Analytics.tsx
│   │   │   └── About.tsx
│   │   ├── services/
│   │   │   └── api.ts           # REST API client
│   │   ├── types/
│   │   │   └── api.ts           # TypeScript interfaces
│   │   ├── context/
│   │   │   └── ThemeContext.tsx # Persistent Dark/Light theme
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── start_backend.bat            # One-click Windows batch launcher for backend
├── start_frontend.bat           # One-click Windows batch launcher for frontend
├── .env.example
├── .gitignore
└── README.md
```

---

## 5. Prerequisites & Local Setup on Windows 11

### Prerequisites
1. **Python:** Version 3.10, 3.11, or 3.12 (Check via `python --version`)
2. **Node.js:** Version 18 or higher (Check via `node --version`)
3. **PowerShell:** Standard Windows PowerShell 5.1 or PowerShell Core 7+

---

## 6. How to Run the Application (Step-by-Step)

### Step 1: Model Placement (If downloading fresh from Google Colab)

If you trained a new model in Google Colab exported to `/content/best_pels_bilstm_model.keras`:
1. In Google Colab, open the file explorer on the left sidebar.
2. Locate `best_pels_bilstm_model.keras`, click the three dots, and click **Download**.
3. Place the downloaded file into:
   ```text
   DL mini project\backend\models\best_pels_bilstm_model.keras
   ```
*(Note: A pre-placed copy already resides in `backend/models/best_pels_bilstm_model.keras` ready for immediate execution).*

---

### Option A: Unified Single-Port Mode (Recommended for Demos & Presentations)

In Single-Port mode, the entire application (React frontend + FastAPI backend + trained BiLSTM model) runs together on a single port (**`http://localhost:8000`**):

1. **Build the React frontend** (if not already built):
   ```powershell
   cd frontend
   npm run build
   cd ..
   ```
2. **Start the Unified Server**:
   ```powershell
   $env:PYTHONUTF8 = "1"
   $env:PYTHONPATH = "backend"
   .\.venv\Scripts\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8000
   ```
   *Or simply double-click **`start_production.bat`**.*

3. Open **[http://localhost:8000](http://localhost:8000)** in your browser:
   - Web Application UI: `http://localhost:8000/`
   - Client-side routes (SPA fallback): `http://localhost:8000/evaluator`, `http://localhost:8000/improve`, `http://localhost:8000/analytics`, `http://localhost:8000/about`
   - Interactive Swagger API docs: `http://localhost:8000/docs`
   - Health check: `http://localhost:8000/api/health`

---

### Option B: Dual-Terminal Development Mode (Vite Hot-Reload)

For active frontend development with instant HMR:

1. **Start Backend (Terminal 1):**
   ```powershell
   $env:PYTHONUTF8 = "1"
   $env:PYTHONPATH = "backend"
   .\.venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
   ```
   *Or double-click `start_backend.bat`.*

2. **Start Frontend (Terminal 2):**
   ```powershell
   cd frontend
   npm run dev
   ```
   *Or double-click `start_frontend.bat`.*

3. Open **`http://localhost:5173`** in your browser. All `/api` calls are automatically proxied to port 8000.

---

## 7. How to Verify Real BiLSTM Inference

To prove to your college professors that real deep learning inference is occurring (not a mock or simulated score):

1. Navigate to the **Evaluator** page.
2. Click the **"Basic Sample"**:
   - Prompt: `"Explain machine learning."`
   - Click **Evaluate Prompt Quality**.
   - **Observed Result:** BiLSTM predicts **~3.02**.
3. Next, click the **"Intermediate Sample"**:
   - Prompt: `"Explain machine learning to beginners with examples."`
   - Click **Evaluate Prompt Quality**.
   - **Observed Result:** BiLSTM predicts **~3.81**.
4. Next, click the **"Detailed Sample"**:
   - Prompt: `"Act as a machine learning instructor. Explain supervised and unsupervised learning to first-year engineering students using simple language, two real-world examples, and a comparison table."`
   - Click **Evaluate Prompt Quality**.
   - **Observed Result:** BiLSTM predicts **~6.48**.
5. Click **"Improve in Workspace"** to compare original and revised prompts side-by-side and see the mathematical delta calculated by the model.

---

## 8. Running Backend Verification Tests

To run the automated verification test suite:

```powershell
$env:PYTHONUTF8 = "1"
$env:PYTHONPATH = "backend"
.\.venv\Scripts\python.exe backend\tests\run_tests.py
```

Expected output:
```text
========================================
      RUNNING PROMPTIQ BACKEND TESTS    
========================================

Test 1: Model Loading and Real Inference...
  Basic prompt score: 3.0190 (in range: True)
  Intermediate prompt score: 3.8135 (in range: True)
  Detailed prompt score: 6.4849 (in range: True)
  [PASSED] Model Loading & Real Inference

Test 2: Request Schema & Input Validations...
  [PASSED] Schema & Input Validations

Test 3: Feedback & Suggestion Engine...
  [PASSED] Independent Feedback Engine

========================================
      ALL BACKEND TESTS PASSED (3/3)    
========================================
```

---

## 9. Troubleshooting & Common Questions

### Q: Why is `PYTHONUTF8=1` recommended on Windows?
On Windows, Python's default text reading encoding is often ANSI (`cp1252`/`charmap`). The Keras 3 `.keras` zip archive contains internal UTF-8 vocabulary tables. Setting `$env:PYTHONUTF8="1"` ensures Python opens all internal model files using standard UTF-8. The backend code also applies this automatically.

### Q: What if the model file is missing?
If `backend/models/best_pels_bilstm_model.keras` is absent:
- The website and documentation pages still load seamlessly.
- The health check at `/api/health` indicates `model_loaded: false`.
- If a user attempts to evaluate, the backend returns HTTP 503 with: `"Prediction is temporarily unavailable because the trained model has not been loaded."`
- The system **never** outputs fabricated mock scores.

### Q: How to stop the servers?
Press `Ctrl + C` in each terminal window.

---

## 10. Building for Production

To create an optimized production frontend build:
```powershell
cd frontend
npm run build
```
This produces optimized HTML, CSS, and JS assets in `frontend/dist/`.
