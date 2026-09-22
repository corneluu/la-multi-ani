import { useEffect } from 'react'
import './Lightbox.css'

export default function Lightbox({ item, onClose }) {
  useEffect(() => {
    const esc = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', esc)
    return () => document.removeEventListener('keydown', esc)
  }, [onClose])

  const isVideo = item.mediaType === 'video'
  const isYoutube = isVideo && item.src && item.src.includes('youtube.com')

  return (
    <div className="lb-back" onClick={onClose}>
      <div className="lb-box" onClick={e => e.stopPropagation()}>
        <button className="lb-x" onClick={onClose} aria-label="Închide">✕</button>

        <div className="lb-media-container">
          {isVideo ? (
            isYoutube ? (
              <iframe
                src={item.src}
                title=""
                className="lb-video-frame"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                src={item.src}
                controls
                autoPlay
                playsInline
                className="lb-video-player"
              />
            )
          ) : (
            <img src={item.src} alt="" className="lb-image-full" />
          )}
        </div>
      </div>
    </div>
  )
}
