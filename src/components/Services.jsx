const services = [
  {
    num: '01',
    tag: 'Signature',
    name: 'Wedding Films',
    desc: 'Cinematic wedding films that capture every sacred vow, stolen glance, and joyful tear. Your love story told beautifully.',
    icon: (
      <svg className="service-icon" viewBox="0 0 40 40" fill="none">
        <path d="M8 28L16 20L22 26L28 18L34 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="20" cy="15" r="7" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M14 34C14 31 16.7 29 20 29C23.3 29 26 31 26 34" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    num: '02',
    tag: 'Popular',
    name: 'Birthday Stories',
    desc: 'Turn milestone birthdays into cinematic memories. From candid moments to grand celebrations — we frame every laugh.',
    icon: (
      <svg className="service-icon" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="12" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M20 8V20L27 27" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M12 4L16 8M28 4L24 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    num: '03',
    tag: 'Cultural',
    name: 'Mehendi & Functions',
    desc: 'Vibrant, colorful, and alive — pre-wedding ceremonies shot with artistic depth and cultural sensitivity.',
    icon: (
      <svg className="service-icon" viewBox="0 0 40 40" fill="none">
        <path d="M10 30C10 24 14 20 20 18C26 20 30 24 30 30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="20" cy="12" r="5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M6 18C8 14 12 12 16 13M34 18C32 14 28 12 24 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    num: '04',
    tag: 'Expert',
    name: 'Video Editing',
    desc: 'Raw footage transformed into a cinematic masterpiece. Color grading, music syncing, and storytelling that moves you.',
    icon: (
      <svg className="service-icon" viewBox="0 0 40 40" fill="none">
        <rect x="6" y="12" width="28" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M17 18L24 22L17 26V18Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M10 8H30M14 34H26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
]

export default function Services() {
  return (
    <section className="services-section" id="services">
      <div className="services-header reveal">
        <div>
          <div className="section-label">What We Do</div>
          <h2 className="services-title">
            Every Occasion,<br /><em>Captured Perfectly</em>
          </h2>
        </div>
        <p className="services-desc">
          We offer end-to-end videography and editing services for every kind of celebration — from
          intimate birthdays to grand weddings.
        </p>
      </div>

      <div className="services-grid">
        {services.map((s, i) => (
          <div key={s.num} className={`service-card reveal delay-${i}`}>
            <div className="service-num">{s.num}</div>
            {s.icon}
            <h3 className="service-name">{s.name}</h3>
            <p className="service-desc">{s.desc}</p>
            <span className="service-tag">{s.tag}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
