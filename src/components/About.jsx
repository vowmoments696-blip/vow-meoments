import mainImage from '../assets/main.jpeg'

export default function About() {
  return (
    <section id="about">
      <div className="about-section">
        <div className="about-visual reveal">
          <div className="about-img-frame">
            <img src={mainImage} alt="Vow Moments Photography" className="about-main-img" />
            <div className="lens-flare" />
          </div>
          <div className="about-frame-border" />
        </div>

        <div className="about-text">
          <div className="section-label reveal">Our Story</div>
          <h2 className="reveal delay-1">
            We Don't Just Shoot,<br />We <em>Preserve</em> Emotions
          </h2>
          <p className="reveal delay-2">
            At Vow Moments, every frame is a feeling. We're a passionate team of videographers and
            editors who believe your most precious milestones deserve to be told like a film — with
            heart, intention, and cinematic beauty.
          </p>
          <p className="reveal delay-3">
            From the laughter of a birthday celebration to the tears and joy of a wedding, we capture
            what words can't say and time tries to erase.
          </p>
          <div className="about-stats reveal delay-4">
            {[
              { num: '120+', label: 'Events Shot' },
              { num: '4K', label: 'Resolution' },
              { num: '100%', label: 'Happy Clients' },
            ].map((s) => (
              <div key={s.label}>
                <div className="stat-num">{s.num}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
