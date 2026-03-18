import { useState, useEffect } from 'react'
import { getStoredReels, reelToPortfolioItem } from '../utils/reelStorage'

const filters = ['All', 'Weddings', 'Birthdays', 'Mehendi']

// Helper function to get Google Drive image URL
const getGoogleDriveImageUrl = (url) => {
  if (!url) return ''
  
  // Handle different Google Drive URL formats for images
  const driveRegex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/
  const match = url.match(driveRegex)
  
  if (match) {
    const fileId = match[1]
    // Use Google's image serving URL which works better for thumbnails
    return `https://lh3.googleusercontent.com/d/${fileId}=w1000`
  }
  
  return url // Return original URL if not Google Drive
}

// Helper function to get Google Drive video URL
const getGoogleDriveVideoUrl = (url) => {
  if (!url) return ''
  
  // Convert Google Drive share URL to direct video URL for embedding
  const driveRegex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/
  const match = url.match(driveRegex)
  
  if (match) {
    return `https://drive.google.com/file/d/${match[1]}/preview`
  }
  
  return url // Return original URL if not Google Drive
}

// Helper function to convert YouTube URL to embed URL
const getYouTubeEmbedUrl = (url) => {
  if (!url) return ''
  
  // Handle different YouTube URL formats
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  const match = url.match(youtubeRegex)
  
  if (match) {
    return `https://www.youtube.com/embed/${match[1]}`
  }
  
  return url // Return original URL if not YouTube
}

export default function Portfolio() {
  const [active, setActive] = useState('All')
  const [items, setItems] = useState([])
  const [selectedVideo, setSelectedVideo] = useState(null)

  useEffect(() => {
    // Load only uploaded reels from Firebase
    const loadReels = async () => {
      try {
        const storedReels = await getStoredReels()
        const reelItems = storedReels.map(reelToPortfolioItem)
        setItems(reelItems)
      } catch (error) {
        console.error('Error loading reels for portfolio:', error)
        setItems([])
      }
    }
    
    loadReels()
  }, [])

  const filteredItems = items.filter(item => {
    if (active === 'All') return true
    if (active === 'Weddings') return item.cat.toLowerCase().includes('wedding')
    if (active === 'Birthdays') return item.cat.toLowerCase().includes('birthday')
    if (active === 'Mehendi') return item.cat.toLowerCase().includes('mehendi')
    return false
  })

  return (
    <section className="portfolio-section" id="portfolio">
      <div className="portfolio-header reveal">
        <div>
          <div className="section-label">Our Work</div>
          <h2 className="portfolio-title">
            Frames That<br /><em>Tell Stories</em>
          </h2>
        </div>
        <ul className="portfolio-filter">
          {filters.map(f => (
            <li key={f}>
              <button
                className={`filter-btn${active === f ? ' active' : ''}`}
                onClick={() => setActive(f)}
              >
                {f}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="portfolio-grid reveal">
        {items.length === 0 ? (
          <div className="empty-portfolio">
            <p>No work uploaded yet. Upload your first reel from the admin dashboard!</p>
          </div>
        ) : (
          filteredItems.map((item, i) => (
            <div key={item.id || i} className="port-item">
              {item.thumbnailUrl ? (
                <img 
                  src={getGoogleDriveImageUrl(item.thumbnailUrl)} 
                  alt={item.title}
                  className="port-thumbnail"
                  onError={(e) => {
                    console.error('Portfolio thumbnail failed:', e.target.src);
                    
                    // Try alternative Google Drive formats
                    if (item.thumbnailUrl.includes('drive.google.com')) {
                      const driveRegex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/
                      const match = item.thumbnailUrl.match(driveRegex)
                      
                      if (match) {
                        const fileId = match[1]
                        const alternatives = [
                          `https://drive.google.com/uc?export=view&id=${fileId}`,
                          `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`,
                          item.thumbnailUrl // Original URL as last resort
                        ]
                        
                        const currentSrc = e.target.src
                        const nextAlt = alternatives.find(alt => alt !== currentSrc)
                        
                        if (nextAlt) {
                          console.log('Trying alternative thumbnail URL:', nextAlt)
                          e.target.src = nextAlt
                          return
                        }
                      }
                    }
                    
                    // Fallback to video preview or placeholder if thumbnail fails
                    if (item.videoUrl && !item.videoUrl.includes('youtube.com') && !item.videoUrl.includes('drive.google.com')) {
                      e.target.style.display = 'none'
                      const video = document.createElement('video')
                      video.src = item.videoUrl
                      video.className = 'port-video-preview'
                      video.muted = true
                      video.loop = true
                      video.playsInline = true
                      video.preload = 'metadata'
                      e.target.parentNode.insertBefore(video, e.target)
                    } else {
                      e.target.style.display = 'none'
                      const placeholder = document.createElement('div')
                      placeholder.className = 'port-bg'
                      placeholder.textContent = item.symbol || '📹'
                      e.target.parentNode.insertBefore(placeholder, e.target)
                    }
                  }}
                />
              ) : item.videoUrl ? (
                <video 
                  src={item.videoUrl}
                  className="port-video-preview"
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  onLoadedData={(e) => {
                    // Only auto-play if video is in viewport and user hasn't interacted
                    const observer = new IntersectionObserver((entries) => {
                      entries.forEach(entry => {
                        if (entry.isIntersecting) {
                          e.target.play().catch(() => {
                            // Fallback: show poster frame if autoplay fails
                            e.target.poster = e.target.src
                          })
                        } else {
                          e.target.pause()
                        }
                      })
                    })
                    observer.observe(e.target)
                  }}
                />
              ) : (
                <div className="port-bg">{item.symbol}</div>
              )}
              <div className="port-overlay" />
              <div 
                className="port-play" 
                onClick={() => item.videoUrl && setSelectedVideo(item)}
                style={{ display: item.videoUrl ? 'flex' : 'none' }}
              />
              <div className="port-inner">
                <span className="port-cat">{item.cat}</span>
                <h3 className="port-title">{item.title}</h3>
                {item.isReel && <span className="reel-badge">New</span>}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="video-modal" onClick={() => setSelectedVideo(null)}>
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="video-close" onClick={() => setSelectedVideo(null)}>×</button>
            <div className="video-container">
              {selectedVideo.videoUrl.includes('youtube.com') || selectedVideo.videoUrl.includes('youtu.be') ? (
                <iframe
                  src={getYouTubeEmbedUrl(selectedVideo.videoUrl)}
                  className="modal-video"
                  frameBorder="0"
                  allowFullScreen
                  title={selectedVideo.title}
                />
              ) : selectedVideo.videoUrl.includes('drive.google.com') ? (
                <iframe
                  src={getGoogleDriveVideoUrl(selectedVideo.videoUrl)}
                  className="modal-video"
                  frameBorder="0"
                  allowFullScreen
                  title={selectedVideo.title}
                />
              ) : (
                <video 
                  controls 
                  autoPlay
                  className="modal-video"
                >
                  <source src={selectedVideo.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
            <div className="video-info">
              <h3>{selectedVideo.title}</h3>
              <p>Client: {selectedVideo.clientName}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
