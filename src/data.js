export const kpis = [
  { label: 'Total customers', value: '100,000', note: 'synthetic project dataset' },
  { label: 'Customers at risk', value: '46,200', note: '46.2% observed churn rate' },
  { label: 'Model accuracy', value: '94.59%', note: 'Logistic Regression · offline test' },
  { label: 'Customer segments', value: '3', note: 'K-Means exploratory groups' },
];

export const drivers = [
  { name: 'Contract type', score: 86, color: '#756BF6' },
  { name: 'Tenure', score: 72, color: '#8E86FA' },
  { name: 'Monthly charges', score: 61, color: '#B0AAF9' },
  { name: 'Support activity', score: 48, color: '#C5C1F7' },
  { name: 'Payment method', score: 34, color: '#D9D7F8' },
];

export const segments = [
  { name: 'Segment 01', customers: 38200, share: 38.2, color: '#756BF6', desc: 'Largest group' },
  { name: 'Segment 02', customers: 34100, share: 34.1, color: '#39B7A4', desc: 'Growth opportunity' },
  { name: 'Segment 03', customers: 27700, share: 27.7, color: '#F0B75E', desc: 'Needs exploration' },
];

export const modelResults = [
  { name: 'Logistic Regression · Baseline', accuracy: '94.59%', precision: '94.19%', recall: '94.10%', f1: '94.15%', auc: '99.04%' },
  { name: 'Random Forest · Baseline', accuracy: '94.21%', precision: '93.89%', recall: '93.55%', f1: '93.72%', auc: '98.80%' },
  { name: 'Logistic Regression · Tuned', accuracy: '94.55%', precision: '94.18%', recall: '94.01%', f1: '94.09%', auc: '99.04%' },
  { name: 'Random Forest · Tuned', accuracy: '94.24%', precision: '93.87%', recall: '93.65%', f1: '93.76%', auc: '98.82%' },
];

export const clusteringResults = [
  { name: 'K-Means', clusters: '3', silhouette: '0.099', daviesBouldin: '2.448' },
  { name: 'Gaussian Mixture Model', clusters: '4', silhouette: '0.008', daviesBouldin: '18.561' },
];

export const genaiMethods = [
  { name: 'Zero-shot', title: 'Direct instruction prompting', description: 'Ask the model to explain supplied customer-risk information and produce a structured executive summary without showing examples.', inputs: ['Customer attributes and context', 'Churn probability from the predictive model', 'Observed churn-risk indicators'] },
  { name: 'Few-shot', title: 'Example-guided prompting', description: 'Provide representative input/output examples before asking the model to explain a new customer-risk case in the same structured style.', inputs: ['Customer attributes and context', 'Churn probability from the predictive model', 'Observed churn-risk indicators', 'A small set of demonstration examples'] },
];
