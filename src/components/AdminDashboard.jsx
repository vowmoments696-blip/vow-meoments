import { useState, useEffect } from 'react'
import { getStoredReels, saveReel, deleteReel } from '../utils/reelStorage'
import { getStoredBookings, updateBookingStatus, deleteBooking } from '../utils/bookingStorage'

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

// Helper function to get Google Drive direct link
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

// Helper function to get Google Drive image thumbnail URL
const getGoogleDriveImageUrl = (url) => {
  if (!url) return ''
  
  // Handle different Google Drive URL formats for images
  const driveRegex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/
  const match = url.match(driveRegex)
  
  if (match) {
    const fileId = match[1]
    // Try multiple Google Drive image URL formats
    return `https://lh3.googleusercontent.com/d/${fileId}=w1000`
  }
  
  return url // Return original URL if not Google Drive
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('bookings')
  const [bookings, setBookings] = useState([])
  const [reels, setReels] = useState([])
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [newReel, setNewReel] = useState({ 
    title: '', 
    clientName: '', 
    eventType: 'Wedding', 
    videoUrl: '', 
    thumbnailUrl: '' 
  })
  const [previewVideo, setPreviewVideo] = useState('')
  const [previewThumbnail, setPreviewThumbnail] = useState('')

  useEffect(() => {
    // Check if admin is logged in
    if (!localStorage.getItem('vowMomentsAdmin')) {
      window.location.href = '/'
      return
    }

    // Load stored reels and bookings from Firebase
    const loadData = async () => {
      try {
        // Load reels
        const reelsData = await getStoredReels()
        setReels(reelsData)
        
        // Load bookings
        const bookingsData = await getStoredBookings()
        console.log('Loaded bookings from Firebase:', bookingsData)
        setBookings(bookingsData)
      } catch (error) {
        console.error('Error loading data:', error)
        // Fallback to empty arrays if Firebase fails
        setReels([])
        setBookings([])
      }
    }

    loadData()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('vowMomentsAdmin')
    window.location.href = '/'
  }

  const handleReelUpload = async (e) => {
    e.preventDefault()
    if (!newReel.videoUrl && !newReel.thumbnailUrl) {
      alert('Please provide at least a video URL or thumbnail URL')
      return
    }
    
    setIsUploading(true)
    
    try {
      const savedReel = await saveReel(newReel)
      if (savedReel) {
        // Refresh the reels list from Firebase
        const updatedReels = await getStoredReels()
        setReels(updatedReels)
        
        setNewReel({ 
          title: '', 
          clientName: '', 
          eventType: 'Wedding', 
          videoUrl: '', 
          thumbnailUrl: '' 
        })
        setPreviewVideo('')
        setPreviewThumbnail('')
        alert('Reel uploaded successfully! It will now appear in the Portfolio section.')
      } else {
        alert('Error uploading reel. Please try again.')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Error uploading reel. Please check the URLs and try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDeleteReel = async (reelId) => {
    if (confirm('Are you sure you want to delete this reel?')) {
      const success = await deleteReel(reelId)
      if (success) {
        // Refresh the reels list from Firebase
        const updatedReels = await getStoredReels()
        setReels(updatedReels)
        alert('Reel deleted successfully!')
      } else {
        alert('Error deleting reel. Please try again.')
      }
    }
  }

  const updateBookingStatusHandler = async (bookingId, newStatus) => {
    const success = await updateBookingStatus(bookingId, newStatus)
    if (success) {
      // Refresh bookings from Firebase
      const updatedBookings = await getStoredBookings()
      setBookings(updatedBookings)
    } else {
      alert('Error updating booking status. Please try again.')
    }
  }

  const handleDeleteBooking = async (bookingId) => {
    if (confirm('Are you sure you want to delete this booking?')) {
      const success = await deleteBooking(bookingId)
      if (success) {
        // Refresh bookings from Firebase
        const updatedBookings = await getStoredBookings()
        setBookings(updatedBookings)
        alert('Booking deleted successfully!')
      } else {
        alert('Error deleting booking. Please try again.')
      }
    }
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="admin-brand">
          <h1>Vow <em>Moments</em> Admin</h1>
          <p>Dashboard</p>
        </div>
        <button className="admin-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="admin-nav">
        <button 
          className={`admin-tab ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          Bookings ({bookings.length})
        </button>
        <button 
          className={`admin-tab ${activeTab === 'reels' ? 'active' : ''}`}
          onClick={() => setActiveTab('reels')}
        >
          Reels ({reels.length})
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'bookings' && (
          <div className="bookings-section">
            <div className="section-header">
              <h2>Client Bookings</h2>
              <button 
                className={`btn-refresh ${isRefreshing ? 'refreshing' : ''}`}
                onClick={async () => {
                  setIsRefreshing(true)
                  // Simulate refresh delay for better UX
                  await new Promise(resolve => setTimeout(resolve, 1200))
                  const refreshedBookings = await getStoredBookings()
                  console.log('Refreshed bookings:', refreshedBookings)
                  setBookings(refreshedBookings)
                  setIsRefreshing(false)
                }}
                disabled={isRefreshing}
              >
                <span className="refresh-icon">↻</span>
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
            
            {/* Full Page Refresh Overlay */}
            {isRefreshing && (
              <div className="refresh-overlay">
                <div className="refresh-spinner">
                  <div className="spinner-ring"></div>
                  <div className="spinner-ring"></div>
                  <div className="spinner-ring"></div>
                </div>
                <p className="refresh-text">Refreshing bookings...</p>
              </div>
            )}
            
            <div className={`bookings-content ${isRefreshing ? 'refreshing' : ''}`}>
              {bookings.length === 0 ? (
                <div className="empty-bookings">
                  <p>No bookings yet. Bookings will appear here when clients submit the contact form.</p>
                  <p><small>Current bookings count: {bookings.length}</small></p>
                </div>
              ) : (
                <div className="bookings-grid">
                  {bookings.map(booking => (
                    <div key={booking.id} className="booking-card">
                      <div className="booking-header">
                        <h3>{booking.clientName}</h3>
                        <span className={`status ${booking.status}`}>
                          {booking.status}
                        </span>
                      </div>
                      <div className="booking-info">
                        <p><strong>Event:</strong> {booking.eventType}</p>
                        <p><strong>Date:</strong> {booking.eventDate}</p>
                        <p><strong>Budget:</strong> {booking.budget || 'Not specified'}</p>
                      </div>
                      <div className="booking-actions">
                        <button 
                          className="btn-view"
                          onClick={() => setSelectedBooking(booking)}
                        >
                          View Details
                        </button>
                        {booking.status === 'pending' && (
                          <button 
                            className="btn-confirm"
                            onClick={() => updateBookingStatusHandler(booking.id, 'confirmed')}
                          >
                            Confirm
                          </button>
                        )}
                        <button 
                          className="btn-delete"
                          onClick={() => handleDeleteBooking(booking.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'reels' && (
          <div className="reels-section">
            <h2>Upload Client Reels</h2>
            <form className="reel-upload-form" onSubmit={handleReelUpload}>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Reel Title"
                  value={newReel.title}
                  onChange={(e) => setNewReel({...newReel, title: e.target.value})}
                  required
                />
                <input
                  type="text"
                  placeholder="Client Name"
                  value={newReel.clientName}
                  onChange={(e) => setNewReel({...newReel, clientName: e.target.value})}
                  required
                />
              </div>
              <div className="form-row">
                <select
                  value={newReel.eventType}
                  onChange={(e) => setNewReel({...newReel, eventType: e.target.value})}
                  required
                >
                  <option value="Wedding">Wedding</option>
                  <option value="Birthday">Birthday</option>
                  <option value="Mehendi">Mehendi</option>
                  <option value="Engagement">Engagement</option>
                  <option value="Other">Other</option>
                </select>
                <div></div>
              </div>
              <div className="form-row">
                <div className="url-input">
                  <label>Video URL (YouTube or Google Drive):</label>
                  <input
                    type="url"
                    placeholder="https://youtube.com/watch?v=... or https://drive.google.com/file/d/..."
                    value={newReel.videoUrl}
                    onChange={(e) => {
                      const url = e.target.value
                      setNewReel({...newReel, videoUrl: url})
                      setPreviewVideo(url)
                    }}
                  />
                </div>
                <div className="url-input">
                  <label>Thumbnail URL (Any image URL or Google Drive link):</label>
                  <input
                    type="url"
                    placeholder="https://example.com/image.jpg or https://drive.google.com/file/d/..."
                    value={newReel.thumbnailUrl}
                    onChange={(e) => {
                      const url = e.target.value
                      setNewReel({...newReel, thumbnailUrl: url})
                      setPreviewThumbnail(url)
                    }}
                  />
                </div>
              </div>
              
              {/* Preview Section */}
              {(previewVideo || previewThumbnail) && (
                <div className="preview-section">
                  <h4>Preview</h4>
                  <div className="preview-grid">
                    {previewVideo && (
                      <div className="preview-item">
                        <label>Video Preview:</label>
                        <div className="video-preview">
                          {previewVideo.includes('youtube.com') || previewVideo.includes('youtu.be') ? (
                            <iframe
                              src={getYouTubeEmbedUrl(previewVideo)}
                              width="400"
                              height="300"
                              frameBorder="0"
                              allowFullScreen
                              title="Video Preview"
                              onLoad={() => console.log('YouTube video loaded:', previewVideo)}
                              onError={() => console.error('YouTube video failed:', previewVideo)}
                            />
                          ) : previewVideo.includes('drive.google.com') ? (
                            <iframe
                              src={getGoogleDriveVideoUrl(previewVideo)}
                              width="400"
                              height="300"
                              frameBorder="0"
                              allowFullScreen
                              title="Video Preview"
                              onLoad={() => console.log('Google Drive video loaded:', previewVideo)}
                              onError={() => console.error('Google Drive video failed:', previewVideo)}
                            />
                          ) : (
                            <video
                              src={previewVideo}
                              width="400"
                              height="300"
                              controls
                              style={{objectFit: 'cover'}}
                              onLoadedData={() => console.log('Direct video loaded:', previewVideo)}
                              onError={() => console.error('Direct video failed:', previewVideo)}
                            />
                          )}
                        </div>
                      </div>
                    )}
                    
                    {previewThumbnail && (
                      <div className="preview-item">
                        <label>Thumbnail Preview:</label>
                        <div className="thumbnail-preview">
                          <img
                            src={getGoogleDriveImageUrl(previewThumbnail)}
                            alt="Thumbnail Preview"
                            width="400"
                            height="300"
                            style={{objectFit: 'cover', borderRadius: '8px'}}
                            onLoad={(e) => {
                              console.log('Thumbnail loaded successfully:', e.target.src);
                            }}
                            onError={(e) => {
                              console.error('Thumbnail failed to load:', e.target.src);
                              
                              // Try alternative Google Drive formats
                              if (previewThumbnail.includes('drive.google.com')) {
                                const driveRegex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/
                                const match = previewThumbnail.match(driveRegex)
                                
                                if (match) {
                                  const fileId = match[1]
                                  const alternatives = [
                                    `https://drive.google.com/uc?export=view&id=${fileId}`,
                                    `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`,
                                    `https://lh3.googleusercontent.com/d/${fileId}`
                                  ]
                                  
                                  // Try the first alternative that hasn't been tried yet
                                  const currentSrc = e.target.src
                                  const nextAlt = alternatives.find(alt => alt !== currentSrc)
                                  
                                  if (nextAlt) {
                                    console.log('Trying alternative URL:', nextAlt)
                                    e.target.src = nextAlt
                                    return
                                  }
                                }
                              }
                              
                              // If all alternatives fail, show error message
                              e.target.style.display = 'none'
                              e.target.nextSibling.style.display = 'block'
                            }}
                          />
                          <div style={{display: 'none', padding: '20px', textAlign: 'center', color: '#666'}}>
                            <p>❌ Image failed to load</p>
                            <p style={{fontSize: '12px'}}>Check if the URL is publicly accessible</p>
                            <p style={{fontSize: '12px'}}>For Google Drive: Make sure sharing is set to "Anyone with the link"</p>
                            <button 
                              onClick={() => {
                                // Manual retry with original URL
                                const img = document.querySelector('.thumbnail-preview img')
                                if (img) {
                                  img.style.display = 'block'
                                  img.nextSibling.style.display = 'none'
                                  img.src = previewThumbnail
                                }
                              }}
                              style={{
                                marginTop: '10px',
                                padding: '5px 10px',
                                background: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                fontSize: '12px'
                              }}
                            >
                              Retry Original URL
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div className="upload-note">
                <p>* Provide at least a video URL or thumbnail URL.</p>
                <p>* Supported: YouTube, Google Drive, or direct video/image URLs.</p>
                <p>* For YouTube: Use any YouTube video URL format.</p>
                <p>* For Google Drive: Use the shareable link and ensure sharing is set to "Anyone with the link".</p>
                <p>* For thumbnails: Any direct image URL or Google Drive image link.</p>
                <p>* <strong>Important:</strong> Google Drive files must be publicly accessible for embedding to work.</p>
              </div>
              <button type="submit" className="btn-upload" disabled={isUploading}>
                {isUploading ? 'Uploading...' : 'Upload Reel'}
              </button>
            </form>

            <div className="reels-grid">
              <h3>Uploaded Reels</h3>
              {reels.length === 0 ? (
                <p style={{color: 'var(--text-muted)', fontStyle: 'italic'}}>No reels uploaded yet.</p>
              ) : (
                reels.map(reel => (
                  <div key={reel.id} className="reel-card">
                    <div className="reel-thumbnail">
                      {reel.thumbnailUrl ? (
                        <img 
                          src={getGoogleDriveImageUrl(reel.thumbnailUrl)} 
                          alt={reel.title} 
                          style={{width: '100%', height: '100%', objectFit: 'cover'}}
                          onError={(e) => {
                            console.error('Admin thumbnail failed:', e.target.src);
                            
                            // Try alternative Google Drive formats
                            if (reel.thumbnailUrl.includes('drive.google.com')) {
                              const driveRegex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/
                              const match = reel.thumbnailUrl.match(driveRegex)
                              
                              if (match) {
                                const fileId = match[1]
                                const alternatives = [
                                  `https://drive.google.com/uc?export=view&id=${fileId}`,
                                  `https://drive.google.com/thumbnail?id=${fileId}&sz=w300`,
                                  reel.thumbnailUrl
                                ]
                                
                                const currentSrc = e.target.src
                                const nextAlt = alternatives.find(alt => alt !== currentSrc)
                                
                                if (nextAlt) {
                                  console.log('Trying alternative admin thumbnail:', nextAlt)
                                  e.target.src = nextAlt
                                  return
                                }
                              }
                            }
                            
                            // Fallback to placeholder if all alternatives fail
                            e.target.style.display = 'none'
                            e.target.parentNode.innerHTML = '<div class="placeholder-thumb">📹</div>'
                          }}
                        />
                      ) : reel.videoUrl ? (
                        <div className="video-thumb">
                          {reel.videoUrl.includes('youtube.com') || reel.videoUrl.includes('youtu.be') ? (
                            <iframe
                              src={getYouTubeEmbedUrl(reel.videoUrl)}
                              width="80"
                              height="60"
                              frameBorder="0"
                              title={reel.title}
                              style={{pointerEvents: 'none'}}
                            />
                          ) : (
                            <div className="placeholder-thumb">📹</div>
                          )}
                        </div>
                      ) : (
                        <div className="placeholder-thumb">📹</div>
                      )}
                    </div>
                    <div className="reel-info">
                      <h4>{reel.title}</h4>
                      <p>Client: {reel.clientName}</p>
                      <p>Type: {reel.eventType}</p>
                      <p>Uploaded: {reel.uploadDate}</p>
                      {reel.videoUrl && (
                        <p style={{fontSize: '0.65rem', color: 'var(--gold)'}}>
                          {reel.videoUrl.includes('youtube.com') ? 'YouTube' : 
                           reel.videoUrl.includes('drive.google.com') ? 'Google Drive' : 'Direct URL'}
                        </p>
                      )}
                    </div>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDeleteReel(reel.id)}
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="modal-overlay" onClick={() => setSelectedBooking(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Booking Details</h3>
              <button onClick={() => setSelectedBooking(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-row">
                <strong>Client Name:</strong> {selectedBooking.clientName}
              </div>
              <div className="detail-row">
                <strong>Email:</strong> {selectedBooking.email}
              </div>
              <div className="detail-row">
                <strong>Phone:</strong> {selectedBooking.phone}
              </div>
              <div className="detail-row">
                <strong>Event Type:</strong> {selectedBooking.eventType}
              </div>
              <div className="detail-row">
                <strong>Event Date:</strong> {selectedBooking.eventDate}
              </div>
              <div className="detail-row">
                <strong>Venue:</strong> {selectedBooking.venue || 'Not specified'}
              </div>
              <div className="detail-row">
                <strong>Budget:</strong> {selectedBooking.budget || 'Not specified'}
              </div>
              <div className="detail-row">
                <strong>Message:</strong> {selectedBooking.message}
              </div>
              <div className="detail-row">
                <strong>Booking Date:</strong> {selectedBooking.bookingDate}
              </div>
              <div className="detail-row">
                <strong>Status:</strong> 
                <span className={`status ${selectedBooking.status}`}>
                  {selectedBooking.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}