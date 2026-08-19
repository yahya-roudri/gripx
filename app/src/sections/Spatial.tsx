import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Spatial() {
  const sectionRef = useRef<HTMLElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    const content = contentRef.current
    const img = imgRef.current
    if (!section || !content) return

    const ctx = gsap.context(() => {
      gsap.from(content.children, {
        y: 40,
        opacity: 0,
        duration: 1.1,
        stagger: 0.18,
        ease: 'power3.out',
        delay: 0.4,
      })
      if (img) {
        gsap.fromTo(
          img,
          { scale: 1.15 },
          {
            scale: 1,
            duration: 2.4,
            ease: 'power2.out',
          }
        )
        gsap.to(img, {
          yPercent: 12,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        })
      }
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="spatial"
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        minHeight: '640px',
        overflow: 'hidden',
        backgroundColor: '#0b0b0b',
      }}
    >
      <img
        ref={imgRef}
        src="/images/straps-03.jpg"
        alt="GRIPX lifting straps locked on a barbell"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.72) 0%, rgba(11,11,11,0.35) 40%, rgba(11,11,11,0.9) 100%), radial-gradient(ellipse at 15% 80%, rgba(220,38,38,0.25) 0%, transparent 55%)',
        }}
      />

      <div
        ref={contentRef}
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          gap: '28px',
          padding: '0 clamp(32px, 4.5vw, 72px)',
        }}
      >
        <span
          style={{
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.28em',
            color: '#ef4444',
            textTransform: 'uppercase',
          }}
        >
          Heavy-Duty Lifting Straps · Morocco
        </span>

        <h1
          style={{
            fontSize: 'clamp(48px, 8vw, 120px)',
            fontWeight: 900,
            fontStyle: 'italic',
            letterSpacing: '-0.03em',
            lineHeight: 0.95,
            color: '#ffffff',
            maxWidth: '920px',
            textTransform: 'uppercase',
            textShadow: '0 4px 40px rgba(220,38,38,0.35)',
          }}
        >
          Grip Harder.
          <br />
          Lift <span style={{ color: '#dc2626' }}>Heavier.</span>
        </h1>

        <p
          style={{
            fontSize: 'clamp(15px, 1.2vw, 18px)',
            fontWeight: 300,
            lineHeight: 1.65,
            color: 'rgba(255,255,255,0.85)',
            maxWidth: '520px',
          }}
        >
          GRIPX straps lock your hands to the bar so your grip never quits
          before your back does. Industrial-grade cotton, neoprene-padded,
          stitched to survive your heaviest pulls — delivered anywhere in
          Morocco.
        </p>

        <div style={{ display: 'flex', gap: '16px', marginTop: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            onClick={() => document.querySelector('#hero')?.scrollIntoView({ behavior: 'smooth' })}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              fontSize: '14px',
              fontWeight: 800,
              letterSpacing: '0.12em',
              color: '#ffffff',
              backgroundColor: hovered ? '#b91c1c' : '#dc2626',
              border: 'none',
              padding: '18px 40px',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              textTransform: 'uppercase',
              fontFamily: '"Helvetica Neue", sans-serif',
              transform: hovered ? 'skewX(-8deg) scale(1.04)' : 'skewX(-8deg)',
              boxShadow: hovered
                ? '0 0 44px rgba(220,38,38,0.65)'
                : '0 0 24px rgba(220,38,38,0.35)',
            }}
          >
            Order Now — 140 MAD
          </button>
          <button
            onClick={() => document.querySelector('#works')?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '0.14em',
              color: '#ffffff',
              backgroundColor: 'transparent',
              border: 'none',
              padding: '16px 8px',
              cursor: 'pointer',
              textTransform: 'uppercase',
              fontFamily: '"Helvetica Neue", sans-serif',
              textDecoration: 'underline',
              textUnderlineOffset: '6px',
            }}
          >
            See the Arsenal →
          </button>
        </div>

        <span
          style={{
            fontSize: '11px',
            letterSpacing: '0.22em',
            color: 'rgba(255,255,255,0.55)',
            textTransform: 'uppercase',
          }}
        >
          Cash on Delivery · All Morocco · No card needed
        </span>
      </div>
    </section>
  )
}
