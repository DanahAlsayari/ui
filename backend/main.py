"""FastAPI boundary. Connect validated project artifacts after verifying schemas."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
app=FastAPI(title="Northstar Customer Intelligence API",version="1.0.0")
app.add_middleware(CORSMiddleware,allow_origins=["http://localhost:5173"],allow_credentials=True,allow_methods=["*"],allow_headers=["*"])
class ScenarioInput(BaseModel):
    tenure_months:int=Field(ge=0,le=120)
    monthly_charges:float=Field(ge=0)
    support_tickets:int=Field(ge=0)
@app.get("/api/health")
def health(): return {"status":"ok","mode":"prototype","models_connected":False}
@app.post("/api/predict/churn")
def predict_churn(payload:ScenarioInput):
    return {"status":"not_configured","message":"Connect the validated trained model and preprocessing pipeline before enabling inference.","input_received":payload.model_dump()}
@app.get("/api/insights")
def insights(): return {"status":"not_configured","message":"Connect the selected GenAI prompt and secured provider API before enabling live insights."}
