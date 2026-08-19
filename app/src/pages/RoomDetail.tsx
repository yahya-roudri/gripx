import { useEffect, useState } from 'react'
import { rooms } from '../data/rooms'

interface RoomDetailProps {
  roomId: string
  onBack: () => void
  onOrder: () => void
}

export default function RoomDetail({ roomId, onBack, onOrder }: RoomDetailProps) {
  const room = rooms.find((r) => r.id === roomId)
  const [hovered, setHovered] = useState(false)
  const [activeImg, setActiveImg] = useState(0)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
    setActiveImg(0)
  }, [roomId])

  if (!room) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#ffffff',
          color: '#0b0b0b',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <p style={{ fontSize: '20px' }}>Strap not found.</p>
        <button
          onClick={onBack}
          style={{
            fontSize: '13px',
            letterSpacing: '0.14em',
            padding: '14px 32px',
            border: '1px solid #0b0b0b',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            textTransform: 'uppercase',
          }}
        >
          ← Back to arsenal
        </button>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
      {/* Hero image */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: 'clamp(400px, 70vh, 720px)',
          overflow: 'hidden',
          backgroundColor: '#0b0b0b',
        }}
      >
        <img
          src={room.images[activeImg] ?? room.img}
          alt={room.title}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        {room.images.length > 1 && (
          <div
            style={{
              position: 'absolute',
              bottom: 'clamp(32px, 5vw, 60px)',
              right: 'clamp(24px, 4vw, 60px)',
              display: 'flex',
              gap: '10px',
              zIndex: 2,
            }}
          >
            {room.images.map((src, i) => (
              <button
                key={src}
                onClick={() => setActiveImg(i)}
                aria-label={`View photo ${i + 1}`}
                style={{
                  width: '64px',
                  height: '64px',
                  padding: 0,
                  overflow: 'hidden',
                  border: i === activeImg ? '2px solid #dc2626' : '2px solid rgba(255,255,255,0.6)',
                  cursor: 'pointer',
                  backgroundColor: '#0b0b0b',
                  opacity: i === activeImg ? 1 : 0.7,
                  transition: 'all 0.2s ease',
                }}
              >
                <img
                  src={src}
                  alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </button>
            ))}
          </div>
        )}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.6) 100%)',
          }}
        />
        <button
          onClick={onBack}
          style={{
            position: 'absolute',
            top: 'clamp(100px, 14vh, 140px)',
            left: 'clamp(24px, 4vw, 60px)',
            fontSize: '12px',
            letterSpacing: '0.16em',
            padding: '12px 24px',
            border: '1px solid #ffffff',
            backgroundColor: 'rgba(0,0,0,0.35)',
            color: '#ffffff',
            cursor: 'pointer',
            textTransform: 'uppercase',
            fontFamily: '"Helvetica Neue", sans-serif',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
          }}
        >
          ← Back
        </button>
        <div
          style={{
            position: 'absolute',
            bottom: 'clamp(32px, 5vw, 60px)',
            left: 'clamp(24px, 4vw, 60px)',
            right: 'clamp(24px, 4vw, 60px)',
            color: '#ffffff',
          }}
        >
          <p
            style={{
              fontSize: '12px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#ef4444',
              fontWeight: 700,
              marginBottom: '12px',
            }}
          >
            GRIPX {room.id} · {room.client}
          </p>
          <h1
            style={{
              fontSize: 'clamp(36px, 6vw, 80px)',
              fontWeight: 900,
              fontStyle: 'italic',
              letterSpacing: '-0.03em',
              lineHeight: 1.02,
              margin: 0,
              maxWidth: '900px',
              textTransform: 'uppercase',
            }}
          >
            {room.title}
          </h1>
        </div>
      </div>

      {/* Body */}
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '80px clamp(24px, 4vw, 60px) 120px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
          gap: 'clamp(40px, 5vw, 80px)',
          alignItems: 'flex-start',
        }}
      >
        {/* Left: description + features */}
        <div style={{ flex: '2 1 600px', minWidth: 0 }}>
          <p
            style={{
              fontSize: 'clamp(20px, 2.2vw, 30px)',
              fontWeight: 700,
              fontStyle: 'italic',
              lineHeight: 1.4,
              letterSpacing: '-0.015em',
              color: '#0b0b0b',
              marginBottom: '48px',
              maxWidth: '680px',
            }}
          >
            {room.tagline}
          </p>

          {room.description.map((p, i) => (
            <p
              key={i}
              style={{
                fontSize: '16px',
                lineHeight: 1.8,
                color: '#333333',
                marginBottom: '24px',
                maxWidth: '680px',
              }}
            >
              {p}
            </p>
          ))}

          <div
            style={{
              marginTop: '64px',
              paddingTop: '32px',
              borderTop: '1px solid #1a1a1a',
            }}
          >
            <p
              style={{
                fontSize: '11px',
                letterSpacing: '0.22em',
                color: '#dc2626',
                fontWeight: 700,
                textTransform: 'uppercase',
                marginBottom: '28px',
              }}
            >
              Battle Specs
            </p>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
                gap: '14px 40px',
              }}
            >
              {room.features.map((f) => (
                <li
                  key={f}
                  style={{
                    fontSize: '15px',
                    lineHeight: 1.6,
                    color: '#333333',
                    paddingLeft: '20px',
                    position: 'relative',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: '12px',
                      width: '8px',
                      height: '2px',
                      backgroundColor: '#dc2626',
                    }}
                  />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: order panel */}
        <aside
          style={{
            flex: '1 1 320px',
            minWidth: 0,
            position: 'sticky',
            top: '112px',
            border: '2px solid #0b0b0b',
            padding: '32px 28px',
            backgroundColor: '#ffffff',
          }}
        >
          <p
            style={{
              fontSize: '11px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#666666',
              marginBottom: '12px',
            }}
          >
            Cash on Delivery
          </p>
          <p
            style={{
              fontSize: 'clamp(36px, 4vw, 52px)',
              fontWeight: 900,
              fontStyle: 'italic',
              letterSpacing: '-0.03em',
              lineHeight: 1,
              color: '#dc2626',
              marginBottom: '6px',
            }}
          >
            {room.price}
          </p>
          <p
            style={{
              fontSize: '13px',
              color: '#666666',
              lineHeight: 1.5,
              marginBottom: '28px',
            }}
          >
            {room.priceNote}
          </p>

          <dl
            style={{
              borderTop: '1px solid #e5e5e5',
              borderBottom: '1px solid #e5e5e5',
              padding: '16px 0',
              margin: '0 0 28px',
              display: 'grid',
              gap: '10px',
            }}
          >
            <Row k="Length" v={room.sqm} />
            <Row k="Size" v={room.occupancy} />
            <Row k="Material" v={room.bed} />
          </dl>

          <button
            onClick={onOrder}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              width: '100%',
              fontSize: '14px',
              fontWeight: 800,
              letterSpacing: '0.14em',
              color: '#ffffff',
              backgroundColor: hovered ? '#b91c1c' : '#dc2626',
              border: 'none',
              padding: '18px 24px',
              cursor: 'pointer',
              textTransform: 'uppercase',
              transition: 'all 0.25s ease',
              fontFamily: '"Helvetica Neue", sans-serif',
              transform: 'skewX(-8deg)',
              boxShadow: hovered
                ? '0 0 36px rgba(220,38,38,0.5)'
                : '0 0 16px rgba(220,38,38,0.3)',
            }}
          >
            Order — {room.price} COD
          </button>
          <p
            style={{
              fontSize: '12px',
              lineHeight: 1.6,
              color: '#666666',
              marginTop: '16px',
              textAlign: 'center',
            }}
          >
            No card needed. We call to confirm, you pay the courier in cash.
          </p>
          <button
            onClick={onBack}
            style={{
              width: '100%',
              marginTop: '10px',
              fontSize: '12px',
              letterSpacing: '0.14em',
              color: '#666666',
              backgroundColor: 'transparent',
              border: 'none',
              padding: '10px',
              cursor: 'pointer',
              textTransform: 'uppercase',
              fontFamily: '"Helvetica Neue", sans-serif',
            }}
          >
            ← Back to arsenal
          </button>
        </aside>
      </div>
    </div>
  )
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '13px',
        color: '#333333',
      }}
    >
      <dt style={{ color: '#666666' }}>{k}</dt>
      <dd style={{ margin: 0, fontWeight: 500, color: '#0b0b0b' }}>{v}</dd>
    </div>
  )
}
