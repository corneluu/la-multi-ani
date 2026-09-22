import './Hero.css'

const petals = ['🌸','🌺','💐','🌷','🌸','💕','🌺','🌸']

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg" />
      <div className="hero-petals">
        {petals.map((p, i) => (
          <span key={i} className={`petal petal-${i}`}>{p}</span>
        ))}
      </div>
      <div className="hero-content">
        <p className="hero-eyebrow">✨ A garden made just for you ✨</p>
        <h1 className="hero-title">
          The World of<br />
          <span className="hero-highlight">Lilies</span>
        </h1>
        <p className="hero-desc">
          Discover the most beautiful lily varieties — a gift of petals and love, captured forever.
        </p>
        <div className="hero-actions">
          <a href="#gallery" className="btn-primary">Explore Gallery 🌸</a>
          <a href="#videos" className="btn-ghost">Watch Videos ▶</a>
        </div>
      </div>
    </section>
  )
}
