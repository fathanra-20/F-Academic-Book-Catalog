import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Footer } from './Footer.tsx'
import { Navbar } from './Navbar.tsx'

export function MainLayout() {
  const { pathname } = useLocation()

  useEffect(() => {
    const originalScrollBehavior: string = document.documentElement.style.scrollBehavior
    const startPosition: number = window.scrollY
    const duration: number = 1400
    const startTime: number = performance.now()
    let activeAnimation: number

    document.documentElement.style.scrollBehavior = 'auto'

    function animate(currentTime: number): void {
      const progress: number = Math.min((currentTime - startTime) / duration, 1)
      const easedProgress: number = 0.5 - Math.cos(progress * Math.PI) / 2

      window.scrollTo({
        top: startPosition * (1 - easedProgress),
        left: 0,
        behavior: 'auto',
      })

      if (progress < 1) {
        activeAnimation = requestAnimationFrame(animate)
      } else {
        document.documentElement.style.scrollBehavior = originalScrollBehavior
      }
    }

    activeAnimation = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(activeAnimation)
      document.documentElement.style.scrollBehavior = originalScrollBehavior
    }
  }, [pathname])

  return (
    <div className="page-shell">
      <a className="skip-link" href="#main-content">
        Lewati ke konten utama
      </a>
      <Navbar />
      <main id="main-content" className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
