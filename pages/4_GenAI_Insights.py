import streamlit as st
from utils.theme import inject_theme, sidebar_brand, page_intro, panel_title

st.set_page_config(page_title="GenAI insights",page_icon="✦",layout="wide")
inject_theme(); sidebar_brand()
page_intro("GENERATIVE AI","Strategic insights","Translate customer signals into clear explanations and practical next steps.")
st.info("Preview mode · This page shows sample content only. No live GenAI API call is made.")
with st.container(border=True):
    panel_title("Insight builder","Choose the context for your executive summary.")
    kind=st.radio("Insight context",["At-risk customer","Customer segment"],horizontal=True)
    if kind=="At-risk customer":
        selected=st.selectbox("Customer pattern",["High support usage","Short tenure","High monthly charges"])
        context={"High support usage":"Repeated support interactions may signal unresolved friction.",
                 "Short tenure":"A short relationship may mean loyalty is not yet established.",
                 "High monthly charges":"Price sensitivity may be a factor when charges are relatively high."}[selected]
    else:
        selected=st.selectbox("Customer segment",["Segment 0","Segment 1","Segment 2","Segment 3"])
        context=f"{selected} is a sample group used to demonstrate the insight layout."
    st.markdown("**Selected context**")
    st.write(context)
    generate=st.button("Generate insight preview",type="primary")
if generate:
    st.write("")
    with st.container(border=True):
        st.markdown('<div class="eyebrow">EXECUTIVE EXPLANATION</div>',unsafe_allow_html=True)
        st.subheader("What this could mean")
        st.write("The selected pattern may indicate an opportunity to improve customer experience. Validate the underlying evidence before prioritizing an intervention.")
        st.markdown("---")
        st.markdown('<div class="eyebrow">RECOMMENDED NEXT STEPS</div>',unsafe_allow_html=True)
        st.markdown("1. Review recent customer interactions and unresolved issues.\n2. Validate the pattern against approved project data.\n3. Run a small, measurable retention experiment before scaling.")
        st.caption("Illustrative copy only. No AI model was called.")
