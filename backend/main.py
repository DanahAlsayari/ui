"""CCO Retail Intelligence API: team-data Logistic Regression + Gemini reports."""
import os
from functools import lru_cache
from pathlib import Path
import joblib
import pandas as pd
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, ConfigDict

# -----------------------------------------------------------------------------
# Application paths, environment configuration, and model artifact location
# -----------------------------------------------------------------------------
ROOT=Path(__file__).resolve().parent
load_dotenv(ROOT/".env")
ARTIFACTS=ROOT/"artifacts"; ARTIFACTS.mkdir(exist_ok=True)
MODEL_PATH=ARTIFACTS/"churn_phase1_baseline_lr.joblib"
TRAIN_URL=os.getenv("TRAIN_DATA_URL","https://raw.githubusercontent.com/jooryA/SWE485-Project-Group6/main/Dataset/Processed/train_selected.csv")
MODEL_VERSION="phase1-baseline-logistic-regression"
app=FastAPI(title="CCO Retail Intelligence and Customer Retention Advisory System API",version="1.0.0")
app.add_middleware(CORSMiddleware,allow_origins=os.getenv("CORS_ORIGINS","http://localhost:5173,http://127.0.0.1:5173").split(","),allow_credentials=True,allow_methods=["*"],allow_headers=["*"])

# -----------------------------------------------------------------------------
# Request schema: validate all 15 customer features before model inference
# -----------------------------------------------------------------------------
class CustomerInput(BaseModel):
 model_config=ConfigDict(extra="forbid")
 age_group:str=Field(pattern=r"^(18-24|25-34|35-44|45-54|55\+)$")
 gender:str=Field(pattern=r"^(Female|Male|Other)$")
 region:str=Field(pattern=r"^(Central|East|North|South|West)$")
 customer_segment:str=Field(pattern=r"^(New|Returning|VIP|Loyal)$")
 preferred_channel:str=Field(pattern=r"^(In-Store|Mobile App|Online)$")
 purchase_frequency:int=Field(ge=0,le=1000)
 avg_order_value:float=Field(ge=0,le=100000)
 total_spent:float=Field(ge=0,le=10000000)
 recency_days:int=Field(ge=0,le=10000)
 website_visits:int=Field(ge=0,le=100000)
 discount_usage_rate:float=Field(ge=0,le=1)
 email_open_rate:float=Field(ge=0,le=1)
 cart_abandonment_rate:float=Field(ge=0,le=1)
 loyalty_score:float=Field(ge=0,le=100)
 engagement_score:float=Field(ge=0,le=100)

# -----------------------------------------------------------------------------
# Model feature order must match the selected training dataset columns
# -----------------------------------------------------------------------------
FEATURES=["age_group","gender","region","customer_segment","preferred_channel","purchase_frequency","avg_order_value","total_spent","recency_days","website_visits","discount_usage_rate","email_open_rate","cart_abandonment_rate","loyalty_score","engagement_score"]

# -----------------------------------------------------------------------------
# Train and cache the Logistic Regression pipeline from the team training data
# -----------------------------------------------------------------------------
def train_model():
 from sklearn.compose import ColumnTransformer
 from sklearn.preprocessing import OneHotEncoder,StandardScaler
 from sklearn.pipeline import Pipeline
 from sklearn.linear_model import LogisticRegression
 frame=pd.read_csv(TRAIN_URL)
 if "churn_flag" not in frame or any(f not in frame for f in FEATURES): raise RuntimeError("Training CSV schema does not match the team's 15-feature schema.")
 X=frame[FEATURES].copy(); y=frame["churn_flag"].astype(int)

 # Keep categorical columns as NumPy-compatible object dtype. Pandas StringDtype
 # can trigger "string dtypes are not allowed" in some scikit-learn versions.
 cat=["age_group","gender","region","customer_segment","preferred_channel"]
 X[cat]=X[cat].astype(object)
 num=[feature for feature in FEATURES if feature not in cat]
 prep=ColumnTransformer([("categorical",OneHotEncoder(handle_unknown="ignore"),cat),("numerical",StandardScaler(),num)],remainder="drop")
 pipe=Pipeline([("preprocessing",prep),("model",LogisticRegression(max_iter=1000))])
 pipe.fit(X,y); joblib.dump(pipe,MODEL_PATH); return pipe
@lru_cache(maxsize=1)
def get_model():
 if MODEL_PATH.exists():
  try:return joblib.load(MODEL_PATH)
  except Exception:MODEL_PATH.unlink(missing_ok=True)
 return train_model()

# -----------------------------------------------------------------------------
# Recorded K-Means segment profiles from the team's analysis
# -----------------------------------------------------------------------------
SEGMENTS=[
 {"name":"High-Volume Buyers","customers":37796,"share":37.796,"churned":16637,"churn_rate":44.02,"priority":"Loyalty protection","description":"Buy frequently and spend the most. The project interpretation recommends protecting this group with loyalty rewards.","profile":{"purchase_frequency":24.36,"avg_order_value":234.65,"total_spent":5527.68,"website_visits":122.97,"email_open_rate":0.47,"cart_abandonment_rate":0.46,"engagement_score":50.61}},
 {"name":"Low-Engagement Customers","customers":31485,"share":31.485,"churned":17036,"churn_rate":54.11,"priority":"Re-engagement first","description":"Have fewer website visits, lower email opens, and higher cart abandonment. This group has the highest observed churn rate.","profile":{"purchase_frequency":3.98,"avg_order_value":192.88,"total_spent":688.48,"website_visits":18.38,"email_open_rate":0.31,"cart_abandonment_rate":0.57,"engagement_score":36.78}},
 {"name":"Engaged Light Buyers","customers":30719,"share":30.719,"churned":12551,"churn_rate":40.86,"priority":"Grow purchase value","description":"Purchase less often but show higher email engagement. The project interpretation suggests relevant recommendations to raise order size.","profile":{"purchase_frequency":4.38,"avg_order_value":196.26,"total_spent":774.38,"website_visits":20.37,"email_open_rate":0.65,"cart_abandonment_rate":0.32,"engagement_score":66.63}}
]

# -----------------------------------------------------------------------------
# Train the exact Phase 2 K-Means model and keep its preprocessing with it.
# -----------------------------------------------------------------------------
CLUSTER_DATA_URL=os.getenv("CLUSTER_DATA_URL","https://raw.githubusercontent.com/jooryA/SWE485-Project-Group6/main/Dataset/retail_customer_churn.csv")
CLUSTER_MODEL_PATH=ARTIFACTS/"kmeans_segments_phase2.joblib"
CLUSTER_NUMERIC=["purchase_frequency","avg_order_value","total_spent","recency_days","website_visits","discount_usage_rate","email_open_rate","cart_abandonment_rate","loyalty_score","engagement_score"]
CLUSTER_CATEGORICAL=["age_group","gender","region","customer_segment","preferred_channel"]
CLUSTER_FEATURES=CLUSTER_NUMERIC+CLUSTER_CATEGORICAL
SKEWED_CLUSTER_FEATURES=["purchase_frequency","total_spent","website_visits"]
CLUSTER_NAMES={0:"High-Volume Buyers",1:"Low-Engagement Customers",2:"Engaged Light Buyers"}

class ClusterCustomerInput(BaseModel):
 model_config=ConfigDict(extra="forbid")
 age_group:str=Field(pattern=r"^(18-24|25-34|35-44|45-54|55\+)$")
 gender:str=Field(pattern=r"^(Female|Male|Other)$")
 region:str=Field(pattern=r"^(Central|East|North|South|West)$")
 customer_segment:str=Field(pattern=r"^(New|Returning|VIP|Loyal)$")
 preferred_channel:str=Field(pattern=r"^(In-Store|Mobile App|Online)$")
 purchase_frequency:int=Field(ge=0,le=1000)
 avg_order_value:float=Field(ge=0,le=100000)
 total_spent:float=Field(ge=0,le=10000000)
 recency_days:int=Field(ge=0,le=10000)
 website_visits:int=Field(ge=0,le=100000)
 discount_usage_rate:float=Field(ge=0,le=1)
 email_open_rate:float=Field(ge=0,le=1)
 cart_abandonment_rate:float=Field(ge=0,le=1)
 loyalty_score:float=Field(ge=0,le=100)
 engagement_score:float=Field(ge=0,le=100)

@lru_cache(maxsize=1)
def get_cluster_model():
 if CLUSTER_MODEL_PATH.exists():
  try:return joblib.load(CLUSTER_MODEL_PATH)
  except Exception:CLUSTER_MODEL_PATH.unlink(missing_ok=True)
 from sklearn.cluster import KMeans
 from sklearn.compose import ColumnTransformer
 from sklearn.preprocessing import OneHotEncoder,StandardScaler
 frame=pd.read_csv(CLUSTER_DATA_URL)
 if any(c not in frame.columns for c in CLUSTER_FEATURES+["churn_flag"]):
  raise RuntimeError("The Phase 2 clustering dataset does not match the original 15-feature schema.")
 X=frame[CLUSTER_FEATURES].copy()
 X[SKEWED_CLUSTER_FEATURES]=X[SKEWED_CLUSTER_FEATURES].apply(pd.to_numeric).apply(lambda col: __import__("numpy").log1p(col))
 X[CLUSTER_CATEGORICAL]=X[CLUSTER_CATEGORICAL].astype(object)
 preprocessor=ColumnTransformer(transformers=[
  ("num",StandardScaler(),CLUSTER_NUMERIC),
  ("cat",OneHotEncoder(handle_unknown="ignore",sparse_output=False),CLUSTER_CATEGORICAL),
 ])
 transformed=preprocessor.fit_transform(X)
 model=KMeans(n_clusters=3,random_state=42,n_init=10).fit(transformed)
 raw_profiles=frame.assign(raw=model.labels_).groupby("raw")[["purchase_frequency","engagement_score"]].mean()
 volume=int(raw_profiles["purchase_frequency"].idxmax())
 low=int(raw_profiles.drop(volume)["engagement_score"].idxmin())
 engaged=next(int(label) for label in raw_profiles.index if int(label) not in (volume,low))
 label_map={volume:0,low:1,engaged:2}
 artifact={"preprocessor":preprocessor,"model":model,"label_map":label_map,"profiles":frame.assign(segment=[label_map[int(v)] for v in model.labels_]).groupby("segment")[CLUSTER_NUMERIC].mean().to_dict(orient="index")}
 joblib.dump(artifact,CLUSTER_MODEL_PATH)
 return artifact

# -----------------------------------------------------------------------------
# Prompt templates used by the GenAI recommendations endpoint
# -----------------------------------------------------------------------------
ZERO_SHOT="""You are a customer retention analyst preparing a concise report for business executives.
Task: Analyze the customer's churn prediction and available customer features. Provide practical retention recommendations.
Customer Information:
- Churn Prediction: {churn_prediction}
- Churn Probability: {churn_probability}
- Recency Days: {recency_days}
- Loyalty Score: {loyalty_score}
- Cart Abandonment Rate: {cart_abandonment_rate}
Instructions: Summarize estimated churn risk; identify relevant observations; recommend exactly two actionable, tailored retention strategies and briefly explain their rationale; use clear executive-friendly English.
Constraints: Use only supplied information. Do not invent facts or claim causation. Treat probability as a model estimate, not certainty. Avoid guarantees. Acknowledge limitations. Do not add sections.
Required format:
Risk Summary:
[Concise summary]
Retention Recommendations:
1. [Action and rationale]
2. [Action and rationale]
Strategic Rationale:
[Why actions are relevant]"""
FEW_SHOT="""You are a customer retention analyst. Follow the examples' structure and tone. Use only the new customer's supplied values.
Example 1: Churn Prediction 1; Probability 82%; Recency 50 days; Loyalty 20; Cart Abandonment 75%.
Risk Summary: The model estimates an 82% churn probability, indicating elevated predicted risk. The available data show 50 recency days, loyalty 20, and cart abandonment 75%.
Retention Recommendations:
1. Send a personalized re-engagement message with a relevant return offer, given the 50 recency days.
2. Offer checkout assistance or a reminder, considering the 75% cart abandonment.
Strategic Rationale: These actions address observed inactivity and cart abandonment. They are suggestions, not guaranteed solutions.
Example 2: Churn Prediction 0; Probability 18%; Recency 5 days; Loyalty 85; Cart Abandonment 10%.
Risk Summary: The model estimates an 18% churn probability, indicating relatively low predicted risk.
Retention Recommendations:
1. Maintain light-touch loyalty communication.
2. Offer an appreciation message or optional loyalty benefit.
Strategic Rationale: Maintain engagement rather than intensive recovery efforts.
Now analyze this customer:
- Churn Prediction: {churn_prediction}
- Churn Probability: {churn_probability}
- Recency Days: {recency_days}
- Loyalty Score: {loyalty_score}
- Cart Abandonment Rate: {cart_abandonment_rate}
Use the exact sections Risk Summary, Retention Recommendations (exactly two), and Strategic Rationale. Be concise, factual, and executive-friendly. Do not invent facts, infer causation, or guarantee outcomes."""

# -----------------------------------------------------------------------------
# GenAI request schema and API routes
# -----------------------------------------------------------------------------
class InsightRequest(BaseModel):
 customer:CustomerInput
 method:str=Field(pattern="^(Zero-shot|Few-shot)$")
 churn_probability:float=Field(ge=0,le=1)
 churn_prediction:int=Field(ge=0,le=1)

# Health endpoint: reports API availability and required configuration.
@app.get("/api/health")
def health():
 return {"status":"ok","service":"CCO Retail Intelligence API","model_artifact_exists":MODEL_PATH.exists(),"model_version":MODEL_VERSION,"genai_configured":bool(os.getenv("GEMINI_API_KEY"))}

# Prediction endpoint: returns the model class, probability, and risk band.
@app.post("/api/predict/churn")
def predict_churn(payload:CustomerInput):
 try:
  model=get_model()
  row=pd.DataFrame([payload.model_dump()],columns=FEATURES)

  # Match the categorical dtypes used when the model pipeline was trained.
  categorical_features=["age_group","gender","region","customer_segment","preferred_channel"]
  row[categorical_features]=row[categorical_features].astype(object)

  pred=int(model.predict(row)[0])
  probability=float(model.predict_proba(row)[0][1])
  return {"status":"ok","model":MODEL_VERSION,"churn_prediction":pred,"churn_label":"Churn" if pred==1 else "Retained","churn_probability":round(probability,6)}
 except Exception as exc: raise HTTPException(status_code=503,detail=f"Prediction model unavailable: {exc}")

# Segment endpoint: returns descriptive project profiles, not live assignments.
@app.get("/api/segments")
def segments():
 return {"status":"ok","algorithm":"K-Means (k=3)","silhouette":0.099,"davies_bouldin":2.448,"overall_churn_rate":46.22,"segments":SEGMENTS,"warning":"The project reports weak cluster separation. Treat these as exploratory descriptive groups, not definitive personas or new-customer assignments."}

# Live K-Means assignment using the saved Phase 2 preprocessing and model.
@app.post("/api/predict/cluster")
def predict_cluster(payload:ClusterCustomerInput):
 try:
  artifact=get_cluster_model()
  row=pd.DataFrame([payload.model_dump()],columns=CLUSTER_FEATURES)
  row[SKEWED_CLUSTER_FEATURES]=row[SKEWED_CLUSTER_FEATURES].apply(pd.to_numeric).apply(lambda col: __import__("numpy").log1p(col))
  row[CLUSTER_CATEGORICAL]=row[CLUSTER_CATEGORICAL].astype(object)
  raw=int(artifact["model"].predict(artifact["preprocessor"].transform(row))[0])
  cluster_id=int(artifact["label_map"][raw])
  name=CLUSTER_NAMES[cluster_id]
  profiles=artifact["profiles"]
  profile=profiles[cluster_id]
  customer=payload.model_dump()
  if cluster_id==0:
   reasons=[f"Purchase frequency ({customer['purchase_frequency']}) aligns with this group's high-volume buying pattern (cluster average: {profile['purchase_frequency']:.1f}).",f"Total spent ({customer['total_spent']:,.2f}) and website visits ({customer['website_visits']}) are evaluated as part of the group's purchasing-volume profile."]
  elif cluster_id==1:
   reasons=[f"Engagement score ({customer['engagement_score']:.1f}) and email open rate ({customer['email_open_rate']:.2f}) are consistent with this group's lower-engagement profile.",f"Cart abandonment rate ({customer['cart_abandonment_rate']:.2f}) is considered alongside the cluster's higher-abandonment pattern (cluster average: {profile['cart_abandonment_rate']:.2f})."]
  else:
   reasons=[f"Engagement score ({customer['engagement_score']:.1f}) and email open rate ({customer['email_open_rate']:.2f}) align with this group's stronger engagement profile.",f"Purchase frequency ({customer['purchase_frequency']}) is closer to the lighter-buying pattern than the High-Volume Buyers profile."]
  return {"status":"ok","algorithm":"K-Means","cluster":cluster_id,"cluster_name":name,"reason":reasons,"profile":profile,"note":"Assigned by the Phase 2 K-Means model (k=3) using the original 15 features, log1p transform on purchase_frequency/total_spent/website_visits, StandardScaler for numeric features, and OneHotEncoder for categorical features."}
 except Exception as exc: raise HTTPException(status_code=503,detail=f"K-Means model unavailable: {exc}")

# GenAI endpoint: sends the validated prediction context to Gemini server-side.
@app.post("/api/insights")
def insights(payload:InsightRequest):
 key=os.getenv("GEMINI_API_KEY")
 if not key: raise HTTPException(status_code=503,detail="GEMINI_API_KEY is not configured. Add it to backend/.env; never expose it in the frontend.")
 try:
  from google import genai
  c=payload.customer
  values={"churn_prediction":payload.churn_prediction,"churn_probability":f"{payload.churn_probability*100:.1f}%","recency_days":c.recency_days,"loyalty_score":c.loyalty_score,"cart_abandonment_rate":f"{c.cart_abandonment_rate*100:.1f}%"}
  prompt=(ZERO_SHOT if payload.method=="Zero-shot" else FEW_SHOT).format(**values)
  model_name=os.getenv("GEMINI_MODEL","gemini-3.5-flash-lite")
  client=genai.Client(api_key=key)
  response=client.models.generate_content(model=model_name,contents=prompt)
  if not response.text: raise RuntimeError("Gemini returned an empty response.")
  return {"status":"ok","provider":"Gemini","model":model_name,"method":payload.method,"report":response.text}
 except Exception as exc: raise HTTPException(status_code=502,detail=f"GenAI generation failed: {exc}")
