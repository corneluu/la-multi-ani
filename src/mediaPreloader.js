// Preloader utility to ensure all images and videos are warmed up and buffered
// so scrolling and viewing in the gallery are lag-free.

export function preloadMediaAssets(items, onProgress) {
  let loadedCount = 0
  const total = items.length

  const updateProgress = (itemName) => {
    loadedCount += 1
    const pct = Math.min(100, (loadedCount / total) * 100)
    if (onProgress) {
      onProgress(pct, itemName)
    }
  }

  const promises = items.map((item) => {
    return new Promise((resolve) => {
      if (item.mediaType === 'image') {
        const img = new Image()
        img.onload = () => {
          updateProgress(item.name || 'Fotografie')
          resolve()
        }
        img.onerror = () => {
          updateProgress(item.name || 'Fotografie')
          resolve()
        }
        img.src = item.src
      } else if (item.mediaType === 'video') {
        // Preload video metadata and initial buffer
        const vid = document.createElement('video')
        vid.preload = 'auto'
        vid.muted = true
        vid.playsInline = true

        let resolved = false
        const done = () => {
          if (!resolved) {
            resolved = true
            vid.removeAttribute('src')
            vid.load()
            updateProgress(item.name || 'Videoclip')
            resolve()
          }
        }

        // Resolve when enough data or metadata is loaded
        vid.onloadeddata = done
        vid.oncanplay = done
        vid.onloadedmetadata = done
        vid.onerror = done

        // Timeout fallback so a slow network or heavy video never blocks forever
        setTimeout(done, 3500)

        vid.src = item.src
        vid.load()
      } else {
        updateProgress('Amintire')
        resolve()
      }
    })
  })

  return Promise.all(promises)
}
