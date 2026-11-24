# Customer Intelligence UI

A Streamlit prototype for the interactive executive decision-making interface.

## Features
- Executive overview with KPI cards and portfolio visualizations.
- Churn risk explorer and illustrative scenario controls.
- Exploratory customer-segmentation views.
- GenAI strategic-insight layout with clearly labelled demo content.

## Setup
Python 3.10+ is recommended.

```bash
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\\Scripts\\activate
pip install -r requirements.txt
```

## Run
From the repository root:

```bash
streamlit run app.py
```

## Data and model integration
Current charts and values use generated sample data for UI development. The churn scenario formula is illustrative and is **not** a trained-model prediction. The GenAI page displays demo copy and does not call an API. Replace these modules with validated project datasets, saved model artifacts, preprocessing, and a configured GenAI service before presenting outputs as real predictions or live explanations.

Clustering results from the project should be described cautiously: the reported separation metrics are weak, so clusters are exploratory/descriptive rather than validated personas.

## Visual analytics
The interface uses Plotly charts, KPI summaries, and filters to support executive exploration. The scenario controls demonstrate the interaction pattern pending verified inference integration.
