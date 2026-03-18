import { useEffect, useState } from 'react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLinkClick = () => {
    setMobileMenuOpen(false)
  }

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <a href="#hero" className="nav-logo">Vow <em>Moments</em></a>
      
      <ul className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <li><a href="#about" onClick={handleLinkClick}>About</a></li>
        <li><a href="#services" onClick={handleLinkClick}>Services</a></li>
        <li><a href="#portfolio" onClick={handleLinkClick}>Work</a></li>
        <li><a href="#process" onClick={handleLinkClick}>Process</a></li>
      </ul>
      
      <div className="nav-right">
        <a href="#contact" className="nav-cta">Book Now</a>
        <button 
          className={`mobile-menu-btn ${mobileMenuOpen ? 'open' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  )
}
