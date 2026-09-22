import { useEffect } from 'react'
import './Lightbox.css'

export default function Lightbox({ photo, onClose }) {
  useEffect(() => {
    const esc = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', esc)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', esc)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className="lb-backdrop" onClick={onClose}>
      <div className="lb-modal" onClick={e => e.stopPropagation()}>
        <button className="lb-close" onClick={onClose}>✕</button>
        <div className="lb-img-wrap">
          <img src={photo.src} alt={photo.name} />
        </div>
        <div className="lb-info">
          <span className="lb-badge">{photo.type.charAt(0).toUpperCase() + photo.type.slice(1)}</span>
          <h3 className="lb-name">{photo.name}</h3>
          <p className="lb-desc">{photo.desc}</p>
          <span className="lb-likes">❤️ {photo.likes} loves</span>
        </div>
      </div>
    </div>
  )
}
