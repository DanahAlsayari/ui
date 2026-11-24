# CCO Retail Intelligence and Customer Retention Advisory System

Executive decision-support dashboard for the SWE485 retail customer churn project.

## Stack
- Frontend: React 18 + Vite
- API: FastAPI
- Churn model: Logistic Regression baseline, retrained from the team's original `train_selected.csv`
- Preprocessing: OneHotEncoder for categorical features + StandardScaler for numerical features
- Segmentation: team-reported K-Means (k=3) and GMM (k=4) profiles and validation metrics
- GenAI: Google Gemini using the project's Zero-shot / Few-shot report approach

## Run locally

### Backend
Python 3.10+ recommended.

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\\Scripts\\activate
pip install -r requirements.txt
cp .env.example .env
# Add GEMINI_API_KEY to backend/.env for live GenAI reports
uvicorn main:app --reload --port 8000
```

The first prediction downloads the team's `Dataset/Processed/train_selected.csv`, fits the preprocessing + Logistic Regression pipeline, and caches it under `backend/artifacts/`. The artifact is generated locally and is not committed.

### Frontend
In a second terminal, from the repository root:

```bash
npm install
npm run dev
```

Open http://localhost:5173.

Optional deployment setting: create a root `.env` with `VITE_API_URL=https://your-api-host`.

## API
- `GET /api/health` — API and Gemini configuration status
- `POST /api/predict/churn` — prediction from the 15 original customer features
- `GET /api/segments` — verified K-Means profiles and validation metrics
- `POST /api/insights` — Gemini retention report using Zero-shot or Few-shot prompting

API docs: http://localhost:8000/docs

## Data integrity and limitations
- The selected baseline was trained in the team's notebook on the processed 80,000-row training split. This application retrains the same Logistic Regression configuration from the corresponding selected raw training split, using the documented OneHotEncoder + StandardScaler preprocessing. The app's live predictions are produced by this retrained pipeline; the published Phase 1 metrics remain the team's recorded offline evaluation results and are not recomputed by the dashboard.
- `customer_id` and `churn_risk` are excluded from model inputs to avoid identifier use and potential target leakage.
- K-Means / GMM metrics and segment profiles come from the team's documented clustering results. The dashboard presents descriptive profiles; it does not claim to refit or assign new customers to a cluster.
- GenAI reports are live only when a valid `GEMINI_API_KEY` is configured in `backend/.env`. The key remains server-side.
- The dataset is synthetic. Model estimates and recommendations are decision-support outputs, not guarantees or causal explanations.
