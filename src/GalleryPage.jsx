import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Lightbox from './Lightbox'
import { MEDIA_GROUPS } from './config'
import { sendTelemetryEvent } from './telemetry'
import './GalleryPage.css'

const DEFAULT_LETTER = `Scumpa mea,

Această galerie este creată special pentru tine, cu toate amintirile noastre cele mai frumoase. 

Fiecare poză și fiecare videoclip surprinde un moment în care ai fost pur și simplu minunată. Ești lumina zilelor mele și cel mai frumos cadou din viața mea!

Cu toată dragostea mea,
❤️`

function formatUnlockDate(dateStr) {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    const day = d.getDate().toString().padStart(2, '0')
    const months = ['Ian', 'Feb', 'Mar', 'Apr', 'Mai', 'Iun', 'Iul', 'Aug', 'Sep', 'Oct', 'Noi', 'Dec']
    const month = months[d.getMonth()]
    const hours = d.getHours().toString().padStart(2, '0')
    const minutes = d.getMinutes().toString().padStart(2, '0')
    return `${day} ${month} ${d.getFullYear()}, ${hours}:${minutes}`
  } catch {
    return dateStr
  }
}

export default function GalleryPage({ isSecretUser: propIsSecretUser }) {
  const navigate = useNavigate()
  const scrollRef = useRef(null)

  // Determine if user has secret bypass permissions (via prop or sessionStorage)
  const isSecretUser =
    propIsSecretUser ??
    (typeof window !== 'undefined' && sessionStorage.getItem('lily_secret_mode') === 'true')

  // Real-time tick to dynamically unlock groups when the scheduled time arrives
  const [currentTime, setCurrentTime] = useState(Date.now())

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now())
    }, 2000)
    return () => clearInterval(interval)
  }, [])

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

  // Compute visible groups and items based on unlock dates & secret bypass state
  const visibleGroups = MEDIA_GROUPS.map((group) => {
    const isGroupUnlocked = !group.unlockAt || currentTime >= new Date(group.unlockAt).getTime()

    // If group is locked and user is NOT a secret user, hide the entire group
    if (!isGroupUnlocked && !isSecretUser) {
      return null
    }

    // Filter items inside the group
    const visibleItems = group.items.filter((item) => {
      if (isSecretUser) return true
      const isItemUnlocked = !item.unlockAt || currentTime >= new Date(item.unlockAt).getTime()
      return isItemUnlocked
    })

    if (visibleItems.length === 0 && !isSecretUser) {
      return null
    }

    return {
      ...group,
      isGroupUnlocked,
      items: visibleItems.map((item) => {
        const itemUnlockDate = item.unlockAt || group.unlockAt
        const isItemLocked = itemUnlockDate && currentTime < new Date(itemUnlockDate).getTime()
        return {
          ...item,
          groupId: group.id,
          groupTitle: group.title,
          groupChapter: group.chapterNumber,
          unlockAt: itemUnlockDate,
          isLocked: isItemLocked,
        }
      }),
    }
  }).filter(Boolean)

  const totalVisibleItems = visibleGroups.reduce((acc, g) => acc + g.items.length, 0)

  // Log arrival in Gallery
  useEffect(() => {
    sendTelemetryEvent(
      isSecretUser ? '🌸 Galerie Deschisă (MOD SECRET MARIA)' : '🖼️ Galerie Deschisă',
      `Utilizatorul explorează galeria pe grupuri (${totalVisibleItems} amintiri vizibile, ${visibleGroups.length} capitole).`,
      isSecretUser ? 0xec4899 : 0x38bdf8,
      [
        { name: '📍 Pagină', value: 'GalleryPage', inline: true },
        { name: '🔑 Mod Acces', value: isSecretUser ? 'Secret Bypass (Maria)' : 'Standard (Timer Expirat)', inline: true },
        { name: '🎞️ Total Elemente', value: `${totalVisibleItems} amintiri`, inline: true },
      ]
    )
  }, [totalVisibleItems, isSecretUser, visibleGroups.length])

  const handleOpenMedia = (item) => {
    sendTelemetryEvent(
      `👁️ Vizualizare ${item.mediaType === 'video' ? 'Videoclip' : 'Fotografie'}${item.isLocked ? ' (Programat 🔒)' : ''}`,
      `Utilizatorul a deschis în detaliu: "${item.name || item.id}"${item.isLocked ? ` [Deblocare programată: ${formatUnlockDate(item.unlockAt)}]` : ''}`,
      item.isLocked ? 0xd946ef : 0x0284c7,
      [
        { name: '📁 Tip', value: item.mediaType, inline: true },
        { name: '🏷️ Nume', value: item.name || 'Fără titlu', inline: true },
        { name: '🔒 Programat', value: item.isLocked ? formatUnlockDate(item.unlockAt) : 'Deblocat', inline: true },
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
          {isSecretUser && (
            <div className="secret-mode-indicator">
              🌸 Mod Secret Activ (Maria) — Toate capitolele sunt vizibile
            </div>
          )}
        </div>

        <div className="topbar-right-spacer" />
      </header>

      {/* ── HORIZONTAL SCROLLING CONTAINER ── */}
      <main className="horizontal-scroll-container" ref={scrollRef} onWheel={handleWheelScroll}>
        <div className="horizontal-grid">
          {/* Render Groups and their media items */}
          {visibleGroups.map((group) => (
            <React.Fragment key={group.id}>
              {/* ── CHAPTER INTRO CARD ── */}
              <div className={`chapter-card ${!group.isGroupUnlocked ? 'is-chapter-locked' : ''}`}>
                <div className="chapter-card-inner">
                  <div className="chapter-badge">Capitolul {group.chapterNumber}</div>
                  <h3 className="chapter-title">{group.title}</h3>
                  {group.subtitle && <p className="chapter-subtitle">{group.subtitle}</p>}

                  <div className="chapter-items-count">
                    <span>📸 {group.items.filter((i) => i.mediaType === 'image').length} poze</span>
                    <span className="count-sep">•</span>
                    <span>🎬 {group.items.filter((i) => i.mediaType === 'video').length} video</span>
                  </div>

                  {!group.isGroupUnlocked && isSecretUser && (
                    <div className="chapter-scheduled-tag">
                      <span className="sched-icon">🔒</span>
                      <div className="sched-info">
                        <span className="sched-label">Deblocare automată:</span>
                        <span className="sched-date">{formatUnlockDate(group.unlockAt)}</span>
                      </div>
                      <span className="sched-secret-notice">✨ Previzualizare Secretă Maria ✨</span>
                    </div>
                  )}
                </div>
              </div>

              {/* ── GROUP MEDIA ITEMS ── */}
              {group.items.map((item) => (
                <div
                  key={item.id}
                  className={`portrait-card ${item.mediaType === 'video' ? 'is-video' : ''} ${
                    item.isLocked ? 'is-scheduled-locked' : ''
                  }`}
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

                    {/* Scheduled unlock tag for locked items (visible only to secret user) */}
                    {item.isLocked && isSecretUser && (
                      <div className="card-scheduled-overlay">
                        <div className="card-unlock-badge">
                          <span className="unlock-lock-icon">🔒</span>
                          <div className="unlock-badge-text">
                            <span className="unlock-badge-title">Deblocare:</span>
                            <span className="unlock-badge-date">{formatUnlockDate(item.unlockAt)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Decorative separator between groups */}
              <div className="group-separator-line" />
            </React.Fragment>
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
          <div className="side-drawer" onClick={(e) => e.stopPropagation()}>
            <button className="drawer-close" onClick={() => setIsDrawerOpen(false)}>
              ✕
            </button>

            <div className="drawer-header">
              <span className="letter-icon">💌</span>
              <h2>Scrisoare de Dragoste</h2>
            </div>

            <div className="letter-body">
              {isEditingLetter ? (
                <div className="edit-letter-wrap">
                  <textarea
                    value={tempLetter}
                    onChange={(e) => setTempLetter(e.target.value)}
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
                  <button
                    className="btn-edit-letter"
                    onClick={() => {
                      setTempLetter(letterMessage)
                      setIsEditingLetter(true)
                    }}
                  >
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
          isSecretUser={isSecretUser}
          formatUnlockDate={formatUnlockDate}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  )
}
