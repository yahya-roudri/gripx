export interface Room {
  id: string
  title: string
  client: string
  img: string
  images: string[]
  tagline: string
  description: string[]
  features: string[]
  price: string
  priceNote: string
  sqm: string
  occupancy: string
  bed: string
}

const product: Room = {
  id: '01',
  title: 'Apex One',
  client: 'Black / Red Series',
  img: '/images/gripx-straps.png',
  images: ['/images/gripx-straps.png'],
  tagline: 'The original war-strap. Black on black. Zero mercy.',
  description: [
    'The Apex One is where it all starts: a heavy-duty cotton lifting strap built for lifters who are done letting their grip decide the set. Industrial weave, bar-tacked stitching, and a neoprene wrist pad that eats pressure for breakfast.',
    'Wrap it, crank it, and pull. Deadlifts, rows, shrugs, RDLs — the Apex One keeps your hands married to the bar until your back gives out first. Which it won’t, because you’ll keep coming back.',
  ],
  features: [
    'Industrial-grade cotton weave, 4cm wide',
    'Neoprene-padded wrist zone, zero bite',
    'Bar-tack reinforced stitching',
    '60cm strap length — fits every bar',
    'One size, ambidextrous pair',
    'Chalk-friendly, sweat-proof finish',
  ],
  price: '140 MAD',
  priceNote: 'cash on delivery, all Morocco',
  sqm: '60cm length',
  occupancy: 'One size',
  bed: 'Cotton + neoprene',
}

// Single product. Kept as an array so the grid/canvas rendering code
// (which loops over a list) still works unchanged.
export const rooms: Room[] = [product]
