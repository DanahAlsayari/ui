import { LayoutDashboard, Activity, Users, Sparkles, Command } from 'lucide-react';
import { kpis, drivers } from './data';

const sections = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'predictions', label: 'Real-time predictions', icon: Activity },
  { id: 'segments', label: 'Cluster segmentations', icon: Users },
  { id: 'genai', label: 'GenAI strategic explanations', icon: Sparkles },
];

function Brand() {
  return (
    <div className="brand">
      <div className="brand-mark"><Command size={19} /></div>
      <div>
        <div className="brand-name">Northstar<span>.</span></div>
        <div className="brand-caption">CUSTOMER INTELLIGENCE</div>
      </div>
    </div>
  );
}

function Sidebar({ page, setPage }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-head"><Brand /></div>
      <nav className="simple-nav">
        {sections.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={'nav-item ' + (page === id ? 'nav-active' : '')}
            onClick={() => setPage(id)}
          >
            <Icon size={18} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}

function Overview({ setPage }) {
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow"><i /> EXECUTIVE OVERVIEW</div>
          <h1>Executive Overview</h1>
          <p>A concise view of the key customer intelligence metrics.</p>
        </div>
      </div>

      <section className="stats-grid">
        {kpis.map((kpi, index) => (
          <article className="stat-card" key={kpi.label}>
            <div className="stat-top">
              <span>{kpi.label}</span>
              <div className={'stat-icon ' + kpi.tone}>
                {index === 0 ? <Users size={17} /> : index === 1 ? <Activity size={17} /> : index === 2 ? <Activity size={17} /> : <LayoutDashboard size={17} />}
              </div>
            </div>
            <div className="stat-value-row"><strong>{kpi.value}</strong></div>
            <small>{kpi.note}</small>
          </article>
        ))}
      </section>

      <section className="panel drivers-panel">
        <div className="panel-heading">
          <div>
            <h3>Key Driver Charts</h3>
            <p>Relative feature importance · illustrative baseline values</p>
          </div>
          <span className="soft-tag">TOP DRIVERS</span>
        </div>
        <div className="drivers">
          {drivers.map((driver) => (
            <div className="driver" key={driver.name}>
              <span>{driver.name}</span>
              <div><i style={{ width: driver.score + '%', background: driver.color }} /></div>
              <b>{driver.score}</b>
            </div>
          ))}
        </div>
        <p className="fine-print">Illustrative values only. Replace with validated model explainability output before presenting as actual results.</p>
      </section>

      <section className="section-links" aria-label="Dashboard sections">
        {sections.filter((section) => section.id !== 'overview').map(({ id, label, icon: Icon }) => (
          <button className="section-link" key={id} onClick={() => setPage(id)}>
            <span className="section-link-icon"><Icon size={18} /></span>
            <span>{label}</span>
          </button>
        ))}
      </section>
    </>
  );
}

const sectionDetails = {
  predictions: {
    eyebrow: 'PREDICTIVE ANALYTICS',
    title: 'Real-time predictions',
  },
  segments: {
    eyebrow: 'CUSTOMER ANALYTICS',
    title: 'Cluster segmentations',
  },
  genai: {
    eyebrow: 'GENERATIVE INTELLIGENCE',
    title: 'GenAI strategic explanations',
  },
};

function SectionPage({ page }) {
  const section = sectionDetails[page];
  return (
    <div className="page-heading">
      <div>
        <div className="eyebrow"><i /> {section.eyebrow}</div>
        <h1>{section.title}</h1>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = React.useState('overview');
  return (
    <div className="app">
      <Sidebar page={page} setPage={setPage} />
      <div className="main-shell">
        <main className="main-content">
          {page === 'overview' ? <Overview setPage={setPage} /> : <SectionPage page={page} />}
          <footer><span>Northstar · Customer Intelligence</span></footer>
        </main>
      </div>
    </div>
  );
}
