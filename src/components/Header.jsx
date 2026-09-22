import './Header.css'
import { useState, useEffect } from 'react'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-inner">
        <div className="brand">
          <span className="brand-icon">🌸</span>
          <span className="brand-name">LilyGarden</span>
        </div>
        <nav className="nav">
          <a href="#types">Varieties</a>
          <a href="#gallery">Gallery</a>
          <a href="#videos">Videos</a>
        </nav>
        <span className="header-heart">❤️</span>
      </div>
    </header>
  )
}
