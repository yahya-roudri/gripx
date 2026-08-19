export default function Footer() {
  return (
    <footer
      id="footer"
      style={{
        backgroundColor: '#0b0b0b',
        borderTop: '2px solid #dc2626',
        padding: '80px clamp(20px, 4vw, 60px) 0',
        minHeight: '600px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden',
      }}
    >
      {/* Top: Office Info */}
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '40px',
          paddingBottom: '80px',
        }}
      >
        <OfficeColumn
          city="Casablanca"
          cityEn="HEADQUARTERS"
          address="Warehouse & dispatch — delivery 24h"
          coords="33.5731° N, 7.5898° W"
          timezone="GMT+1"
        />
        <OfficeColumn
          city="Rabat"
          cityEn="DELIVERY ZONE"
          address="Same-week dispatch — delivery 24–48h"
          coords="34.0209° N, 6.8416° W"
          timezone="GMT+1"
        />
        <OfficeColumn
          city="Marrakech"
          cityEn="DELIVERY ZONE"
          address="Same-week dispatch — delivery 48–72h"
          coords="31.6295° N, 7.9811° W"
          timezone="GMT+1"
        />
        <div>
          <p
            style={{
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.18em',
              color: '#dc2626',
              marginBottom: '20px',
            }}
          >
            CONTACT
          </p>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.65)', lineHeight: 2 }}>
            order@gripx.ma
            <br />
            WhatsApp: +212 6 61 23 45 67
            <br />
            Instagram: @gripx.ma
          </p>
        </div>
      </div>

      {/* Bottom: Giant Wordmark */}
      <div
        style={{
          width: '100%',
          overflow: 'hidden',
          lineHeight: 0.85,
          paddingBottom: '0',
        }}
      >
        <span
          style={{
            display: 'block',
            fontSize: 'clamp(80px, 18vw, 320px)',
            fontWeight: 900,
            fontStyle: 'italic',
            letterSpacing: '-0.04em',
            color: '#dc2626',
            whiteSpace: 'nowrap',
            transform: 'translateY(15%)',
            userSelect: 'none',
            textTransform: 'uppercase',
          }}
        >
          GRIPX
        </span>
      </div>
    </footer>
  )
}

function OfficeColumn({
  city,
  cityEn,
  address,
  coords,
  timezone,
}: {
  city: string
  cityEn: string
  address: string
  coords: string
  timezone: string
}) {
  return (
    <div>
      <p
        style={{
          fontSize: '12px',
          fontWeight: 700,
          letterSpacing: '0.18em',
          color: '#dc2626',
          marginBottom: '20px',
        }}
      >
        {cityEn}
      </p>
      <p style={{ fontSize: '16px', fontWeight: 600, color: '#ffffff', marginBottom: '8px' }}>
        {city}
      </p>
      <p
        style={{
          fontSize: '14px',
          color: 'rgba(255,255,255,0.6)',
          lineHeight: 1.6,
          marginBottom: '12px',
          maxWidth: '260px',
        }}
      >
        {address}
      </p>
      <p
        style={{
          fontSize: '11px',
          letterSpacing: '0.05em',
          color: 'rgba(255,255,255,0.45)',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {coords}
        <br />
        {timezone}
      </p>
    </div>
  )
}
