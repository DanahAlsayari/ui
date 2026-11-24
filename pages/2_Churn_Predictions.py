import streamlit as st
import plotly.express as px
from utils.sample_data import churn_sample
from utils.charts import apply_layout
from utils.theme import inject_theme, sidebar_brand, page_intro, panel_title

st.set_page_config(page_title="Churn predictions",page_icon="🎯",layout="wide")
inject_theme(); sidebar_brand()
page_intro("PREDICTIVE ANALYTICS","Churn predictions","Explore customer risk patterns and experiment with hypothetical scenarios.")
st.warning("Preview mode · The trained model and verified inference pipeline are not connected yet.")
with st.container(border=True):
    panel_title("Scenario lab","Adjust customer attributes to preview the interaction design.")
    x,y,z=st.columns(3)
    tenure=x.slider("Customer tenure",1,72,18,help="Months as a customer")
    monthly=y.slider("Monthly charges (SAR)",50,600,250,10)
    tickets=z.slider("Support tickets",0,12,2)
    if st.button("Run scenario preview",type="primary"):
        score=min(.92,max(.05,.48-tenure*.003+(monthly-250)/1800+tickets*.025))
        st.metric("Illustrative risk score",f"{score:.0%}")
        st.caption("Demonstration formula only — not a trained-model prediction.")
st.write("")
df=churn_sample()
with st.container(border=True):
    panel_title("Customer risk explorer","Filter and inspect generated sample records.")
    threshold=st.slider("Minimum illustrative churn probability",0.,1.,0.,.05)
    filtered=df[df.churn_probability>=threshold].sort_values("churn_probability",ascending=False)
    st.dataframe(filtered,use_container_width=True,hide_index=True)
with st.container(border=True):
    panel_title("Risk driver exploration","Relationship between customer attributes and sample risk scores.")
    metric=st.selectbox("Choose an attribute",["tenure_months","monthly_charges","support_tickets"])
    fig=px.scatter(df,x=metric,y="churn_probability",color="risk_level",
        color_discrete_map={"Low":"#8BC9B9","Medium":"#F2C77B","High":"#E78D96"},
        labels={"churn_probability":"Illustrative risk score"})
    st.plotly_chart(apply_layout(fig,360),use_container_width=True,config={"displayModeBar":False})
