import { useEffect, useState } from 'react'
import Cursor from './components/Cursor'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import About from './components/About'
import Services from './components/Services'
import Portfolio from './components/Portfolio'
import Process from './components/Process'
import Testimonial from './components/Testimonial'
import Contact from './components/Contact'
import Footer from './components/Footer'
import AdminDashboard from './components/AdminDashboard'
import { useReveal } from './hooks/useReveal'
import './admin-styles.css'

export default function App() {
  const [isAdminRoute, setIsAdminRoute] = useState(false)
  
  useReveal()

  useEffect(() => {
    // Simple routing check
    const path = window.location.pathname
    setIsAdminRoute(path === '/admin')
    
    // Handle browser navigation
    const handlePopState = () => {
      setIsAdminRoute(window.location.pathname === '/admin')
    }
    
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // Override navigation for admin route
  useEffect(() => {
    const originalPushState = window.history.pushState
    const originalReplaceState = window.history.replaceState
    
    window.history.pushState = function(state, title, url) {
      originalPushState.call(this, state, title, url)
      setIsAdminRoute(url === '/admin')
    }
    
    window.history.replaceState = function(state, title, url) {
      originalReplaceState.call(this, state, title, url)
      setIsAdminRoute(url === '/admin')
    }
    
    return () => {
      window.history.pushState = originalPushState
      window.history.replaceState = originalReplaceState
    }
  }, [])

  if (isAdminRoute) {
    return <AdminDashboard />
  }

  return (
    <>
      <Cursor />
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Services />
        <Portfolio />
        <Process />
        <Testimonial />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
