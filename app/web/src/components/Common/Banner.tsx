import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'

const Banner = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    videoRef.current?.play().catch(() => {})
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mediaQuery.matches && videoRef.current) {
      videoRef.current.pause()
    }
  }, [])

  return (
    <section className="relative w-full min-h-[520px] flex items-center justify-center overflow-hidden bg-black">

      <video
        ref={videoRef}
        autoPlay muted loop playsInline
        poster="/hero/hero-poster.jpg"
        className="absolute inset-0 w-full h-full object-cover object-center"
      >
        <source src="/hero/hero_compressed.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/[0.62]" />

      <div className="relative z-10 flex flex-col items-center text-center px-4 py-16 max-w-3xl mx-auto">

        <h1 className="text-4xl md:text-5xl font-proximaBold text-white leading-tight mb-4">
          Buy & Sell Tickets Securely
        </h1>

        <p className="text-sm md:text-base font-proximaRegular text-white/70 mb-8">
          Fast, Safe, and Hassle-Free!
        </p>

        <div className="flex gap-3 flex-wrap justify-center">
          <button
            onClick={() => navigate('/events')}
            data-testid="hero-cta-find-tickets"
            style={{ backgroundColor: '#2563EB' }}
            className="font-proximaSemiBold text-white rounded-full px-6 py-2.5 hover:opacity-90 transition-opacity"
          >
            Find Tickets
          </button>
          <button
            onClick={() => navigate('/sell-tickets')}
            data-testid="hero-cta-sell-tickets"
            style={{ borderColor: '#2563EB', color: '#2563EB' }}
            className="font-proximaSemiBold bg-white rounded-full px-6 py-2.5 border-2 hover:bg-gray-50 transition-colors"
          >
            Sell Your Tickets
          </button>
        </div>
      </div>
    </section>
  )
}

export default Banner
