import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Lightbox from './Lightbox'
import { MEDIA_CONFIG } from './config'
import { sendTelemetryEvent } from './telemetry'
import './GalleryPage.css'

const DEFAULT_LETTER = `Scumpa mea,

Această galerie este creată special pentru tine, cu toate amintirile noastre cele mai frumoase. 

Fiecare poză și fiecare videoclip surprinde un moment în care ai fost pur și simplu minunată. Ești lumina zilelor mele și cel mai frumos cadou din viața mea!

Cu toată dragostea mea,
❤️`

export default function GalleryPage() {
  const navigate = useNavigate()
  const scrollRef = useRef(null)

  const [mediaList] = useState(MEDIA_CONFIG)

  const [letterMessage, setLetterMessage] = useState(() => {
    try {
      return localStorage.getItem('lily_gallery_letter') || DEFAULT_LETTER
    } catch {
      return DEFAULT_LETTER
    }
  })

  const [selectedItem, setSelectedItem] = useState(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isEditingLetter, setIsEditingLetter] = useState(false)
  const [tempLetter, setTempLetter] = useState(letterMessage)

  // Log arrival in Gallery
  useEffect(() => {
    sendTelemetryEvent(
      '🖼️ Galerie Deschisă',
      'Utilizatorul explorează galeria orizontală cu fotografii și videoclipuri.',
      0x38bdf8,
      [
        { name: '📍 Pagină', value: 'GalleryPage', inline: true },
        { name: '🎞️ Total Elemente', value: `${mediaList.length} amintiri`, inline: true },
      ]
    )
  }, [mediaList.length])

  const handleOpenMedia = (item) => {
    sendTelemetryEvent(
      `👁️ Vizualizare ${item.mediaType === 'video' ? 'Videoclip' : 'Fotografie'}`,
      `Utilizatorul a deschis în detaliu: "${item.name || item.id}"`,
      0x0284c7,
      [
        { name: '📁 Tip', value: item.mediaType, inline: true },
        { name: '🏷️ Nume', value: item.name || 'Fără titlu', inline: true },
      ]
    )
    setSelectedItem(item)
  }

  const handleOpenGiftCard = () => {
    sendTelemetryEvent(
      '🎁 Cadoul Special (Scrisoarea) a fost deschis!',
      'Utilizatorul a ajuns la capătul galeriei și a deschis scrisoarea de dragoste secretă.',
      0xe11d48
    )
    setIsDrawerOpen(true)
  }

  const handleSaveLetter = () => {
    setLetterMessage(tempLetter)
    try {
      localStorage.setItem('lily_gallery_letter', tempLetter)
    } catch (err) {
      console.warn('Could not save letter', err)
    }
    setIsEditingLetter(false)
  }

  // Horizontal scroll handler with mouse wheel
  const handleWheelScroll = (e) => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += e.deltaY * 1.5
    }
  }

  return (
    <div className="gallery-page">
      {/* ── STATIC TOP HEADER (FIXED & SEAMLESS) ── */}
      <header className="gallery-topbar-seamless">
        <button className="back-btn" onClick={() => navigate('/home')}>
          ← Înapoi
        </button>

        <div className="gallery-message-header">
          <h2 className="romantic-handwritten-text">
            Aceasta este povestea cadourilor făcute pentru tine.
          </h2>
          <span className="ps-handwritten-tag">✨ dă scroll spre dreapta pentru a păși în poveste ✨</span>
        </div>

        <div className="topbar-right-spacer" />
      </header>

      {/* ── HORIZONTAL SCROLLING CONTAINER ── */}
      <main className="horizontal-scroll-container" ref={scrollRef} onWheel={handleWheelScroll}>
        <div className="horizontal-grid">
          {/* Media Cards */}
          {mediaList.map((item) => (
            <div
              key={item.id}
              className={`portrait-card ${item.mediaType === 'video' ? 'is-video' : ''}`}
              onClick={() => handleOpenMedia(item)}
            >
              <div className="card-image-wrap">
                {item.mediaType === 'video' && !item.thumb ? (
                  <video
                    src={`${item.src}#t=0.5`}
                    preload="metadata"
                    muted
                    className="card-video-preview"
                  />
                ) : (
                  <img
                    src={item.thumb || item.src}
                    alt=""
                    loading="lazy"
                  />
                )}

                {item.mediaType === 'video' && (
                  <div className="video-overlay-badge">
                    <span className="play-triangle">▶</span>
                    <span className="video-quality-tag">1080p 60fps</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* ── GIFT CARD (FAR AT THE END OF THE SCROLL) ── */}
          <div className="gift-card-spacer" />
          
          <div className="gift-card-wrapper" onClick={handleOpenGiftCard}>
            <div className="gift-card">
              <div className="gift-card-inner">
                <div className="gift-bow">🎁</div>
                <h3>Cadoul Tău Special</h3>
                <p>Apasă pentru a deschide scrisoarea mea secretă ❤️</p>
                <div className="sparkles-decor">✨ 💌 ✨</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── SIDE DRAWER FOR SECRET MESSAGE ── */}
      {isDrawerOpen && (
        <div className="drawer-overlay" onClick={() => setIsDrawerOpen(false)}>
          <div className="side-drawer" onClick={e => e.stopPropagation()}>
            <button className="drawer-close" onClick={() => setIsDrawerOpen(false)}>✕</button>

            <div className="drawer-header">
              <span className="letter-icon">💌</span>
              <h2>Scrisoare de Dragoste</h2>
            </div>

            <div className="letter-body">
              {isEditingLetter ? (
                <div className="edit-letter-wrap">
                  <textarea
                    value={tempLetter}
                    onChange={e => setTempLetter(e.target.value)}
                    className="letter-textarea"
                    rows={10}
                  />
                  <div className="letter-edit-actions">
                    <button className="btn-save-letter" onClick={handleSaveLetter}>
                      💾 Salvează Mesajul
                    </button>
                    <button className="btn-cancel-letter" onClick={() => setIsEditingLetter(false)}>
                      Anulează
                    </button>
                  </div>
                </div>
              ) : (
                <div className="view-letter-wrap">
                  <div className="letter-paper">
                    {letterMessage.split('\n').map((line, idx) => (
                      <p key={idx}>{line}</p>
                    ))}
                  </div>
                  <button className="btn-edit-letter" onClick={() => { setTempLetter(letterMessage); setIsEditingLetter(true); }}>
                    ✏️ Editează Mesajul
                  </button>
                </div>
              )}
            </div>

            <div className="drawer-footer">
              <span>Făcut cu dragoste pentru tine ❤️</span>
            </div>
          </div>
        </div>
      )}

      {/* ── LIGHTBOX ── */}
      {selectedItem && (
        <Lightbox
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  )
}
