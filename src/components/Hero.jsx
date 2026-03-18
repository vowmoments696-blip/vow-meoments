import { useEffect, useRef } from 'react'

export default function Hero() {
  const particlesRef = useRef(null)

  useEffect(() => {
    const container = particlesRef.current
    if (!container) return
    for (let i = 0; i < 18; i++) {
      const p = document.createElement('div')
      p.className = 'particle'
      const size = Math.random() * 3 + 1
      p.style.cssText = `
        width:${size}px; height:${size}px;
        left:${Math.random() * 100}%;
        bottom:${Math.random() * 30}%;
        animation-duration:${Math.random() * 12 + 8}s;
        animation-delay:${Math.random() * 8}s;
      `
      container.appendChild(p)
    }
    return () => { container.innerHTML = '' }
  }, [])

  return (
    <section className="hero" id="hero">
      <div className="hero-bg" />
      <div ref={particlesRef} style={{ position: 'absolute', inset: 0 }} />

      <div className="hero-content">
        <p className="hero-eyebrow">Cinematic Storytelling &nbsp;·&nbsp; Est. 2023</p>
        <h1 className="hero-title">Vow</h1>
        <h1 className="hero-title-italic">Moments</h1>
        <p className="hero-sub">Wedding &nbsp;·&nbsp; Birthday &nbsp;·&nbsp; Mehendi &nbsp;·&nbsp; Special Occasions &nbsp;·&nbsp; Brand Promotions</p>
        <div className="hero-actions">
          <a href="#portfolio" className="btn-primary">See Our Work</a>
          <a href="#contact" className="btn-ghost">Book a Shoot</a>
        </div>
      </div>

      <div className="hero-scroll">
        <div className="scroll-line" />
        <span className="scroll-text">Scroll</span>
      </div>
    </section>
  )
}
