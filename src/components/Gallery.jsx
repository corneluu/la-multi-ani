import { useState, useMemo } from 'react'
import './Gallery.css'
import Lightbox from './Lightbox'

export const PHOTOS = [
  {
    id: 1, type: 'oriental', span: '',
    src: 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=600&q=85',
    name: 'Stargazer Oriental', likes: '1.2k',
    desc: 'The iconic Stargazer — deeply fragrant with rich pink-crimson petals.',
  },
  {
    id: 2, type: 'oriental', span: 'tall',
    src: 'https://images.unsplash.com/photo-1490750967868-88df5691cc45?w=600&q=85',
    name: 'Casa Blanca', likes: '980',
    desc: 'Pure white petals with a heavenly perfume. The queen of oriental lilies.',
  },
  {
    id: 3, type: 'asiatic', span: '',
    src: 'https://images.unsplash.com/photo-1455582916367-25f75bfc6710?w=600&q=85',
    name: 'Red Asiatic', likes: '2.1k',
    desc: 'Bold, blazing red — the most vivid of all asiatic varieties.',
  },
  {
    id: 4, type: 'tiger', span: 'wide',
    src: 'https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=900&q=85',
    name: 'Tiger Lily', likes: '3.4k',
    desc: 'Spotted orange petals that curl back dramatically. Wild and fierce.',
  },
  {
    id: 5, type: 'calla', span: '',
    src: 'https://images.unsplash.com/photo-1471086569966-db3eebc25a59?w=600&q=85',
    name: 'White Calla', likes: '1.8k',
    desc: 'Sleek, sculptural elegance. A symbol of purity and rebirth.',
  },
  {
    id: 6, type: 'trumpet', span: '',
    src: 'https://images.unsplash.com/photo-1606041011872-596597976b25?w=600&q=85',
    name: 'Golden Trumpet', likes: '756',
    desc: 'Long, graceful blooms in radiant gold — a true garden showstopper.',
  },
  {
    id: 7, type: 'asiatic', span: 'tall',
    src: 'https://images.unsplash.com/photo-1599940778173-e276d4acb2bb?w=600&q=85',
    name: 'Pink Asiatic', likes: '1.5k',
    desc: 'Soft rosy-pink blooms that brighten any space with gentle charm.',
  },
  {
    id: 8, type: 'oriental', span: '',
    src: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=600&q=85',
    name: 'Crimson Beauty', likes: '2.3k',
    desc: 'Deep crimson petals with white edges — drama and elegance combined.',
  },
  {
    id: 9, type: 'calla', span: '',
    src: 'https://images.unsplash.com/photo-1606916961813-b41c55e2b7e2?w=600&q=85',
    name: 'Purple Calla', likes: '890',
    desc: 'Rich violet calla — mysterious, bold, and unforgettable.',
  },
  {
    id: 10, type: 'tiger', span: 'wide',
    src: 'https://images.unsplash.com/photo-1498889444388-e67ea62c464b?w=900&q=85',
    name: 'Tiger Lily Macro', likes: '4.1k',
    desc: 'Up close, the tiger lily reveals a breathtaking world of detail.',
  },
  {
    id: 11, type: 'trumpet', span: '',
    src: 'https://images.unsplash.com/photo-1620122830784-c29a955f5c12?w=600&q=85',
    name: 'White Trumpet', likes: '612',
    desc: 'Tall, proud, and fragrant — the white trumpet commands attention.',
  },
  {
    id: 12, type: 'asiatic', span: '',
    src: 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=600&q=85',
    name: 'Orange Asiatic', likes: '1.1k',
    desc: 'Warm orange flames — a burst of energy in any garden.',
  },
]

export default function Gallery({ activeFilter }) {
  const [selected, setSelected] = useState(null)

  const visible = useMemo(() =>
    activeFilter === 'all' ? PHOTOS : PHOTOS.filter(p => p.type === activeFilter),
    [activeFilter]
  )

  return (
    <section id="gallery" className="gallery-section">
      <div className="container">
        <p className="section-eyebrow">Instagram-style feed</p>
        <h2 className="section-title">Photo Gallery</h2>

        <div className="insta-grid">
          {visible.map(photo => (
            <div
              key={photo.id}
              className={`insta-card ${photo.span}`}
              onClick={() => setSelected(photo)}
            >
              <img
                src={photo.src}
                alt={photo.name}
                loading="lazy"
              />
              <div className="card-overlay">
                <div className="card-meta">
                  <span className="card-likes">❤️ {photo.likes}</span>
                  <span className="card-name">{photo.name}</span>
                </div>
              </div>
              <span className="card-badge">{photo.type.charAt(0).toUpperCase() + photo.type.slice(1)}</span>
            </div>
          ))}
        </div>

        {visible.length === 0 && (
          <div className="no-results">No photos found for this variety yet 🌱</div>
        )}
      </div>

      {selected && (
        <Lightbox photo={selected} onClose={() => setSelected(null)} />
      )}
    </section>
  )
}
