import './Types.css'

const types = [
  { id: 'all',      emoji: '💐', label: 'All',      sub: 'Show everything' },
  { id: 'oriental', emoji: '🌸', label: 'Oriental', sub: 'Fragrant & lush' },
  { id: 'asiatic',  emoji: '🌺', label: 'Asiatic',  sub: 'Vivid & bold' },
  { id: 'trumpet',  emoji: '🎺', label: 'Trumpet',  sub: 'Elegant & tall' },
  { id: 'tiger',    emoji: '🐯', label: 'Tiger',    sub: 'Wild & striking' },
  { id: 'calla',    emoji: '🤍', label: 'Calla',    sub: 'Pure & graceful' },
]

export default function Types({ activeFilter, setActiveFilter }) {
  return (
    <section id="types" className="types-section">
      <div className="container">
        <p className="section-eyebrow">Explore by variety</p>
        <h2 className="section-title">Lily Varieties</h2>
        <div className="types-grid">
          {types.map(t => (
            <button
              key={t.id}
              className={`type-card ${activeFilter === t.id ? 'active' : ''}`}
              onClick={() => setActiveFilter(t.id)}
            >
              <span className="type-emoji">{t.emoji}</span>
              <strong>{t.label}</strong>
              <span className="type-sub">{t.sub}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
