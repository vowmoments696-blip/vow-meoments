import { useState, useEffect } from 'react'

const initialQuotes = [
  {
    id: 1,
    text: '"Vow Moments didn\'t just record our wedding — they created a film we cry happy tears watching every anniversary. Every single detail was captured with so much love."',
    author: 'Meera & Karthik — Udupi Wedding',
  },
  {
    id: 2,
    text: '"My daughter\'s birthday video was absolutely magical. Every smile, every surprise moment — all caught perfectly. We keep rewatching it as a family."',
    author: 'Sunita Rao — Manipal',
  },
  {
    id: 3,
    text: '"The mehendi shoot was stunning. The colors, the energy, the emotion — all captured beautifully. Professional, creative, and truly talented team."',
    author: 'Divya Shetty — Mangalore',
  },
  {
    id: 4,
    text: '"Absolutely phenomenal work! The team captured our engagement so beautifully. Every frame tells our love story perfectly. Highly recommend!"',
    author: 'Priya & Arjun — Manipal',
  },
  {
    id: 5,
    text: '"Best decision we made for our wedding videography. The final video was beyond our expectations. Pure cinematic magic!"',
    author: 'Kavya & Rohan — Udupi',
  },
]

// Load reviews from localStorage
const getStoredReviews = () => {
  try {
    const reviews = localStorage.getItem('vowMomentsReviews')
    return reviews ? JSON.parse(reviews) : []
  } catch (error) {
    return []
  }
}

// Save review to localStorage
const saveReview = (review) => {
  try {
    const existingReviews = getStoredReviews()
    const newReview = {
      id: Date.now(),
      text: `"${review.text}"`,
      author: `${review.name} — ${review.location || 'Client'}`,
      isUserReview: true
    }
    const updatedReviews = [...existingReviews, newReview]
    localStorage.setItem('vowMomentsReviews', JSON.stringify(updatedReviews))
    return newReview
  } catch (error) {
    return null
  }
}

export default function Testimonial() {
  const [quotes, setQuotes] = useState([...initialQuotes, ...getStoredReviews()])
  const [current, setCurrent] = useState(0)
  const [visible, setVisible] = useState(true)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [reviewForm, setReviewForm] = useState({
    name: '',
    location: '',
    text: ''
  })

  const change = (i) => {
    setVisible(false)
    setTimeout(() => {
      setCurrent(i)
      setVisible(true)
    }, 300)
  }

  useEffect(() => {
    const timer = setInterval(() => change((current + 1) % quotes.length), 4000)
    return () => clearInterval(timer)
  }, [current, quotes.length])

  const handleReviewSubmit = (e) => {
    e.preventDefault()
    if (!reviewForm.name.trim() || !reviewForm.text.trim()) {
      alert('Please fill in your name and review.')
      return
    }

    const savedReview = saveReview(reviewForm)
    if (savedReview) {
      const updatedQuotes = [...quotes, savedReview]
      setQuotes(updatedQuotes)
      setReviewForm({ name: '', location: '', text: '' })
      setShowReviewModal(false)
      alert('Thank you for your review! It has been added to our testimonials.')
      // Switch to the new review
      setTimeout(() => change(updatedQuotes.length - 1), 500)
    } else {
      alert('Error submitting review. Please try again.')
    }
  }

  return (
    <section className="testimonial-section" id="testimonial">
      <div className="section-label reveal">Client Love</div>
      <p
        className="quote-text reveal"
        style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.3s' }}
      >
        {quotes[current]?.text}
      </p>
      <p
        className="quote-author reveal"
        style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.3s' }}
      >
        {quotes[current]?.author}
        {quotes[current]?.isUserReview && <span className="user-review-badge">✨</span>}
      </p>
      <div className="quote-dots">
        {quotes.map((_, i) => (
          <button
            key={i}
            className={`dot${current === i ? ' active' : ''}`}
            onClick={() => change(i)}
          />
        ))}
      </div>
      
      <button 
        className="add-review-btn reveal delay-1"
        onClick={() => setShowReviewModal(true)}
      >
        Share Your Experience ✦
      </button>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="review-modal-overlay" onClick={() => setShowReviewModal(false)}>
          <div className="review-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="review-modal-header">
              <h3>Share Your Experience</h3>
              <button 
                className="review-modal-close"
                onClick={() => setShowReviewModal(false)}
              >
                ×
              </button>
            </div>
            <form className="review-form" onSubmit={handleReviewSubmit}>
              <div className="review-form-row">
                <div className="review-form-group">
                  <label>Your Name *</label>
                  <input
                    type="text"
                    placeholder="e.g., Priya & Arjun"
                    value={reviewForm.name}
                    onChange={(e) => setReviewForm({...reviewForm, name: e.target.value})}
                    required
                  />
                </div>
                <div className="review-form-group">
                  <label>Location (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g., Udupi, Manipal"
                    value={reviewForm.location}
                    onChange={(e) => setReviewForm({...reviewForm, location: e.target.value})}
                  />
                </div>
              </div>
              <div className="review-form-group">
                <label>Your Review *</label>
                <textarea
                  placeholder="Tell us about your experience with Vow Moments..."
                  value={reviewForm.text}
                  onChange={(e) => setReviewForm({...reviewForm, text: e.target.value})}
                  rows="4"
                  required
                />
              </div>
              <button type="submit" className="review-submit-btn">
                Submit Review ✦
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}
