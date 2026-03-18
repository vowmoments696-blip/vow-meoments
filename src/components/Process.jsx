const steps = [
  { num: '01', title: 'Connect', desc: 'Reach out via WhatsApp or our booking form. Tell us your date, event type, and vision.' },
  { num: '02', title: 'Plan', desc: 'We discuss your story, style references, and create a shot plan tailored to your event.' },
  { num: '03', title: 'Shoot', desc: 'We arrive, set up, and seamlessly capture every precious moment of your celebration.' },
  { num: '04', title: 'Deliver', desc: 'Receive your beautifully edited cinematic film within the promised timeline. Relive. Forever.' },
]

export default function Process() {
  return (
    <section className="process-section" id="process">
      <div className="process-inner">
        <div className="process-header reveal">
          <div className="section-label" style={{ justifyContent: 'center', marginBottom: '1rem' }}>
            How It Works
          </div>
          <h2 className="process-title">
            From <em>Booking</em> to Memories
          </h2>
        </div>

        <div className="process-steps">
          {steps.map((s, i) => (
            <div key={s.num} className={`process-step reveal delay-${i}`}>
              <div className="step-circle">{s.num}</div>
              <h3 className="step-title">{s.title}</h3>
              <p className="step-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
