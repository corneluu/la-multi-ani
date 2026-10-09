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

// Normalize text for flexible answer verification
function normalizeAnswer(str) {
  if (!str) return ''
  return str
    .toLowerCase()
    .trim()
    .replace(/[ăâ]/g, 'a')
    .replace(/[î]/g, 'i')
    .replace(/[ș]/g, 's')
    .replace(/[ț]/g, 't')
    .replace(/[^a-z0-9]/g, '') // strip all spaces, dots, slashes, dashes, commas
}

// Check Chapter 3: 3 iunie 2026
function checkChapter3Answer(input) {
  const norm = normalizeAnswer(input)
  const validList = [
    '3iunie2026', '03iunie2026',
    '3iun2026', '03iun2026',
    '3062026', '03062026',
    '362026', '0362026',
    '3june2026', '03june2026',
    '3jun2026', '03jun2026',
    '3iunie', '03iunie',
    '3iun', '03iun',
    '3june', '03june',
  ]
  if (validList.includes(norm)) return true
  return /^0?3(iunie|iun|0?6|june|jun)(2026)?$/.test(norm)
}

// Check Chapter 5: 19 iunie 2005
function checkChapter5Answer(input) {
  const norm = normalizeAnswer(input)
  const validList = [
    '19iunie2005',
    '19iun2005',
    '19062005',
    '1962005',
    '19june2005',
    '19jun2005',
    '19iunie',
    '19iun',
    '19june',
  ]
  if (validList.includes(norm)) return true
  return /^19(iunie|iun|0?6|june|jun)(2005)?$/.test(norm)
}

export default function GalleryPage({ isSecretUser: propIsSecretUser }) {
  const navigate = useNavigate()
  const scrollRef = useRef(null)

  // Secret bypass mode (via prop or sessionStorage)
  const isSecretUser =
    propIsSecretUser ??
    (typeof window !== 'undefined' && sessionStorage.getItem('lily_secret_mode') === 'true')

  // Track which chapters are unlocked in this session
  const [unlockedChapters, setUnlockedChapters] = useState(() => {
    try {
      const saved = sessionStorage.getItem('lily_unlocked_chapters')
      return saved ? JSON.parse(saved) : ['group-1', 'group-2', 'group-7']
    } catch {
      return ['group-1', 'group-2', 'group-7']
    }
  })

  // State for interactive lock forms
  const [inputAnswers, setInputAnswers] = useState({})
  const [inputErrors, setInputErrors] = useState({})
  const [sliderValues, setSliderValues] = useState({ 'group-4': 0 })
  const [isSubmittingWebhook, setIsSubmittingWebhook] = useState(false)

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

  // Function to unlock a specific chapter
  const unlockChapter = (groupId) => {
    setUnlockedChapters((prev) => {
      if (prev.includes(groupId)) return prev
      const updated = [...prev, groupId]
      try {
        sessionStorage.setItem('lily_unlocked_chapters', JSON.stringify(updated))
      } catch {}
      return updated
    })
  }

  // Handle password/date submit for questions
  const handleQuestionSubmit = (group) => {
    const rawVal = inputAnswers[group.id] || ''
    if (!rawVal.trim()) {
      setInputErrors((prev) => ({ ...prev, [group.id]: 'Te rog introdu un răspuns! ❤️' }))
      return
    }

    let isCorrect = false
    if (group.id === 'group-3') {
      isCorrect = checkChapter3Answer(rawVal)
    } else if (group.id === 'group-5') {
      isCorrect = checkChapter5Answer(rawVal)
    }

    if (isCorrect) {
      setInputErrors((prev) => ({ ...prev, [group.id]: '' }))
      unlockChapter(group.id)
      sendTelemetryEvent(
        `🎉 ${group.title} a fost deblocat!`,
        `Utilizatorul a răspuns corect: "${rawVal}"`,
        0x10b981,
        [{ name: '📖 Capitol', value: group.title, inline: true }]
      )
    } else {
      setInputErrors((prev) => ({
        ...prev,
        [group.id]: 'Răspuns incorect! Gândește-te bine și încearcă din nou ❤️',
      }))
    }
  }

  // Handle Love Slider change
  const handleSliderChange = (group, value) => {
    const num = Number(value)
    setSliderValues((prev) => ({ ...prev, [group.id]: num }))
    if (num >= 100) {
      unlockChapter(group.id)
      sendTelemetryEvent(
        `💖 ${group.title} a fost deblocat prin Drag Slider (100%)!`,
        'Utilizatorul a dus bara de iubire la 100%! ❤️',
        0xec4899,
        [{ name: '📖 Capitol', value: group.title, inline: true }]
      )
    }
  }

  // Handle Open Question submit + Discord Webhook (Chapter 6)
  const handleOpenQuestionSubmit = async (group) => {
    const rawVal = inputAnswers[group.id] || ''
    if (!rawVal.trim()) {
      setInputErrors((prev) => ({ ...prev, [group.id]: 'Te rog scrie un răspuns! 💍' }))
      return
    }

    setIsSubmittingWebhook(true)

    // Format current date/time in Romania timezone
    const now = new Date()
    const roTime = now.toLocaleString('ro-RO', {
      timeZone: 'Europe/Bucharest',
      dateStyle: 'full',
      timeStyle: 'medium',
    })

    // Send answer to dedicated Discord webhook
    try {
      if (group.webhookUrl) {
        await fetch(group.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            embeds: [
              {
                title: '💍 RĂSPUNS NOU: Când crezi că te va cere Cornel de nevastă?',
                description: `**Răspunsul Mariei:**\n>>> "${rawVal}"`,
                color: 0xec4899,
                fields: [
                  { name: '⏰ Data & Ora', value: roTime, inline: true },
                  { name: '📍 Locație', value: 'Capitolul 6 (Deblocat cu succes)', inline: true },
                ],
                footer: { text: 'La Mulți Ani, Iubita! 🌸' },
                timestamp: new Date().toISOString(),
              },
            ],
          }),
        })
      }
    } catch (err) {
      console.warn('Webhook notification failed', err)
    }

    setIsSubmittingWebhook(false)
    unlockChapter(group.id)

    sendTelemetryEvent(
      `💍 ${group.title} a fost deblocat!`,
      `Răspunsul la întrebarea despre căsătorie: "${rawVal}"`,
      0xec4899,
      [
        { name: '💌 Răspuns', value: rawVal, inline: true },
        { name: '⏰ Ora', value: roTime, inline: true },
      ]
    )
  }

  // Log arrival in Gallery
  useEffect(() => {
    sendTelemetryEvent(
      isSecretUser ? '🌸 Galerie Deschisă (MOD SECRET MARIA)' : '🖼️ Galerie Deschisă',
      'Utilizatorul explorează galeria interactivă pe capitole.',
      isSecretUser ? 0xec4899 : 0x38bdf8,
      [
        { name: '📍 Pagină', value: 'GalleryPage', inline: true },
        { name: '🔑 Mod Acces', value: isSecretUser ? 'Secret Bypass (Maria)' : 'Standard', inline: true },
      ]
    )
  }, [isSecretUser])

  const handleOpenMedia = (item) => {
    sendTelemetryEvent(
      `👁️ Vizualizare ${item.mediaType === 'video' ? 'Videoclip' : 'Fotografie'}`,
      `Utilizatorul a deschis: "${item.name || item.id}"`,
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
      'Utilizatorul a ajuns la capătul galeriei și a deschis scrisoarea de dragoste.',
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
      {/* ── STATIC TOP HEADER (SEAMLESS) ── */}
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
              🌸 Mod Secret Activ (Maria) — Toate capitolele sunt deblocate
            </div>
          )}
        </div>

        <div className="topbar-right-spacer" />
      </header>

      {/* ── HORIZONTAL SCROLLING CONTAINER ── */}
      <main className="horizontal-scroll-container" ref={scrollRef} onWheel={handleWheelScroll}>
        <div className="horizontal-grid">
          {MEDIA_GROUPS.map((group) => {
            const isUnlocked = isSecretUser || unlockedChapters.includes(group.id)

            return (
              <React.Fragment key={group.id}>
                {/* ── CHAPTER INTRO CARD ── */}
                <div className={`chapter-card ${!isUnlocked ? 'is-chapter-locked' : ''}`}>
                  <div className="chapter-card-inner">
                    <div className="chapter-badge">{group.title}</div>

                    {/* VA URMA CARD */}
                    {group.isVaUrma ? (
                      <div className="va-urma-content">
                        <span className="va-urma-icon">✨ 💌 ✨</span>
                        <h3 className="va-urma-title">Va urma!:</h3>
                        <p className="va-urma-desc">Noi amintiri frumoase se vor adăuga în curând... 🌸</p>
                      </div>
                    ) : isUnlocked ? (
                      /* UNLOCKED CHAPTER SUMMARY */
                      <div className="unlocked-summary">
                        <span className="unlocked-icon">💖</span>
                        <div className="chapter-items-count">
                          <span>📸 {group.items.filter((i) => i.mediaType === 'image').length} poze</span>
                          <span className="count-sep">•</span>
                          <span>🎬 {group.items.filter((i) => i.mediaType === 'video').length} video</span>
                        </div>
                        <span className="unlocked-tag-badge">✨ Deblocat cu Dragoste ✨</span>
                      </div>
                    ) : (
                      /* LOCKED CHAPTER INTERACTIVE CHALLENGES */
                      <div className="locked-challenge-wrapper">
                        {/* TYPE 1: QUESTION (Chapter 3 & Chapter 5) */}
                        {group.unlockType === 'question' && (
                          <div className="interactive-question-box">
                            <span className="lock-pulse-icon">🔒</span>
                            <p className="challenge-question-text">{group.question}</p>
                            <div className="challenge-input-row">
                              <input
                                type="text"
                                placeholder={group.placeholder || 'Răspunsul tău...'}
                                value={inputAnswers[group.id] || ''}
                                onChange={(e) => {
                                  setInputAnswers({ ...inputAnswers, [group.id]: e.target.value })
                                  setInputErrors({ ...inputErrors, [group.id]: '' })
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleQuestionSubmit(group)
                                }}
                                className="challenge-input"
                              />
                              <button
                                type="button"
                                className="challenge-submit-btn"
                                onClick={() => handleQuestionSubmit(group)}
                              >
                                Deblochează 💖
                              </button>
                            </div>
                            {inputErrors[group.id] && (
                              <p className="challenge-error-text">{inputErrors[group.id]}</p>
                            )}
                          </div>
                        )}

                        {/* TYPE 2: LOVE VOLUME SLIDER (Chapter 4) */}
                        {group.unlockType === 'slider' && (
                          <div className="interactive-slider-box">
                            <span className="lock-pulse-icon">💖</span>
                            <p className="challenge-question-text">{group.question}</p>

                            <div className="love-slider-container">
                              <div className="slider-percentage-badge">
                                {sliderValues[group.id] || 0}% ❤️
                              </div>
                              <div className="love-slider-track-wrap">
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={sliderValues[group.id] || 0}
                                  onChange={(e) => handleSliderChange(group, e.target.value)}
                                  className="love-volume-slider"
                                  style={{
                                    background: `linear-gradient(90deg, #ff1493 0%, #ff4b72 ${sliderValues[group.id] || 0}%, rgba(255,255,255,0.3) ${sliderValues[group.id] || 0}%)`,
                                  }}
                                />
                              </div>
                              <p className="slider-instruction">
                                Trage inimioara la 100% spre dreapta pentru a debloca! ✨
                              </p>
                            </div>
                          </div>
                        )}

                        {/* TYPE 3: OPEN QUESTION + DISCORD WEBHOOK (Chapter 6) */}
                        {group.unlockType === 'open_question' && (
                          <div className="interactive-open-question-box">
                            <span className="lock-pulse-icon">💍</span>
                            <p className="challenge-question-text">{group.question}</p>
                            <div className="challenge-input-row">
                              <input
                                type="text"
                                placeholder={group.placeholder || 'Scrie răspunsul tău aici...'}
                                value={inputAnswers[group.id] || ''}
                                onChange={(e) => {
                                  setInputAnswers({ ...inputAnswers, [group.id]: e.target.value })
                                  setInputErrors({ ...inputErrors, [group.id]: '' })
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleOpenQuestionSubmit(group)
                                }}
                                className="challenge-input"
                              />
                              <button
                                type="button"
                                className="challenge-submit-btn"
                                disabled={isSubmittingWebhook}
                                onClick={() => handleOpenQuestionSubmit(group)}
                              >
                                {isSubmittingWebhook ? 'Se trimite...' : 'Trimite Răspunsul 💍'}
                              </button>
                            </div>
                            {inputErrors[group.id] && (
                              <p className="challenge-error-text">{inputErrors[group.id]}</p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* ── CHAPTER MEDIA ITEMS (Shown only if chapter is unlocked) ── */}
                {isUnlocked &&
                  group.items.map((item) => (
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

                {/* Decorative separator between chapters */}
                <div className="group-separator-line" />
              </React.Fragment>
            )
          })}

          {/* ── GIFT CARD (AT THE END OF THE SCROLL) ── */}
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
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  )
}
