import { useState } from 'react'
import { saveBooking } from '../utils/bookingStorage'

const contactInfo = [
  {
    label: 'Location',
    value: 'Karkala/ Udupi, Karnataka',
    icon: (
      <svg className="info-icon" viewBox="0 0 16 16" fill="none">
        <path d="M8 1.5C5.5 1.5 3.5 3.5 3.5 6C3.5 9 8 14.5 8 14.5C8 14.5 12.5 9 12.5 6C12.5 3.5 10.5 1.5 8 1.5Z" stroke="currentColor" strokeWidth="1.2"/>
        <circle cx="8" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
      </svg>
    ),
  },
  {
    label: 'Email',
    value: 'vowmoments12@gmail.com',
    icon: (
      <svg className="info-icon" viewBox="0 0 16 16" fill="none">
        <rect x="1.5" y="3.5" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M1.5 5.5L8 10L14.5 5.5" stroke="currentColor" strokeWidth="1.2"/>
      </svg>
    ),
  },
  {
    label: 'WhatsApp',
    value: '+91 7019394752',
    icon: (
      <svg className="info-icon" viewBox="0 0 16 16" fill="none">
        <path d="M2 3.5C2 3.5 2.5 2 4 2C5.5 2 6.5 4 6.5 4L5 5.5C5.5 6.5 9.5 10.5 10.5 11L12 9.5C12 9.5 14 10.5 14 12C14 13.5 12.5 14 12.5 14C12.5 14 3 12 2 3.5Z" stroke="currentColor" strokeWidth="1.2"/>
      </svg>
    ),
  },
]

export default function Contact() {
  const [form, setForm] = useState({
    clientName: '', 
    email: '', 
    phone: '', 
    eventType: '', 
    eventDate: '', 
    venue: '', 
    budget: '', 
    message: '',
  })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    console.log('Form submitted with data:', form) // Debug log
    
    // Validate required fields
    if (!form.clientName || !form.email || !form.phone || !form.eventType || !form.eventDate) {
      alert('Please fill in all required fields.')
      return
    }
    
    console.log('Validation passed, saving booking to Firebase...') // Debug log
    
    try {
      // Check if Firebase is ready
      if (!window.firebaseInitialized || !window.firestoreModule) {
        console.error('Firebase not ready yet');
        alert('Firebase is still initializing. Please wait a moment and try again.');
        return;
      }
      
      const savedBooking = await saveBooking(form)
      console.log('Saved booking result:', savedBooking) // Debug log
      
      if (savedBooking) {
        alert('Booking request sent successfully! We will contact you shortly.')
        // Reset form
        setForm({
          clientName: '', 
          email: '', 
          phone: '', 
          eventType: '', 
          eventDate: '', 
          venue: '', 
          budget: '', 
          message: '',
        })
      } else {
        alert('Error sending booking request. Please try again.')
      }
    } catch (error) {
      console.error('Error saving booking:', error)
      alert(`Error sending booking request: ${error.message}. Please check your connection and try again.`)
    }
  }

  return (
    <section className="contact-section" id="contact">
      <div className="contact-inner">
        <div className="contact-left">
          <div className="section-label reveal">Let's Work Together</div>
          <h2 className="reveal delay-1">
            Ready to <em>Capture</em><br />Your Story?
          </h2>
          <p className="reveal delay-2">
            Available for weddings, birthdays, mehendi, and all special events across Udupi,
            Manipal, Mangalore, and beyond.
          </p>
          <ul className="contact-info reveal delay-3">
            {contactInfo.map((item) => (
              <li key={item.label}>
                {item.icon}
                <div>
                  <div className="info-label">{item.label}</div>
                  <div className="info-val">{item.value}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <form className="contact-form reveal delay-1" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Your Name *</label>
              <input 
                name="clientName" 
                type="text" 
                placeholder="Meera Sharma" 
                value={form.clientName} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Email Address *</label>
              <input 
                name="email" 
                type="email" 
                placeholder="meera@example.com" 
                value={form.email} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Phone / WhatsApp *</label>
              <input 
                name="phone" 
                type="tel" 
                placeholder="+91 98765 43210" 
                value={form.phone} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Event Type *</label>
              <select name="eventType" value={form.eventType} onChange={handleChange} required>
                <option value="" disabled>Select your event</option>
                <option value="Wedding">Wedding</option>
                <option value="Birthday">Birthday Celebration</option>
                <option value="Mehendi">Mehendi Ceremony</option>
                <option value="Engagement">Engagement</option>
                <option value="Baby Shower">Baby Shower</option>
                <option value="Other">Other Event</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Event Date *</label>
              <input 
                name="eventDate" 
                type="date" 
                value={form.eventDate} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Venue/Location</label>
              <input 
                name="venue" 
                type="text" 
                placeholder="Grand Palace Hotel, Udupi" 
                value={form.venue} 
                onChange={handleChange} 
              />
            </div>
          </div>
          <div className="form-group">
            <label>Budget Range</label>
            <input 
              name="budget" 
              type="text" 
              placeholder="e.g., ₹2000" 
              value={form.budget} 
              onChange={handleChange} 
            />
          </div>
          <div className="form-group">
            <label>Tell Us Your Vision</label>
            <textarea
              name="message"
              placeholder="Describe your dream film — style, mood, special moments you want captured..."
              value={form.message}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="form-submit">Send Booking Request ✦</button>
        </form>
      </div>
    </section>
  )
}
