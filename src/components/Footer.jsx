import { useState } from 'react'

const navLinks = ['About', 'Services', 'Portfolio', 'Contact']

const socialLinks = [
  {
    name: 'Instagram',
    url: 'https://instagram.com/oye_its_acash',
    target: '_blank'
  },
  {
    name: 'YouTube',
    url: 'https://youtube.com/@yennanevlogs8008',
    target: '_blank'
  },
  {
    name: 'WhatsApp',
    url: 'https://wa.me/917019394782?text=Hi!%20I%27m%20interested%20in%20Vow%20Moments%20videography%20services.%20Could%20you%20please%20share%20more%20details%3F',
    target: '_blank'
  }
]

export default function Footer() {
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [adminCredentials, setAdminCredentials] = useState({ email: '', password: '' })

  const handleAdminLogin = (e) => {
    e.preventDefault()
    // Simple admin credentials for now
    if (adminCredentials.email === 'admin@vowmoments.com' && adminCredentials.password === 'admin123') {
      localStorage.setItem('vowMomentsAdmin', 'true')
      window.location.href = '/admin'
    } else {
      alert('Invalid credentials')
    }
  }

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <div className="footer-brand">Vow <em>Moments</em></div>
          <div className="footer-tagline">Cinematic Stories. Real Emotions.</div>
        </div>
        <ul className="footer-links">
          {navLinks.map(link => (
            <li key={link}>
              <a href={`#${link.toLowerCase()}`}>{link}</a>
            </li>
          ))}
        </ul>
        <div className="footer-social">
          {socialLinks.map(social => (
            <a 
              key={social.name} 
              href={social.url}
              target={social.target}
              rel={social.target === '_blank' ? 'noopener noreferrer' : undefined}
            >
              {social.name}
            </a>
          ))}
        </div>
      </div>
      
      {/* Discrete Admin Login */}
      <div className="admin-section">
        {!showAdminLogin ? (
          <button 
            className="admin-trigger"
            onClick={() => setShowAdminLogin(true)}
          >
            •
          </button>
        ) : (
          <form className="admin-login-form" onSubmit={handleAdminLogin}>
            <input
              type="email"
              placeholder="Admin Email"
              value={adminCredentials.email}
              onChange={(e) => setAdminCredentials({...adminCredentials, email: e.target.value})}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={adminCredentials.password}
              onChange={(e) => setAdminCredentials({...adminCredentials, password: e.target.value})}
              required
            />
            <button type="submit">Login</button>
            <button type="button" onClick={() => setShowAdminLogin(false)}>×</button>
          </form>
        )}
      </div>

      <p className="footer-copy">
        © 2025 Vow Moments. All rights reserved. Crafted with love in Karkala.
      </p>
    </footer>
  )
}
