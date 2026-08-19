import { useEffect, useRef, useState } from 'react'

interface HeaderProps {
  scrollRef: React.MutableRefObject<{ y: number; speed: number }>
  forceLight?: boolean
}

const navItems = ['Arsenal', 'Specs', 'Order']
const sectionIds = ['#works', '#capabilities', '#hero']

export default function Header({ scrollRef, forceLight = false }: HeaderProps) {
  const [isCompact, setIsCompact] = useState(false)
  const [overHeroRaw, setOverHeroRaw] = useState(true)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const check = () => {
      const y = scrollRef.current.y
      setIsCompact(y > 100)
      setOverHeroRaw(y < window.innerHeight * 0.85)
      rafRef.current = requestAnimationFrame(check)
    }
    rafRef.current = requestAnimationFrame(check)
    return () => cancelAnimationFrame(rafRef.current)
  }, [scrollRef])

  const overHero = overHeroRaw && !forceLight

  const handleNavClick = (index: number) => {
    const target = document.querySelector(sectionIds[index])
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const textColor = overHero ? '#ffffff' : '#0b0b0b'

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: isCompact ? '64px' : '88px',
        backgroundColor: overHero ? 'transparent' : 'rgba(255,255,255,0.97)',
        backdropFilter: overHero ? 'none' : 'blur(8px)',
        borderBottom: overHero
          ? '1px solid rgba(255,255,255,0.14)'
          : '1px solid #0b0b0b',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 clamp(20px, 4vw, 60px)',
        transition:
          'height 0.4s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.4s ease, border-color 0.4s ease',
      }}
    >
      <div
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
        }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          style={{ flexShrink: 0 }}
        >
          <path
            d="M9.5 14.5L14.5 9.5"
            stroke="#dc2626"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <path
            d="M11 6.5L13 4.5C14.4 3.1 16.6 3.1 18 4.5V4.5C19.4 5.9 19.4 8.1 18 9.5L16 11.5"
            stroke={textColor}
            strokeWidth="2.4"
            strokeLinecap="round"
            style={{ transition: 'stroke 0.4s ease' }}
          />
          <path
            d="M13 17.5L11 19.5C9.6 20.9 7.4 20.9 6 19.5V19.5C4.6 18.1 4.6 15.9 6 14.5L8 12.5"
            stroke={textColor}
            strokeWidth="2.4"
            strokeLinecap="round"
            style={{ transition: 'stroke 0.4s ease' }}
          />
        </svg>
        <div
          style={{
            fontSize: '18px',
            fontWeight: 900,
            fontStyle: 'italic',
            letterSpacing: '0.18em',
            color: textColor,
            transition: 'color 0.4s ease',
            textTransform: 'uppercase',
          }}
        >
          GRIP<span style={{ color: '#dc2626' }}>X</span>
        </div>
      </div>

      <nav style={{ display: 'flex', alignItems: 'stretch', height: '100%' }}>
        {navItems.map((item, i) => (
          <NavItem
            key={item}
            label={item}
            overHero={overHero}
            accent={item === 'Order'}
            onClick={() => handleNavClick(i)}
          />
        ))}
      </nav>
    </header>
  )
}

function NavItem({
  label,
  overHero,
  accent = false,
  onClick,
}: {
  label: string
  overHero: boolean
  accent?: boolean
  onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)

  const baseColor = accent ? '#dc2626' : overHero ? '#ffffff' : '#0b0b0b'
  const hoverBg = accent ? '#dc2626' : overHero ? '#ffffff' : '#0b0b0b'
  const hoverFg = accent ? '#ffffff' : overHero ? '#000000' : '#ffffff'

  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 24px',
        fontSize: '13px',
        fontWeight: accent ? 800 : 500,
        letterSpacing: '0.08em',
        backgroundColor: hovered ? hoverBg : 'transparent',
        color: hovered ? hoverFg : baseColor,
        border: 'none',
        cursor: 'pointer',
        transition: 'background-color 0.25s ease, color 0.25s ease',
        whiteSpace: 'nowrap',
        fontFamily: '"Helvetica Neue", sans-serif',
        textTransform: 'uppercase',
      }}
    >
      {label}
    </button>
  )
}
