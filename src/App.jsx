import { useState } from 'react';
import { LayoutDashboard, Activity, Users, Sparkles, Command, ArrowUpRight, ShieldCheck, BrainCircuit, RefreshCw } from 'lucide-react';
import { kpis, drivers, segments, modelResults, clusteringResults, genaiMethods } from './data';

const sections = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'predictions', label: 'Real-time predictions', icon: Activity },
  { id: 'segments', label: 'Cluster segmentations', icon: Users },
  { id: 'genai', label: 'GenAI strategic explanations', icon: Sparkles },
];

function Brand() {
  return <div className="brand"><div className="brand-mark"><Command size={19} /></div><div><div className="brand-name">Northstar<span>.</span></div><div className="brand-caption">CUSTOMER INTELLIGENCE</div></div></div>;
}

function Sidebar({ page, setPage }) {
  return <aside className="sidebar"><div className="sidebar-head"><Brand /></div><nav className="simple-nav">{sections.map(({ id, label, icon: Icon }) => <button key={id} className={'nav-item ' + (page === id ? 'nav-active' : '')} onClick={() => setPage(id)}><Icon size={18} /><span>{label}</span></button>)}</nav></aside>;
}

function PageHeading({ eyebrow, title, subtitle }) {
  return <div className="page-heading"><div><div className="eyebrow"><i /> {eyebrow}</div><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div></div>;
}

function StatCards({ items }) {
  return <section className="stats-grid">{items.map((item, i) => <article className="stat-card" key={item.label}><div className="stat-top"><span>{item.label}</span><div className={'stat-icon ' + ['violet','rose','mint','amber'][i % 4]}>{i === 0 ? <Users size={17}/> : i === 1 ? <Activity size={17}/> : i === 2 ? <ShieldCheck size={17}/> : <LayoutDashboard size={17}/>}</div></div><div className="stat-value-row"><strong>{item.value}</strong></div><small>{item.note}</small></article>)}</section>;
}

function Overview({ setPage }) {
  return <>
    <PageHeading eyebrow="EXECUTIVE OVERVIEW" title="Executive Overview" subtitle="A concise view of the customer intelligence dataset and model findings." />
    <StatCards items={kpis} />
    <section className="panel drivers-panel"><div className="panel-heading"><div><h3>Key Driver Charts</h3><p>Relative feature importance · exploratory baseline</p></div><span className="soft-tag">TOP DRIVERS</span></div><div className="drivers">{drivers.map(d => <div className="driver" key={d.name}><span>{d.name}</span><div><i style={{width:d.score+'%',background:d.color}} /></div><b>{d.score}</b></div>)}</div><p className="fine-print">These scores are illustrative feature-driver values, not validated model explainability scores.</p></section>
    <section className="section-links" aria-label="Dashboard sections">{sections.filter(s=>s.id!=='overview').map(({id,label,icon:Icon})=><button className="section-link" key={id} onClick={()=>setPage(id)}><span className="section-link-icon"><Icon size={18}/></span><span>{label}</span><ArrowUpRight size={15}/></button>)}</section>
  </>;
}

function PredictionsPage() {
  const [tenure, setTenure] = useState(12);
  const [charges, setCharges] = useState(150);
  const [tickets, setTickets] = useState(2);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  async function runPrediction() {
    setLoading(true); setResult(null);
    try {
      const response = await fetch('http://localhost:8000/api/predict/churn', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({tenure_months:tenure,monthly_charges:charges,support_tickets:tickets})});
      const data = await response.json();
      setResult(data);
    } catch (error) { setResult({status:'offline',message:'The API could not be reached. Start the FastAPI backend to check its current configuration.'}); }
    finally { setLoading(false); }
  }
  return <>
    <PageHeading eyebrow="PREDICTIVE ANALYTICS" title="Real-time predictions" subtitle="Model evaluation results and a scenario input panel for the churn prediction API." />
    <div className="notice"><b>Live inference is not enabled yet.</b> The trained Logistic Regression artifact and preprocessing pipeline are not connected to the API. The evaluation metrics below are from offline testing, not live predictions.</div>
    <div className="content-grid scenario-grid">
      <section className="panel"><div className="panel-heading"><div><h3>Customer scenario</h3><p>Adjust customer attributes and check API readiness.</p></div><span className="soft-tag">INPUT</span></div>
        <div className="sliders">
          <div><div className="slider-title"><b>Tenure (months)</b><span>{tenure}</span></div><input type="range" min="0" max="72" value={tenure} onChange={e=>setTenure(Number(e.target.value))}/><div className="slider-limits"><span>0 months</span><span>72 months</span></div></div>
          <div><div className="slider-title"><b>Monthly charges</b><span>SAR {charges}</span></div><input type="range" min="0" max="500" step="5" value={charges} onChange={e=>setCharges(Number(e.target.value))}/><div className="slider-limits"><span>SAR 0</span><span>SAR 500</span></div></div>
          <div><div className="slider-title"><b>Support tickets</b><span>{tickets}</span></div><input type="range" min="0" max="20" value={tickets} onChange={e=>setTickets(Number(e.target.value))}/><div className="slider-limits"><span>0 tickets</span><span>20 tickets</span></div></div>
        </div>
        <button className="primary-button full-button" onClick={runPrediction} disabled={loading}>{loading?<RefreshCw size={14}/>:<Activity size={14}/>} {loading?'Checking API…':'Run prediction API check'}</button>
        {result && <div className="notice small-notice"><b>API status: {result.status}</b><br/>{result.message || 'The API returned a response, but no prediction score is available.'}</div>}
      </section>
      <section className="panel"><div className="panel-heading"><div><h3>Selected model · Logistic Regression</h3><p>Offline evaluation on the project dataset.</p></div><span className="soft-tag">BASELINE</span></div>
        <div className="assessment"><div className="risk-ring" style={{'--risk':'94.59%'}}><div><b>94.59%</b><small>Accuracy</small></div></div><span className="status medium">Offline evaluation</span><p>Performance metrics summarize the evaluated baseline. They do not represent confidence for an individual customer.</p></div>
      </section>
    </div>
    <section className="panel mt-panel"><div className="panel-heading"><div><h3>Model performance comparison</h3><p>Baseline and tuned model results.</p></div><span className="soft-tag">TEST RESULTS</span></div>
      <div className="table-wrap"><table><thead><tr><th>Model</th><th>Accuracy</th><th>Precision</th><th>Recall</th><th>F1-score</th><th>ROC-AUC</th></tr></thead><tbody>{modelResults.map(m=><tr key={m.name}><td><b>{m.name}</b></td><td>{m.accuracy}</td><td>{m.precision}</td><td>{m.recall}</td><td>{m.f1}</td><td>{m.auc}</td></tr>)}</tbody></table></div>
    </section>
  </>;
}

function SegmentsPage() {
  return <>
    <PageHeading eyebrow="CUSTOMER ANALYTICS" title="Cluster segmentations" subtitle="Unsupervised customer grouping results from the segmentation experiments." />
    <div className="notice"><b>Exploratory clustering:</b> K-Means produced 3 groups. The silhouette score is low, so cluster separation is limited and the segments should be interpreted cautiously.</div>
    <section className="panel"><div className="panel-heading"><div><h3>K-Means customer segments</h3><p>Distribution across 100,000 synthetic customer records.</p></div><span className="soft-tag">K = 3</span></div>
      <div className="segment-cards">{segments.map((s,i)=><article className="stat-card" key={s.name}><div className="segment-top"><b>{s.name}</b><i style={{background:s.color}}/></div><strong>{s.customers.toLocaleString('en-US')}</strong><small>customers · {s.share}% of dataset</small><div className="segment-bar"><i style={{width:s.share+'%',background:s.color}}/></div><p>{s.desc}</p></article>)}</div>
    </section>
    <div className="content-grid segment-grid">
      <section className="panel"><div className="panel-heading"><div><h3>Clustering quality</h3><p>Internal validation metrics.</p></div></div><div className="table-wrap"><table><thead><tr><th>Algorithm</th><th>Clusters</th><th>Silhouette</th><th>Davies–Bouldin</th></tr></thead><tbody>{clusteringResults.map(r=><tr key={r.name}><td><b>{r.name}</b></td><td>{r.clusters}</td><td>{r.silhouette}</td><td>{r.daviesBouldin}</td></tr>)}</tbody></table></div><p className="fine-print">Higher silhouette and lower Davies–Bouldin generally indicate better-defined clusters.</p></section>
      <section className="panel"><div className="panel-heading"><div><h3>Segment insight</h3><p>Observed churn pattern.</p></div><span className="soft-tag">K-MEANS</span></div><div className="assessment"><div className="risk-ring" style={{'--risk':'54.11%'}}><div><b>54.11%</b><small>Churn rate</small></div></div><span className="status high">Highest churn segment</span><p>Low-Engagement Customers recorded the highest churn rate among the K-Means groups.</p></div></section>
    </div>
  </>;
}

function GenAIPage() {
  const [method,setMethod] = useState('Zero-shot');
  const [brief,setBrief] = useState(null);
  const [loading,setLoading] = useState(false);
  async function checkInsights() {
    setLoading(true); setBrief(null);
    try { const response=await fetch('http://localhost:8000/api/insights'); const data=await response.json(); setBrief(data); }
    catch(error) { setBrief({status:'offline',message:'The API could not be reached. Start the FastAPI backend to check its current configuration.'}); }
    finally { setLoading(false); }
  }
  const selected=genaiMethods.find(x=>x.name===method);
  return <>
    <PageHeading eyebrow="GENERATIVE INTELLIGENCE" title="GenAI strategic explanations" subtitle="Prompting approaches prepared to turn customer-risk signals into executive-friendly explanations." />
    <section className="hero-banner"><div className="hero-copy"><span><Sparkles size={12}/> GENERATIVE AI WORKFLOW</span><h2>From model signals<br/>to strategic actions.</h2><p>Use structured customer context and churn indicators to produce concise explanations and actionable retention recommendations.</p></div><div className="hero-orb"><BrainCircuit size={55}/></div></section>
    <div className="content-grid insight-grid">
      <section className="panel"><div className="panel-heading"><div><h3>Prompt strategy</h3><p>Choose one of the project prompt templates.</p></div></div><span className="field-label">PROMPTING METHOD</span><div className="choice-grid">{genaiMethods.map(x=><button key={x.name} className={method===x.name?'chosen':''} onClick={()=>{setMethod(x.name);setBrief(null)}}>{x.name}</button>)}</div><div className="briefing" style={{marginTop:16}}><span className="soft-tag">{selected.name.toUpperCase()}</span><h3>{selected.title}</h3><p>{selected.description}</p><hr/><b>Expected input context</b><ul>{selected.inputs.map(x=><li key={x}>{x}</li>)}</ul></div><button className="primary-button full-button" onClick={checkInsights} disabled={loading}>{loading?'Checking service…':'Check GenAI API status'}</button>{brief&&<div className="notice small-notice"><b>API status: {brief.status}</b><br/>{brief.message}</div>}</section>
      <section className="panel"><div className="panel-heading"><div><h3>Strategic explanation structure</h3><p>What the generated briefing is designed to communicate.</p></div><span className="soft-tag">OUTPUT FORMAT</span></div><div className="briefing"><span className="field-label">EXECUTIVE SUMMARY</span><h3>Customer retention briefing</h3><p>A concise summary of the customer-risk situation, grounded in the supplied model outputs.</p><hr/><b>1. Key risk signals</b><p>Highlight the strongest supplied churn indicators and explain their relevance without inventing causes.</p><b>2. Business implications</b><p>Translate the observed risk patterns into potential customer-retention concerns.</p><b>3. Recommended actions</b><ul><li>Prioritize high-risk customer groups for review.</li><li>Investigate low-engagement patterns and support activity.</li><li>Track retention outcomes after interventions.</li></ul><p className="fine-print">This is the intended response structure, not a live AI-generated recommendation.</p></div></section>
    </div>
    <div className="notice mt-panel"><b>Integration status:</b> Zero-shot and Few-shot prompt approaches are documented in the project. Live generation is not enabled until the secured GenAI provider and API credentials are connected.</div>
  </>;
}

export default function App() {
  const [page,setPage] = useState('overview');
  return <div className="app"><Sidebar page={page} setPage={setPage}/><div className="main-shell"><main className="main-content">{page==='overview'?<Overview setPage={setPage}/>:page==='predictions'?<PredictionsPage/>:page==='segments'?<SegmentsPage/>:<GenAIPage/>}<footer><span>Northstar · Customer Intelligence</span><span><i/> Prototype · model integrations pending</span></footer></main></div></div>;
}
