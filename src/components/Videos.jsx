import { useState } from 'react'
import './Videos.css'

const VIDEOS = [
  {
    id: 'FvWEMwVVRVY',
    title: '🌸 Lily Bloom Timelapse',
    desc: 'Watch a lily open petal by petal in beautiful slow motion.',
  },
  {
    id: '2Vv-BfVoq4g',
    title: '🌺 Relaxing Lily Garden',
    desc: 'A peaceful walk through a stunning lily garden in full bloom.',
  },
  {
    id: 'oBMEQmApFQA',
    title: '🎺 Types of Lilies Guide',
    desc: 'A beautiful visual guide to the most stunning lily varieties.',
  },
]

function VideoCard({ video }) {
  const [playing, setPlaying] = useState(false)
  const thumb = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`

  return (
    <div className="vid-card">
      <div className="vid-thumb" onClick={() => setPlaying(true)}>
        {playing ? (
          <iframe
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`}
            title={video.title}
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        ) : (
          <>
            <img src={thumb} alt={video.title} />
            <button className="play-btn" aria-label="Play">▶</button>
          </>
        )}
      </div>
      <div className="vid-info">
        <h4>{video.title}</h4>
        <p>{video.desc}</p>
      </div>
    </div>
  )
}

export default function Videos() {
  return (
    <section id="videos" className="videos-section">
      <div className="container">
        <p className="section-eyebrow">Motion & beauty</p>
        <h2 className="section-title">Lily Videos</h2>
        <div className="videos-grid">
          {VIDEOS.map(v => <VideoCard key={v.id} video={v} />)}
        </div>
      </div>
    </section>
  )
}
