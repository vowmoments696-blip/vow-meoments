import { useEffect, useRef, useState } from 'react'

export default function Cursor() {
  const cursorRef = useRef(null)
  const ringRef = useRef(null)
  const [hover, setHover] = useState(false)
  const pos = useRef({ x: 0, y: 0 })
  const ring = useRef({ x: 0, y: 0 })
  const raf = useRef(null)

  useEffect(() => {
    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY }
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + 'px'
        cursorRef.current.style.top = e.clientY + 'px'
      }
    }
    document.addEventListener('mousemove', onMove)

    const animate = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.12
      ring.current.y += (pos.current.y - ring.current.y) * 0.12
      if (ringRef.current) {
        ringRef.current.style.left = ring.current.x + 'px'
        ringRef.current.style.top = ring.current.y + 'px'
      }
      raf.current = requestAnimationFrame(animate)
    }
    raf.current = requestAnimationFrame(animate)

    const hoverEls = document.querySelectorAll('a, button, .port-item, .service-card')
    const on = () => setHover(true)
    const off = () => setHover(false)
    hoverEls.forEach(el => { el.addEventListener('mouseenter', on); el.addEventListener('mouseleave', off) })

    return () => {
      document.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf.current)
      hoverEls.forEach(el => { el.removeEventListener('mouseenter', on); el.removeEventListener('mouseleave', off) })
    }
  }, [])

  return (
    <>
      <div ref={cursorRef} className={`cursor${hover ? ' hover' : ''}`} />
      <div ref={ringRef} className={`cursor-ring${hover ? ' hover' : ''}`} />
    </>
  )
}
