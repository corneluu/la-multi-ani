import { useState } from 'react'
import './AddMediaModal.css'

function parseYoutubeUrl(url) {
  if (!url) return null
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return (match && match[2].length === 11) ? match[2] : null
}

export default function AddMediaModal({ isOpen, onClose, onAddMedia }) {
  const [mediaType, setMediaType] = useState('image')
  const [sourceType, setSourceType] = useState('file') // 'file' or 'url'
  const [name, setName] = useState('')
  const [variety, setVariety] = useState('Oriental')
  const [url, setUrl] = useState('')
  const [fileData, setFileData] = useState(null)
  const [preview, setPreview] = useState('')
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      setFileData(event.target.result)
      setPreview(event.target.result)
      setError('')
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    const trimmedName = name.trim() || (mediaType === 'video' ? 'Video Nou 🎬' : 'Crini Frumoși 🌸')
    let finalSrc = ''
    let finalThumb = ''

    if (sourceType === 'file') {
      if (!fileData) {
        setError('Te rog alege un fișier din calculator.')
        return
      }
      finalSrc = fileData
      finalThumb = mediaType === 'image' ? fileData : ''
    } else {
      if (!url.trim()) {
        setError('Te rog introdu un link valid.')
        return
      }
      if (mediaType === 'video') {
        const ytId = parseYoutubeUrl(url.trim())
        if (ytId) {
          finalSrc = `https://www.youtube.com/embed/${ytId}?autoplay=1`
          finalThumb = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
        } else {
          finalSrc = url.trim()
          finalThumb = ''
        }
      } else {
        finalSrc = url.trim()
        finalThumb = url.trim()
      }
    }

    const newItem = {
      id: Date.now().toString(),
      mediaType,
      src: finalSrc,
      thumb: finalThumb || finalSrc,
      name: trimmedName,
      type: variety,
      likes: '1.0k',
    }

    onAddMedia(newItem)
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Închide">✕</button>

        <div className="modal-header">
          <h2>Adaugă Foto sau Video 🌸</h2>
          <p>Personalizează galeria cu pozele și clipurile voastre!</p>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Media Type Selector */}
          <div className="type-toggle-group">
            <button
              type="button"
              className={`toggle-btn ${mediaType === 'image' ? 'active' : ''}`}
              onClick={() => { setMediaType('image'); setPreview(''); setFileData(null); }}
            >
              📸 Fotografie
            </button>
            <button
              type="button"
              className={`toggle-btn ${mediaType === 'video' ? 'active' : ''}`}
              onClick={() => { setMediaType('video'); setPreview(''); setFileData(null); }}
            >
              🎬 Video
            </button>
          </div>

          {/* Source Type Selector */}
          <div className="source-toggle-group">
            <button
              type="button"
              className={`pill-sub ${sourceType === 'file' ? 'selected' : ''}`}
              onClick={() => setSourceType('file')}
            >
              📁 Din calculator / telefon
            </button>
            <button
              type="button"
              className={`pill-sub ${sourceType === 'url' ? 'selected' : ''}`}
              onClick={() => setSourceType('url')}
            >
              🔗 Link (URL / YouTube)
            </button>
          </div>

          {/* File Upload or URL Input */}
          {sourceType === 'file' ? (
            <div className="upload-zone">
              <input
                type="file"
                id="mediaFileInput"
                accept={mediaType === 'image' ? 'image/*' : 'video/*'}
                onChange={handleFileChange}
                className="hidden-file-input"
              />
              <label htmlFor="mediaFileInput" className="upload-label">
                {preview ? (
                  mediaType === 'image' ? (
                    <img src={preview} alt="Preview" className="preview-thumb" />
                  ) : (
                    <video src={preview} className="preview-thumb" />
                  )
                ) : (
                  <div className="upload-prompt">
                    <span className="upload-icon">{mediaType === 'image' ? '🖼️' : '🎥'}</span>
                    <span>Apasă pentru a alege un fișier {mediaType === 'image' ? 'imagine' : 'video'}</span>
                  </div>
                )}
              </label>
            </div>
          ) : (
            <div className="form-group">
              <label>Link {mediaType === 'image' ? 'Poză' : 'Video (inclusiv YouTube)'}</label>
              <input
                type="url"
                placeholder={mediaType === 'image' ? 'https://... sau link imagine' : 'https://www.youtube.com/watch?v=...'}
                value={url}
                onChange={e => setUrl(e.target.value)}
                className="text-input"
              />
            </div>
          )}

          {/* Title input */}
          <div className="form-group">
            <label>Titlu / Nume</label>
            <input
              type="text"
              placeholder="ex: Crin Imperial, Ziua Noastră..."
              value={name}
              onChange={e => setName(e.target.value)}
              className="text-input"
            />
          </div>

          {/* Variety / Tag select */}
          <div className="form-group">
            <label>Tip / Categorie</label>
            <input
              type="text"
              placeholder="ex: Oriental, Asiatic, Calla, Amintire..."
              value={variety}
              onChange={e => setVariety(e.target.value)}
              className="text-input"
            />
          </div>

          {error && <div className="form-error">{error}</div>}

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Anulează</button>
            <button type="submit" className="btn-submit">Adaugă în Galerie ✨</button>
          </div>
        </form>
      </div>
    </div>
  )
}
