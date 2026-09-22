import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-glow" />
      <div className="footer-content">
        <div className="footer-petals">
          {['❤️','🌸','💕','🌺','💐'].map((p, i) => (
            <span key={i} className={`fp fp-${i}`}>{p}</span>
          ))}
        </div>
        <span className="footer-icon">🌸</span>
        <h2 className="footer-title">Made with Love, Just for You</h2>
        <p className="footer-msg">
          Every lily in this garden is a reminder of how beautiful you are 🌸
        </p>
        <div className="footer-divider" />
        <p className="footer-credits">© 2026 LilyGarden • With all my love ❤️</p>
      </div>
    </footer>
  )
}
