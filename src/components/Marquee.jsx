const items = [
  'Wedding Films', 'Birthday Stories', 'Mehendi Shoots',
  'Cinematic Editing', 'Highlight Reels', 'Event Coverage',
]

export default function Marquee() {
  const doubled = [...items, ...items]
  return (
    <div className="marquee-section">
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span key={i} className="marquee-item">
            {item} <span className="marquee-dot">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
