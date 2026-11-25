// -----------------------------------------------------------------------------
// Project identity
// -----------------------------------------------------------------------------
export const projectName =
  "CCO Retail Intelligence and Customer Retention Advisory System";
export const shortName = "CCO Retail Intelligence";

// -----------------------------------------------------------------------------
// Executive overview: headline KPIs and exploratory correlation findings
// -----------------------------------------------------------------------------
export const kpis = [
  {
    label: "Total customers",
    value: "100,000",
    note: "Retail Intelligence synthetic dataset",
  },
  {
    label: "Observed churn",
    value: "46.22%",
    note: "46,224 churned customers",
  },
  {
    label: "Baseline accuracy",
    value: "94.59%",
    note: "Logistic Regression · test set",
  },
  {
    label: "K-Means segments",
    value: "3",
    note: "Exploratory customer groups",
  },
];

export const drivers = [
  {
    name: "Recency days",
    value: "r = 0.77",
    detail: "Strongest reported positive correlation with churn",
    tone: "#756BF6",
  },
  {
    name: "Cart abandonment",
    value: "r = 0.23",
    detail: "Positive correlation with churn",
    tone: "#E9A35B",
  },
  {
    name: "Loyalty score",
    value: "r = −0.18",
    detail: "Negative correlation with churn",
    tone: "#39B7A4",
  },
  {
    name: "Engagement score",
    value: "r = −0.15",
    detail: "Negative correlation with churn",
    tone: "#8E86FA",
  },
];

// -----------------------------------------------------------------------------
// Customer segments and offline model evaluation results from the team project
// -----------------------------------------------------------------------------
export const segments = [
  {
    name: "High-Volume Buyers",
    customers: 37796,
    share: 37.796,
    churn: 44.02,
    color: "#756BF6",
    desc: "Buy frequently and spend the most. Project interpretation recommends loyalty rewards.",
  },
  {
    name: "Low-Engagement Customers",
    customers: 31485,
    share: 31.485,
    churn: 54.11,
    color: "#39B7A4",
    desc: "Fewer website visits, lower email opens, and higher cart abandonment. Highest observed churn.",
  },
  {
    name: "Engaged Light Buyers",
    customers: 30719,
    share: 30.719,
    churn: 40.86,
    color: "#F0B75E",
    desc: "Purchase less often but show higher email engagement. Project interpretation suggests relevant recommendations to raise order size.",
  },
];

export const modelResults = [
  {
    name: "Logistic Regression · Baseline",
    accuracy: "94.59%",
    precision: "94.19%",
    recall: "94.10%",
    f1: "94.15%",
    auc: "99.04%",
  },
  {
    name: "Random Forest · Baseline",
    accuracy: "94.21%",
    precision: "93.89%",
    recall: "93.55%",
    f1: "93.72%",
    auc: "98.80%",
  },
  {
    name: "Logistic Regression · Tuned",
    accuracy: "94.55%",
    precision: "94.18%",
    recall: "94.01%",
    f1: "94.09%",
    auc: "99.04%",
  },
  {
    name: "Random Forest · Tuned",
    accuracy: "94.24%",
    precision: "93.87%",
    recall: "93.65%",
    f1: "93.76%",
    auc: "98.82%",
  },
];

export const clusteringResults = [
  {
    name: "K-Means",
    clusters: "3",
    silhouette: "0.099",
    daviesBouldin: "2.448",
  },
  {
    name: "Gaussian Mixture Model",
    clusters: "4",
    silhouette: "0.008",
    daviesBouldin: "18.561",
  },
];

// -----------------------------------------------------------------------------
// GenAI prompt-method descriptions displayed in the recommendations page
// -----------------------------------------------------------------------------
export const genaiMethods = [
  {
    name: "Zero-shot",
    title: "Direct instruction prompting",
    description:
      "Project Zero-shot template: executive instructions without worked examples.",
    inputs: [
      "Predicted churn class and probability",
      "Recency days",
      "Loyalty score",
      "Cart abandonment rate",
    ],
  },
  {
    name: "Few-shot",
    title: "Example-guided prompting",
    description:
      "Project Few-shot approach with examples to guide structure and tone.",
    inputs: [
      "Predicted churn class and probability",
      "Recency days",
      "Loyalty score",
      "Cart abandonment rate",
      "Demonstration examples",
    ],
  },
];

// -----------------------------------------------------------------------------
// Default customer profile used to prefill the prediction and GenAI forms
// -----------------------------------------------------------------------------
export const initialCustomer = {
  age_group: "25-34",
  gender: "Female",
  region: "Central",
  customer_segment: "Returning",
  preferred_channel: "Online",
  purchase_frequency: 8,
  avg_order_value: 205,
  total_spent: 1700,
  recency_days: 180,
  website_visits: 40,
  discount_usage_rate: 0.42,
  email_open_rate: 0.47,
  cart_abandonment_rate: 0.45,
  loyalty_score: 55,
  engagement_score: 51,
};

// Form metadata for all 15 model input features.
// Keeping labels, options, and numeric limits here avoids repeating them in JSX.
export const customerFields = [
  {
    name: "age_group",
    label: "Age group",
    type: "select",
    options: ["18-24", "25-34", "35-44", "45-54", "55+"],
  },
  {
    name: "gender",
    label: "Gender",
    type: "select",
    options: ["Female", "Male"],
  },
  {
    name: "region",
    label: "Region",
    type: "select",
    options: ["Central", "East", "North", "South", "West"],
  },
  {
    name: "customer_segment",
    label: "Customer segment",
    type: "select",
    options: ["New", "Returning", "VIP", "Loyal"],
  },
  {
    name: "preferred_channel",
    label: "Preferred channel",
    type: "select",
    options: ["In-Store", "Mobile App", "Online"],
  },
  { name: "purchase_frequency", label: "Purchase frequency", min: 0, max: 1000, step: 1 },
  { name: "avg_order_value", label: "Average order value", min: 0, max: 100000, step: 0.01 },
  { name: "total_spent", label: "Total spent", min: 0, max: 10000000, step: 0.01 },
  { name: "recency_days", label: "Recency (days)", min: 0, max: 10000, step: 1 },
  { name: "website_visits", label: "Website visits", min: 0, max: 100000, step: 1 },
  { name: "loyalty_score", label: "Loyalty score", min: 0, max: 100, step: 0.1 },
  { name: "engagement_score", label: "Engagement score", min: 0, max: 100, step: 0.1 },
  { name: "discount_usage_rate", label: "Discount usage rate (0–1)", min: 0, max: 1, step: 0.01 },
  { name: "email_open_rate", label: "Email open rate (0–1)", min: 0, max: 1, step: 0.01 },
  { name: "cart_abandonment_rate", label: "Cart abandonment rate (0–1)", min: 0, max: 1, step: 0.01 },
];
