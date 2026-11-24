# Northstar · Customer Intelligence Dashboard

A modern React executive dashboard for the SWE485 Customer Intelligence and Decision-Support project.

## Stack
- Frontend: React 18, Vite, Tailwind CSS, Recharts, Lucide
- Backend: FastAPI (Python)
- Integration targets: supervised churn model, exploratory clustering, and GenAI strategic explanations

## Run the frontend
Node.js 20+ recommended.

```bash
npm install
npm run dev
```
Open the local URL printed by Vite (normally http://localhost:5173).

## Run the API
In a second terminal:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\\Scripts\\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
API health: http://localhost:8000/api/health · API docs: http://localhost:8000/docs

## Current implementation
- Executive KPI overview and portfolio trend visualizations.
- Churn scenario controls and customer risk watchlist.
- Customer segment comparison with an exploratory-analysis warning.
- GenAI briefing builder and executive explanation preview.
- Responsive navigation and mobile layout.

Important: UI values and narrative previews are sample/demo content. The API deliberately returns not_configured for inference until the actual saved model artifact, feature schema, preprocessing pipeline, and selected GenAI provider are verified and connected. Do not describe demo scenario scores or generated preview copy as real model predictions or live AI responses.

Project clustering separation metrics are weak, so segments remain exploratory/descriptive rather than validated personas.

## Next integration steps
1. Confirm the exact feature columns and preprocessing used by the selected churn model.
2. Load the verified model artifact in a backend service and implement inference with calibrated confidence output.
3. Connect clustering assignments and descriptive profiles from the project pipeline.
4. Connect the selected GenAI prompt through a server-side API key stored in environment variables.
5. Replace demo data with source-backed outputs and add tests for each API contract.
