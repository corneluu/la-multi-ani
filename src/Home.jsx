import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MEDIA_CONFIG } from './config'
import { preloadMediaAssets } from './mediaPreloader'
import { sendTelemetryEvent } from './telemetry'
import LoadingScreen from './LoadingScreen'
import './Home.css'

const RED_HEARTS = ['❤️', '❤️', '❤️', '❤️', '❤️', '❤️', '❤️']

const PETALS = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  emoji: ['🌸', '🌺', '💕', '✨', '🌷'][i % 5],
  left: Math.random() * 100,
  delay: Math.random() * 8,
  duration: 6 + Math.random() * 8,
  size: 0.9 + Math.random() * 1.3,
}))

export default function Home() {
  const navigate = useNavigate()

  // Loading state when user clicks the bouquet
  const [isLoading, setIsLoading] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [currentMediaName, setCurrentMediaName] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  // Log page visit
  useEffect(() => {
    sendTelemetryEvent(
      '🏡 Utilizatorul a ajuns pe pagina principală (Home)',
      'Utilizatorul se află în ecranul cu buchetul de crini și mesajul "La mulți ani, iubita!".',
      0x38bdf8,
      [{ name: '📍 Pagină', value: 'Home (Buchet)', inline: true }]
    )
  }, [])

  const handleBouquetClick = async () => {
    if (isLoading) return

    sendTelemetryEvent(
      '💐 Buchetul de crini a fost apăsat',
      'Utilizatorul a dat click pe buchet. A început ecranul de loading (4 secunde) și preîncărcarea galeriei.',
      0xec4899,
      [{ name: '🚀 Acțiune', value: 'Deschidere galerie', inline: true }]
    )

    setIsLoading(true)
    setLoadingProgress(0)
    setCurrentMediaName('Se pregătesc fotografiile și videoclipurile... 🌸')

    const DURATION = 4000 // Exact 4 secunde
    const startTime = Date.now()

    // Pornim preîncărcarea în fundal
    const preloadPromise = preloadMediaAssets(MEDIA_CONFIG, (_, itemName) => {
      if (itemName) {
        setCurrentMediaName(`Se optimizează: ${itemName}`)
      }
    }).catch(() => {})

    // Timer animat care rulează progresul pe durata exactă de 4 secunde
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progressRatio = Math.min(1, elapsed / DURATION)
      const currentPct = Math.round(progressRatio * 100)

      setLoadingProgress(currentPct)

      if (progressRatio >= 1) {
        clearInterval(progressInterval)
      }
    }, 50)

    try {
      // Așteptăm atât durata fixă de 4 secunde, cât și finalizarea încărcării media
      await Promise.all([
        preloadPromise,
        new Promise((resolve) => setTimeout(resolve, DURATION)),
      ])

      clearInterval(progressInterval)
      setLoadingProgress(100)
      setCurrentMediaName('Totul este pregătit cu dragoste! ✨')

      setTimeout(() => {
        setIsComplete(true)
        setTimeout(() => {
          navigate('/gallery')
        }, 400)
      }, 300)
    } catch {
      clearInterval(progressInterval)
      navigate('/gallery')
    }
  }

  return (
    <div className="home-page">
      {/* ── PRELOADER & LOADING SCREEN ── */}
      {isLoading && (
        <LoadingScreen
          progress={loadingProgress}
          currentItem={currentMediaName}
          isComplete={isComplete}
        />
      )}

      {/* ── MAGICAL BACKGROUND ── */}
      <div className="bg-image" />
      <div className="bg-overlay" />

      {/* ── FALLING PETALS ── */}
      <div className="particles" aria-hidden="true">
        {PETALS.map(p => (
          <span
            key={p.id}
            className="particle"
            style={{
              left: `${p.left}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              fontSize: `${p.size}rem`,
            }}
          >
            {p.emoji}
          </span>
        ))}
      </div>

      {/* ── HERO TEXT STAGE ── */}
      <main className="hero-stage">
        <h1 className="main-title">La mulți ani, iubita!</h1>
        <p className="sub-title">
          Îți dedic această grădină de crini, pentru că ești<br />
          la fel de frumoasă și specială ca ei 🌸
        </p>

        <div className="hearts-row" aria-hidden="true">
          {RED_HEARTS.map((h, i) => (
            <span key={i} className="small-red-heart" style={{ animationDelay: `${i * 0.22}s` }}>
              {h}
            </span>
          ))}
        </div>
      </main>

      {/* ── CLICKABLE BOUQUET BUTTON (TRIGGERS PRELOADER & SMOOTH TRANSITION) ── */}
      <div
        className="bouquet-button-container"
        onClick={handleBouquetClick}
        title="Apasă pentru a deschide amintirile 🌸"
      >
        <div className="bouquet-pulse-ring" />
        <img src={`${import.meta.env.BASE_URL}cartoon_lilies.png`} alt="Blue Lily Bouquet" className="bouquet-button-img" />
      </div>
    </div>
  )
}
