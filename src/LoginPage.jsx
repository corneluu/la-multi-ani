import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { sendTelemetryEvent } from './telemetry'
import './LoginPage.css'

const TARGET_DATE_STR = import.meta.env.VITE_COUNTDOWN_TARGET || '2026-10-26T23:59:59'
const MAIN_PASSWORD = import.meta.env.VITE_MAIN_PASSWORD || 'love'
const BYPASS_PASSWORD = import.meta.env.VITE_BYPASS_PASSWORD || 'maria'

export default function LoginPage({ onLoginSuccess }) {
  const navigate = useNavigate()

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false })
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  // Secret bypass flower state
  const [showSecretModal, setShowSecretModal] = useState(false)
  const [secretPassword, setSecretPassword] = useState('')
  const [secretError, setSecretError] = useState('')

  // Send telemetry when someone accesses the site / landing page
  useEffect(() => {
    sendTelemetryEvent(
      '🌐 Vizitator nou pe pagina de pornire',
      'Un utilizator a deschis pagina de numărătoare inversă.',
      0x38bdf8,
      [{ name: '📍 Pagină', value: 'LoginPage (Countdown)', inline: true }]
    )
  }, [])

  // Countdown timer logic
  useEffect(() => {
    const calculateTimeLeft = () => {
      const target = new Date(TARGET_DATE_STR).getTime()
      const now = new Date().getTime()
      const difference = target - now

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true })
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
        const minutes = Math.floor((difference / 1000 / 60) % 60)
        const seconds = Math.floor((difference / 1000) % 60)
        setTimeLeft({ days, hours, minutes, seconds, isExpired: false })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [])

  // STRICT MAIN LOGIN HANDLER: BLOCKS ACCESS IF TIMER IS ACTIVE
  const handleMainLogin = (e) => {
    if (e) e.preventDefault()

    // 1. STRICT BYPASS-PROOF TIMER CHECK:
    if (!timeLeft.isExpired) {
      setErrorMsg('Momentul magic nu a sosit încă! Numărătoarea inversă este în desfășurare... 🔒❤️')
      sendTelemetryEvent(
        '⏳ Tentativă de acces blocată de timer',
        'Utilizatorul a încercat să deschidă cadoul în timp ce numărătoarea inversă este încă activă.',
        0xf59e0b,
        [
          { name: '🔒 Stare Timer', value: 'Numărătoare activă', inline: true },
          { name: '⚠️ Rezultat', value: 'Blocat automat', inline: true },
        ]
      )
      return
    }

    // 2. PASSWORD CHECK (Only executed after timer expires):
    if (password.trim() === MAIN_PASSWORD) {
      sendTelemetryEvent(
        '🎉 Autentificare Reușită (Timer Expirat)',
        'Utilizatorul a deblocat cadoul prin parola principală după expirarea numărătorii inverse.',
        0x10b981,
        [{ name: '✅ Status', value: 'Acces aprobat -> /home', inline: true }]
      )
      if (onLoginSuccess) onLoginSuccess()
      navigate('/home')
    } else {
      sendTelemetryEvent(
        '❌ Parolă Principală Incorectă',
        'O încercare de autentificare pe formularul principal a eșuat.',
        0xef4444,
        [{ name: '⚠️ Rezultat', value: 'Parolă greșită', inline: true }]
      )
      setErrorMsg('Parolă incorectă! Încearcă din nou ❤️')
    }
  }

  // Secret bypass flower handler ("maria")
  const handleSecretBypass = (e) => {
    if (e) e.preventDefault()
    if (secretPassword.trim() === BYPASS_PASSWORD) {
      sendTelemetryEvent(
        '🌸 Bypass Secret Reușit (Floare)',
        'Utilizatorul a accesat modalul secret și a deblocat site-ul prin codul bypass.',
        0xec4899,
        [{ name: '✨ Status', value: 'Acces aprobat via cod floare -> /home', inline: true }]
      )
      if (onLoginSuccess) onLoginSuccess()
      navigate('/home')
    } else {
      sendTelemetryEvent(
        '⚠️ Cod Bypass Incorect',
        'Cineva a încercat un cod în fereastra secretă a florii, dar a fost respins.',
        0xef4444,
        [{ name: '🔍 Locație', value: 'Modal floare secretă', inline: true }]
      )
      setSecretError('Cuvânt cheie secret incorect 🌸')
    }
  }

  const handleOpenSecretModal = () => {
    sendTelemetryEvent(
      '🌸 Floarea secretă a fost apăsată',
      'Utilizatorul a descoperit și a făcut click pe iconița florii secrete pentru bypass.',
      0xd946ef
    )
    setShowSecretModal(true)
  }

  return (
    <div className="login-page">
      {/* ── MAGICAL BACKGROUND & OVERLAY ── */}
      <div className="login-bg-image" />
      <div className="login-bg-overlay" />

      {/* ── SECRET HIDDEN BYPASS FLOWER ── */}
      <div
        className="secret-flower-trigger"
        onClick={handleOpenSecretModal}
        title="O floare secretă..."
      >
        🌸
      </div>

      {/* ── MAIN COUNTDOWN & LOGIN CARD ── */}
      <main className="login-card">
        <div className="login-header">
          <span className="sparkle-heart">✨ ❤️ ✨</span>
          <h1>O Surpriză Specială Pentru Tine</h1>
          <p className="countdown-subtitle">
            Numărătoarea inversă până la momentul tău magic:
          </p>
        </div>

        {/* ── BIG COUNTDOWN TIMER DISPLAY ── */}
        <div className="countdown-display">
          <div className="time-unit">
            <span className="number">{String(timeLeft.days).padStart(2, '0')}</span>
            <span className="label">Zile</span>
          </div>
          <span className="colon">:</span>
          <div className="time-unit">
            <span className="number">{String(timeLeft.hours).padStart(2, '0')}</span>
            <span className="label">Ore</span>
          </div>
          <span className="colon">:</span>
          <div className="time-unit">
            <span className="number">{String(timeLeft.minutes).padStart(2, '0')}</span>
            <span className="label">Min</span>
          </div>
          <span className="colon">:</span>
          <div className="time-unit">
            <span className="number">{String(timeLeft.seconds).padStart(2, '0')}</span>
            <span className="label">Sec</span>
          </div>
        </div>

        {/* ── PASSWORD INPUT FORM ── */}
        <form onSubmit={handleMainLogin} className="login-form">
          <div className="input-group">
            <input
              type="password"
              placeholder={timeLeft.isExpired ? 'Introdu parola magică...' : 'Blocat până la expirarea timer-ului 🔒'}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setErrorMsg(''); }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleMainLogin(e)
                }
              }}
              className="password-input"
            />
            <button
              type="submit"
              className={`login-btn ${!timeLeft.isExpired ? 'btn-locked' : ''}`}
            >
              {timeLeft.isExpired ? 'Deschide Cadoul 🔑' : 'Cadou Blocat 🔒'}
            </button>
          </div>

          {errorMsg && <p className="error-message">{errorMsg}</p>}
        </form>
      </main>

      {/* ── SECRET BYPASS MODAL (Triggered by Flower) ── */}
      {showSecretModal && (
        <div className="secret-modal-overlay" onClick={() => setShowSecretModal(false)}>
          <div className="secret-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="secret-modal-close" onClick={() => setShowSecretModal(false)}>✕</button>

            <div className="secret-modal-header">
              <span className="secret-icon">🌸</span>
              <h2>Acces Secret Floare</h2>
              <p>Introdu codul secret pentru a trece peste numărătoarea inversă:</p>
            </div>

            <form onSubmit={handleSecretBypass} className="secret-modal-form">
              <input
                type="password"
                placeholder="Cod secret floare..."
                value={secretPassword}
                onChange={(e) => { setSecretPassword(e.target.value); setSecretError(''); }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSecretBypass(e)
                  }
                }}
                className="secret-input"
                autoFocus
              />
              {secretError && <p className="secret-error-text">{secretError}</p>}
              <button type="submit" className="secret-submit-btn">
                Deblochează Imediat ✨
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
