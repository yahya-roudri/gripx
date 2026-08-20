import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { trpc } from '@/providers/trpc'
import { rooms } from '../data/rooms'

const PRICE_MAD = 140

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`

const fragmentShader = `
precision highp float;
uniform vec2 resolution;
uniform float time;

void main() {
  vec2 coord = gl_FragCoord.xy / resolution;
  vec2 st = coord;
  coord *= 10.0;

  float len;
  for (int i = 0; i < 5; i++) {
    len = length(vec2(coord.x, coord.y));
    coord.x += cos(coord.y + sin(len)) + cos(time * 0.07) * 0.2;
    coord.y += sin(coord.x + cos(len)) + sin(time * 0.1);
  }

  len *= cos(len * 0.4);
  len -= 10.0;

  for (float i = 0.0; i < 5.0; i++) {
    len += 1.0 / abs(mod(st.x, 0.09 * i) * 200.0) * 1.0;
  }

  float r = cos(len + 0.2) * 0.5 + 0.62;
  float g = cos(len + 0.1) * 0.12 + 0.10;
  float b = cos(len - 0.05) * 0.13 + 0.12;

  vec3 color = vec3(r, g, b);
  color = smoothstep(0.05, 0.85, color);
  color *= 0.75;

  gl_FragColor = vec4(color, 1.0);
}
`

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canvasHostRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const uniformsRef = useRef<{ resolution: THREE.Uniform; time: THREE.Uniform }>({
    resolution: new THREE.Uniform(new THREE.Vector2(1, 1)),
    time: new THREE.Uniform(0),
  })

  const [submitHovered, setSubmitHovered] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [orderId, setOrderId] = useState<number | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    product: rooms[0].title,
    quantity: '1',
    name: '',
    phone: '',
    city: '',
    address: '',
    note: '',
  })

  const createOrder = trpc.order.create.useMutation({
    onSuccess: (data) => {
      setOrderId(data.id)
      setSubmitted(true)
      setSubmitError(null)
    },
    onError: (err) => {
      setSubmitError(err.message || 'Something went wrong. Please try again.')
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const host = canvasHostRef.current
    if (!canvas || !host) return

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    rendererRef.current = renderer

    const scene = new THREE.Scene()
    const camera = new THREE.Camera()

    const geometry = new THREE.PlaneGeometry(2, 2)
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        resolution: uniformsRef.current.resolution,
        time: uniformsRef.current.time,
      },
      depthTest: false,
      depthWrite: false,
    })
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const handleResize = () => {
      const rect = host.getBoundingClientRect()
      const w = rect.width
      const h = rect.height
      renderer.setSize(w, h, false)
      uniformsRef.current.resolution.value.set(w, h)
    }
    handleResize()

    const ro = new ResizeObserver(handleResize)
    ro.observe(host)

    let rafId: number
    const startTime = performance.now()
    const animate = () => {
      uniformsRef.current.time.value = (performance.now() - startTime) / 1000
      renderer.render(scene, camera)
      rafId = requestAnimationFrame(animate)
    }
    rafId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(rafId)
      ro.disconnect()
      renderer.dispose()
      geometry.dispose()
      material.dispose()
    }
  }, [])

  const quantity = Math.max(1, parseInt(formData.quantity, 10) || 1)
  const total = quantity * PRICE_MAD

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)

    if (!formData.name || !formData.phone || !formData.city || !formData.address) {
      setSubmitError('Please fill in your name, phone, city and address.')
      return
    }
    if (!/^(\+212|0)[5-7]\d{8}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
      setSubmitError('Please enter a valid Moroccan phone number (e.g. 0612345678).')
      return
    }

    createOrder.mutate({
      productTitle: formData.product,
      quantity,
      totalMAD: total,
      fullName: formData.name,
      phone: formData.phone,
      city: formData.city,
      address: formData.address,
      note: formData.note || undefined,
    })
  }

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '700px',
        backgroundColor: '#0b0b0b',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 480px), 1fr))',
      }}
    >
      {/* Left: shader */}
      <div
        ref={canvasHostRef}
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '420px',
          overflow: 'hidden',
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            display: 'block',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 'clamp(24px, 4vw, 48px)',
            left: 'clamp(24px, 4vw, 48px)',
            right: 'clamp(24px, 4vw, 48px)',
            zIndex: 2,
            pointerEvents: 'none',
          }}
        >
          <h2
            style={{
              fontSize: 'clamp(36px, 4.5vw, 64px)',
              fontWeight: 900,
              fontStyle: 'italic',
              letterSpacing: '-0.03em',
              lineHeight: 1.02,
              color: '#ffffff',
              marginBottom: '16px',
              textShadow: '0 2px 24px rgba(0,0,0,0.4)',
              maxWidth: '560px',
              textTransform: 'uppercase',
            }}
          >
            Lock in
            <br />
            your pair
          </h2>
          <p
            style={{
              fontSize: '13px',
              letterSpacing: '0.18em',
              color: 'rgba(255,255,255,0.9)',
              textTransform: 'uppercase',
            }}
          >
            GRIPX · 140 MAD · Cash on Delivery
          </p>
        </div>
      </div>

      {/* Right: order form */}
      <div
        style={{
          backgroundColor: '#0b0b0b',
          color: '#ffffff',
          padding: 'clamp(40px, 5vw, 72px) clamp(24px, 4vw, 60px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <div style={{ maxWidth: '520px', width: '100%', marginLeft: 'auto', marginRight: 'auto' }}>
          <p
            style={{
              fontSize: '11px',
              letterSpacing: '0.24em',
              color: '#ef4444',
              textTransform: 'uppercase',
              marginBottom: '14px',
              fontWeight: 700,
            }}
          >
            Cash on Delivery · Morocco
          </p>
          <h3
            style={{
              fontSize: 'clamp(28px, 3.2vw, 40px)',
              fontWeight: 900,
              fontStyle: 'italic',
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
              marginBottom: '12px',
              textTransform: 'uppercase',
            }}
          >
            Order now. Pay at your door.
          </h3>
          <p
            style={{
              fontSize: '14px',
              lineHeight: 1.6,
              color: 'rgba(255,255,255,0.65)',
              marginBottom: '32px',
            }}
          >
            No card, no prepayment. Fill the form, we call to confirm, and you
            pay the courier in cash when your straps arrive.
          </p>

          {submitted ? (
            <div
              style={{
                border: '1px solid rgba(220,38,38,0.6)',
                padding: '32px 28px',
                fontSize: '15px',
                lineHeight: 1.7,
                color: 'rgba(255,255,255,0.88)',
              }}
            >
              <span
                style={{
                  display: 'block',
                  fontSize: '12px',
                  letterSpacing: '0.2em',
                  color: '#ef4444',
                  textTransform: 'uppercase',
                  marginBottom: '12px',
                  fontWeight: 700,
                }}
              >
                Order #{orderId} confirmed
              </span>
              Your GRIPX order is locked in. We’ll call {formData.phone} within
              24 hours to confirm delivery to {formData.city}. You pay{' '}
              <strong style={{ color: '#ef4444' }}>{total} MAD</strong> in cash
              when it arrives. Time to go warm up.
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
              }}
            >
              {submitError && (
                <div
                  style={{
                    border: '1px solid rgba(255,100,100,0.5)',
                    padding: '14px 18px',
                    fontSize: '13px',
                    lineHeight: 1.5,
                    color: 'rgba(255,150,150,0.9)',
                    marginBottom: '4px',
                  }}
                >
                  {submitError}
                </div>
              )}
              <Row>
                <div style={{ display: 'block' }}>
                  <span style={labelBase}>Strap</span>
                  <p style={{ ...fieldBase, margin: 0 }}>{rooms[0].title}</p>
                </div>
                <Field
                  label="Quantity"
                  type="number"
                  name="quantity"
                  placeholder="1"
                  min={1}
                  value={formData.quantity}
                  onChange={handleChange}
                />
              </Row>
              <Field label="Full name" type="text" name="name" placeholder="Yassine El Amrani" value={formData.name} onChange={handleChange} />
              <Row>
                <Field label="Phone" type="tel" name="phone" placeholder="0612345678" value={formData.phone} onChange={handleChange} />
                <Field label="City" type="text" name="city" placeholder="Casablanca" value={formData.city} onChange={handleChange} />
              </Row>
              <Field label="Delivery address" type="text" name="address" placeholder="Street, building, apartment…" value={formData.address} onChange={handleChange} />
              <TextareaField
                label="Note (optional)"
                name="note"
                placeholder="Delivery instructions, preferred call time…"
                value={formData.note}
                onChange={handleChange}
              />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px solid rgba(255,255,255,0.15)',
                  paddingTop: '16px',
                  marginTop: '4px',
                }}
              >
                <span style={{ fontSize: '12px', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>
                  Total · COD
                </span>
                <span style={{ fontSize: '26px', fontWeight: 900, fontStyle: 'italic', color: '#ef4444' }}>
                  {total} MAD
                </span>
              </div>
              <button
                type="submit"
                disabled={createOrder.isPending}
                onMouseEnter={() => setSubmitHovered(true)}
                onMouseLeave={() => setSubmitHovered(false)}
                style={{
                  marginTop: '8px',
                  padding: '18px 24px',
                  fontSize: '14px',
                  fontWeight: 800,
                  letterSpacing: '0.14em',
                  color: '#ffffff',
                  backgroundColor: submitHovered ? '#b91c1c' : '#dc2626',
                  border: 'none',
                  cursor: createOrder.isPending ? 'wait' : 'pointer',
                  textTransform: 'uppercase',
                  transition: 'all 0.25s ease',
                  fontFamily: '"Helvetica Neue", sans-serif',
                  opacity: createOrder.isPending ? 0.6 : 1,
                  transform: 'skewX(-8deg)',
                  boxShadow: submitHovered
                    ? '0 0 40px rgba(220,38,38,0.55)'
                    : '0 0 20px rgba(220,38,38,0.3)',
                }}
              >
                {createOrder.isPending ? 'Locking in...' : `Place Order — ${total} MAD COD`}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

function Row({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
      }}
    >
      {children}
    </div>
  )
}

const fieldBase: React.CSSProperties = {
  width: '100%',
  padding: '12px 0',
  fontSize: '15px',
  backgroundColor: 'transparent',
  color: '#ffffff',
  border: 'none',
  borderBottom: '1px solid rgba(255,255,255,0.35)',
  outline: 'none',
  fontFamily: 'inherit',
  letterSpacing: '0.01em',
  appearance: 'none',
  colorScheme: 'dark',
}

const labelBase: React.CSSProperties = {
  fontSize: '11px',
  letterSpacing: '0.2em',
  color: '#ffffff',
  fontWeight: 600,
  textTransform: 'uppercase',
  marginBottom: '4px',
  display: 'block',
}

function Field({
  label,
  type,
  name,
  placeholder,
  min,
  value,
  onChange,
}: {
  label: string
  type: string
  name: string
  placeholder?: string
  min?: number
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <label style={{ display: 'block' }}>
      <span style={labelBase}>{label}</span>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        min={min}
        value={value}
        onChange={onChange}
        style={fieldBase}
        onFocus={(e) => (e.currentTarget.style.borderBottomColor = '#ef4444')}
        onBlur={(e) => (e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.35)')}
      />
    </label>
  )
}

function TextareaField({
  label,
  name,
  placeholder,
  value,
  onChange,
}: {
  label: string
  name: string
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}) {
  return (
    <label style={{ display: 'block' }}>
      <span style={labelBase}>{label}</span>
      <textarea
        name={name}
        placeholder={placeholder}
        rows={3}
        value={value}
        onChange={onChange}
        style={{ ...fieldBase, resize: 'vertical', paddingTop: '12px' }}
        onFocus={(e) => (e.currentTarget.style.borderBottomColor = '#ef4444')}
        onBlur={(e) => (e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.35)')}
      />
    </label>
  )
}
