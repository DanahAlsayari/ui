import streamlit as st

st.set_page_config(page_title="GenAI Strategic Insights", page_icon="✨", layout="wide")
st.title("GenAI Strategic Insights")
st.caption("Turn customer and segment context into clear, actionable executive summaries.")

st.warning("Demo mode: this page uses illustrative example content. It is not a live GenAI API response.")
customer_type = st.radio("Insight context", ["At-risk customer", "Customer segment"], horizontal=True)
if customer_type == "At-risk customer":
    selected = st.selectbox("Customer scenario", ["High support usage", "Short tenure", "High monthly charges"])
    context = {
        "High support usage": "Repeated support interactions may indicate unresolved friction.",
        "Short tenure": "A short customer relationship can mean loyalty is not yet established.",
        "High monthly charges": "Price sensitivity may be a factor when charges are relatively high.",
    }[selected]
else:
    selected = st.selectbox("Segment", ["Segment 0", "Segment 1", "Segment 2", "Segment 3"])
    context = f"{selected} is a sample segment used to demonstrate the insights layout."

st.subheader("Context")
st.write(context)
if st.button("Generate demo insight", type="primary"):
    st.subheader("Executive explanation")
    st.write("The selected pattern may represent an opportunity to improve customer experience. Validate the underlying customer-level evidence before prioritizing an intervention.")
    st.subheader("Suggested actions")
    st.markdown("- Review recent customer interactions and unresolved issues.\n- Validate the pattern against the project's approved data.\n- Run a small, measurable retention experiment before scaling.")
    st.caption("Example wording only. No AI model was called.")
