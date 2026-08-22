/**
 * BACKUP FILE: Mock Products Content & Design Data
 * Preserved as backup for future reference or offline staging.
 */

export const MOCK_PRODUCTS_BACKUP = [
  {
    _id: 'prod_car_kit',
    routeId: 'car',
    title: 'Car Safety QR Protection Kit (2 Stickers)',
    description: 'Pack of 2 high-grade reflective stickers with masked calling and 24/7 instant emergency alerts.',
    imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80',
    tagType: '4-Wheeler / Car',
    deliveryInfo: '2 Reflective Stickers',
    price: 399,
    originalPrice: 499,
    discount: 100,
    initialCalls: 10,
    initialMessages: 20,
    validityDays: 365,
    renewalAmount: 199,
    badge: 'MOST POPULAR',
    features: [
      '2x Premium Reflective UV Stickers',
      '10 Voice Calls & 20 WhatsApp Alerts',
      'Number Masking Privacy Bridge',
      'Live GPS Emergency SOS Dispatch'
    ]
  },
  {
    _id: 'prod_bike_kit',
    routeId: 'bike',
    title: 'Bike Safety QR Protection Kit',
    description: 'Compact weather & scratch-proof helmet/visor tag for motorcycles & scooters with emergency alerts.',
    imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80',
    tagType: '2-Wheeler / Bike',
    deliveryInfo: '1 Waterproof Sticker',
    price: 299,
    originalPrice: 399,
    discount: 100,
    initialCalls: 10,
    initialMessages: 20,
    validityDays: 365,
    renewalAmount: 199,
    badge: null,
    features: [
      '1x Ultra-Adhesive Bike Tag',
      '10 Voice Calls & 20 WhatsApp Alerts',
      'Accident SOS Broadcast to Family',
      '1 Year Full Cloud Protection'
    ]
  },
  {
    _id: 'prod_luggage_kit',
    routeId: 'luggage',
    title: 'Smart Luggage & Bag Safety Kit',
    description: 'Heavy-duty metallic QR bag badges with braided steel loop cables for flight suitcases and laptop bags.',
    imageUrl: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&w=800&q=80',
    tagType: 'Travel Luggage & Bags',
    deliveryInfo: '2 Metallic Badges',
    price: 249,
    originalPrice: 349,
    discount: 100,
    initialCalls: 10,
    initialMessages: 20,
    validityDays: 365,
    renewalAmount: 199,
    badge: '✈️ TRAVEL ESSENTIAL',
    features: [
      '2x Metallic Badges + Steel Loop Cables',
      'Instant Lost Bag GPS Location Alert',
      'Masked Caller ID (No Personal Phone Leak)',
      'Airport, Train & Taxi Bag Recovery'
    ]
  }
];

export default MOCK_PRODUCTS_BACKUP;
