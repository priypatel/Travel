import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Destination from './models/Destination.model.js';
import Place from './models/Place.model.js';
import Restaurant from './models/Restaurant.model.js';
import PropertyStay from './models/PropertyStay.model.js';

dotenv.config();

// ─── Destination data ────────────────────────────────────────────────────────

const destinations = [
  {
    name: 'Bali',
    country: 'Indonesia',
    description: 'A tropical paradise of ancient temples, lush rice terraces, and vibrant arts culture nestled between volcanic mountains and the Indian Ocean.',
    bestTime: 'April to October',
    heroImage: 'https://images.unsplash.com/photo-1537996194705-2275785c4fe3?auto=format&fit=crop&w=800&q=80',
    tags: ['Beach', 'Culture', 'Nature', 'Spiritual'],
    coordinates: { lat: -8.4095, lng: 115.1889 },
  },
  {
    name: 'Paris',
    country: 'France',
    description: 'The City of Light enchants visitors with iconic landmarks, world-class cuisine, haute couture, and an unmatched romantic atmosphere along the Seine.',
    bestTime: 'June to August',
    heroImage: 'https://images.unsplash.com/photo-1502602346694-d35da1e1d9dd?auto=format&fit=crop&w=800&q=80',
    tags: ['City', 'Culture', 'Food', 'Romantic'],
    coordinates: { lat: 48.8566, lng: 2.3522 },
  },
  {
    name: 'Kyoto',
    country: 'Japan',
    description: 'Japan\'s ancient capital preserves over a thousand temples, geisha districts, bamboo groves, and some of the world\'s most breathtaking cherry blossom scenery.',
    bestTime: 'March to May, October to November',
    heroImage: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=800&q=80',
    tags: ['Culture', 'Spiritual', 'Nature', 'History'],
    coordinates: { lat: 35.0116, lng: 135.7681 },
  },
  {
    name: 'New York',
    country: 'USA',
    description: 'The city that never sleeps buzzes with energy across five boroughs — from Times Square\'s neon lights to Central Park\'s green expanse and world-famous museums.',
    bestTime: 'September to November',
    heroImage: 'https://images.unsplash.com/photo-1546436836-07a91091f160?auto=format&fit=crop&w=800&q=80',
    tags: ['City', 'Food', 'Culture', 'Adventure'],
    coordinates: { lat: 40.7128, lng: -74.006 },
  },
  {
    name: 'Santorini',
    country: 'Greece',
    description: 'Famous for its dramatic caldera views, iconic blue-domed churches, and volcanic beaches, Santorini is Greece\'s most romanticised island in the Aegean Sea.',
    bestTime: 'June to September',
    heroImage: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80',
    tags: ['Beach', 'Romantic', 'Luxury', 'Culture'],
    coordinates: { lat: 36.3932, lng: 25.4615 },
  },
  {
    name: 'Cape Town',
    country: 'South Africa',
    description: 'Nestled beneath Table Mountain, Cape Town blends stunning natural landscapes with vibrant neighbourhoods, world-class wine estates, and rich multicultural heritage.',
    bestTime: 'October to April',
    heroImage: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=800&q=80',
    tags: ['Nature', 'Adventure', 'City', 'Beach'],
    coordinates: { lat: -33.9249, lng: 18.4241 },
  },
  {
    name: 'Machu Picchu',
    country: 'Peru',
    description: 'Perched high in the Andes, the ancient Inca citadel of Machu Picchu is one of the world\'s most awe-inspiring archaeological sites, shrouded in mist and mystery.',
    bestTime: 'May to September',
    heroImage: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=800&q=80',
    tags: ['History', 'Adventure', 'Nature', 'Culture'],
    coordinates: { lat: -13.1631, lng: -72.545 },
  },
  {
    name: 'Dubai',
    country: 'UAE',
    description: 'A futuristic desert metropolis where record-breaking skyscrapers, luxury shopping malls, and man-made islands coexist with traditional souks and desert safari adventures.',
    bestTime: 'November to March',
    heroImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    tags: ['Luxury', 'City', 'Adventure', 'Shopping'],
    coordinates: { lat: 25.2048, lng: 55.2708 },
  },
  {
    name: 'Bangkok',
    country: 'Thailand',
    description: 'Thailand\'s capital is a sensory feast of gilded temples, bustling floating markets, street food stalls, and rooftop bars that pulse with energy day and night.',
    bestTime: 'November to February',
    heroImage: 'https://images.unsplash.com/photo-1563492065599-3520f775eeed?auto=format&fit=crop&w=800&q=80',
    tags: ['Culture', 'Food', 'Spiritual', 'City'],
    coordinates: { lat: 13.7563, lng: 100.5018 },
  },
  {
    name: 'Rome',
    country: 'Italy',
    description: 'The Eternal City layers 3,000 years of history — from the Colosseum and Vatican to cobblestone piazzas, baroque fountains, and some of Italy\'s finest food.',
    bestTime: 'April to June',
    heroImage: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80',
    tags: ['History', 'Culture', 'Food', 'Romantic'],
    coordinates: { lat: 41.9028, lng: 12.4964 },
  },
  {
    name: 'Amsterdam',
    country: 'Netherlands',
    description: 'A city of canals, cycling culture, and world-class art museums, Amsterdam charms visitors with its 17th-century architecture, vibrant nightlife, and liberal spirit.',
    bestTime: 'April to August',
    heroImage: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&w=800&q=80',
    tags: ['City', 'Culture', 'Art', 'Nature'],
    coordinates: { lat: 52.3676, lng: 4.9041 },
  },
  {
    name: 'Sydney',
    country: 'Australia',
    description: 'Australia\'s harbour city shines with its iconic Opera House, Bondi Beach surf culture, diverse food scene, and easy access to Blue Mountains national parks.',
    bestTime: 'September to November',
    heroImage: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80',
    tags: ['Beach', 'City', 'Nature', 'Adventure'],
    coordinates: { lat: -33.8688, lng: 151.2093 },
  },
  {
    name: 'Istanbul',
    country: 'Turkey',
    description: 'Straddling Europe and Asia across the Bosphorus, Istanbul is a city where Byzantine churches became Ottoman mosques, and ancient bazaars meet modern galleries.',
    bestTime: 'March to May',
    heroImage: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=800&q=80',
    tags: ['History', 'Culture', 'Food', 'Spiritual'],
    coordinates: { lat: 41.0082, lng: 28.9784 },
  },
  {
    name: 'Barcelona',
    country: 'Spain',
    description: 'Gaudí\'s fantastical architecture, golden Mediterranean beaches, world-renowned cuisine, and a passionate cultural identity make Barcelona one of Europe\'s most exciting cities.',
    bestTime: 'May to June',
    heroImage: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=800&q=80',
    tags: ['City', 'Beach', 'Culture', 'Food'],
    coordinates: { lat: 41.3851, lng: 2.1734 },
  },
  {
    name: 'Maldives',
    country: 'Maldives',
    description: 'A necklace of 1,200 coral islands in the Indian Ocean offering overwater bungalows, pristine turquoise lagoons, and some of the planet\'s best snorkelling and diving.',
    bestTime: 'November to April',
    heroImage: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80',
    tags: ['Beach', 'Luxury', 'Romantic', 'Diving'],
    coordinates: { lat: 3.2028, lng: 73.2207 },
  },
  {
    name: 'Prague',
    country: 'Czech Republic',
    description: 'The City of a Hundred Spires enchants with its fairy-tale Gothic and Baroque architecture, medieval Old Town Square, and vibrant café and beer culture.',
    bestTime: 'May to September',
    heroImage: 'https://images.unsplash.com/photo-1513805959324-96eb66ca8713?auto=format&fit=crop&w=800&q=80',
    tags: ['History', 'Culture', 'City', 'Budget'],
    coordinates: { lat: 50.0755, lng: 14.4378 },
  },
  {
    name: 'Queenstown',
    country: 'New Zealand',
    description: 'Nestled on the shores of Lake Wakatipu and surrounded by the Remarkables mountain range, Queenstown is the adventure capital of the world.',
    bestTime: 'December to February',
    heroImage: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=800&q=80',
    tags: ['Adventure', 'Nature', 'Mountain', 'Outdoor'],
    coordinates: { lat: -45.0312, lng: 168.6626 },
  },
  {
    name: 'Marrakech',
    country: 'Morocco',
    description: 'A labyrinth of souks, riads, and spice markets, Marrakech captivates with its vibrant Djemaa el-Fna square, intricate Moorish architecture, and Saharan gateway.',
    bestTime: 'March to May',
    heroImage: 'https://images.unsplash.com/photo-1553953861-e5d79891d7a0?auto=format&fit=crop&w=800&q=80',
    tags: ['Culture', 'History', 'Food', 'Adventure'],
    coordinates: { lat: 31.6295, lng: -7.9811 },
  },
  {
    name: 'Reykjavik',
    country: 'Iceland',
    description: 'The world\'s northernmost capital is the gateway to Iceland\'s volcanic landscapes, geothermal hot springs, and the magical Northern Lights dancing overhead.',
    bestTime: 'June to August',
    heroImage: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=800&q=80',
    tags: ['Nature', 'Adventure', 'Unique', 'Outdoor'],
    coordinates: { lat: 64.1265, lng: -21.8174 },
  },
  {
    name: 'Singapore',
    country: 'Singapore',
    description: 'A dazzling city-state where futuristic gardens, gleaming skyscrapers, multicultural neighbourhoods, and a legendary food culture create an unforgettable urban experience.',
    bestTime: 'February to April',
    heroImage: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80',
    tags: ['City', 'Food', 'Luxury', 'Culture'],
    coordinates: { lat: 1.3521, lng: 103.8198 },
  },
  {
    name: 'Lisbon',
    country: 'Portugal',
    description: 'Built on seven hills above the Tagus river, Lisbon charms with its faded azulejo tiles, vintage yellow trams, melancholy Fado music, and Atlantic seafood.',
    bestTime: 'March to May',
    heroImage: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=800&q=80',
    tags: ['City', 'Culture', 'Food', 'History'],
    coordinates: { lat: 38.7223, lng: -9.1393 },
  },
  {
    name: 'Copenhagen',
    country: 'Denmark',
    description: 'Consistently rated one of the world\'s happiest cities, Copenhagen blends colourful Nyhavn waterfront, Michelin-star dining, cutting-edge design, and a strong cycling culture.',
    bestTime: 'June to August',
    heroImage: 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?auto=format&fit=crop&w=800&q=80',
    tags: ['City', 'Culture', 'Food', 'Design'],
    coordinates: { lat: 55.6761, lng: 12.5683 },
  },
  // ─── India ───────────────────────────────────────────────────────────────────
  {
    name: 'Mumbai',
    country: 'India',
    description: 'Bollywood capital with vibrant street food, colonial architecture, and bustling markets. India\'s financial heart pulses with energy from Marine Drive to the Dharavi lanes.',
    bestTime: 'October to March',
    heroImage: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
    tags: ['City', 'Food', 'Culture', 'History'],
    coordinates: { lat: 19.076, lng: 72.8777 },
  },
  {
    name: 'Jaipur',
    country: 'India',
    description: 'The Pink City of Rajasthan enchants with its rose-hued palaces, grand forts, vibrant bazaars, and rich cultural heritage rooted in centuries of royal Rajput history.',
    bestTime: 'October to March',
    heroImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    tags: ['History', 'Culture', 'Architecture', 'Shopping'],
    coordinates: { lat: 26.9124, lng: 75.7873 },
  },
  {
    name: 'Goa',
    country: 'India',
    description: 'India\'s beach paradise blends Portuguese colonial charm with golden sands, fresh seafood, and a laid-back vibe that draws travellers from around the globe.',
    bestTime: 'November to February',
    heroImage: 'https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?auto=format&fit=crop&w=800&q=80',
    tags: ['Beach', 'Nightlife', 'Food', 'Culture'],
    coordinates: { lat: 15.2993, lng: 74.124 },
  },
  {
    name: 'Ladakh',
    country: 'India',
    description: 'High-altitude desert with stunning landscapes, Buddhist monasteries, and adventurous mountain passes. Ladakh offers an otherworldly experience between the Himalayas and Karakoram.',
    bestTime: 'May to September',
    heroImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
    tags: ['Adventure', 'Mountain', 'Spiritual', 'Nature'],
    coordinates: { lat: 34.1526, lng: 77.5771 },
  },
  {
    name: 'Shimla',
    country: 'India',
    description: 'Queen of hill stations with colonial architecture, scenic Himalayan views, and pleasant summer weather. Shimla was the former summer capital of British India.',
    bestTime: 'March to June, October to November',
    heroImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
    tags: ['Hill Station', 'Nature', 'Culture', 'Adventure'],
    coordinates: { lat: 31.1048, lng: 77.1734 },
  },
  {
    name: 'Pondicherry',
    country: 'India',
    description: 'French colonial charm meets Tamil spirituality in this coastal town. Pondicherry\'s pastel-hued streets, ashrams, and pristine beaches create a uniquely peaceful escape.',
    bestTime: 'October to March',
    heroImage: 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&w=800&q=80',
    tags: ['Beach', 'Spiritual', 'Culture', 'Food'],
    coordinates: { lat: 11.9416, lng: 79.8083 },
  },
  {
    name: 'Kerala',
    country: 'India',
    description: 'God\'s Own Country offers serene backwaters, lush spice plantations, Ayurvedic wellness retreats, and pristine beaches along a 580km coastline of unmatched natural beauty.',
    bestTime: 'September to March',
    heroImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
    tags: ['Nature', 'Spiritual', 'Beach', 'Wellness'],
    coordinates: { lat: 10.8505, lng: 76.2711 },
  },
];

// ─── Sub-entity factory ───────────────────────────────────────────────────────

const subEntities = {
  Bali: {
    places: [
      { name: 'Tanah Lot Temple', description: 'A sea temple perched dramatically on a rocky outcrop, offering breathtaking sunset views.', category: 'Temple', image: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=600&q=80' },
      { name: 'Tegallalang Rice Terraces', description: 'Iconic stepped rice paddies north of Ubud showcasing traditional Balinese subak irrigation.', category: 'Nature', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80' },
      { name: 'Sacred Monkey Forest Ubud', description: 'A lush nature reserve home to hundreds of long-tailed macaques and ancient Hindu temples.', category: 'Nature', image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?auto=format&fit=crop&w=600&q=80' },
      { name: 'Uluwatu Temple', description: 'A clifftop temple 70m above the Indian Ocean, famous for its Kecak fire dance performances.', category: 'Temple', image: 'https://images.unsplash.com/photo-1537944434965-cf4679d1a598?auto=format&fit=crop&w=600&q=80' },
      { name: 'Seminyak Beach', description: 'Bali\'s trendiest beach strip lined with beach clubs, surf breaks, and spectacular sunsets.', category: 'Beach', image: 'https://images.unsplash.com/photo-1505855265981-d52719d1f64e?auto=format&fit=crop&w=600&q=80' },
    ],
    restaurants: [
      { name: 'Locavore', cuisine: 'Modern Indonesian', priceLevel: '$$$', rating: 4.9 },
      { name: 'Merah Putih', cuisine: 'Indonesian', priceLevel: '$$', rating: 4.7 },
      { name: 'Sarong', cuisine: 'Asian Fusion', priceLevel: '$$$', rating: 4.8 },
      { name: 'Naughty Nuri\'s Warung', cuisine: 'Balinese BBQ', priceLevel: '$', rating: 4.5 },
      { name: 'Mosaic Restaurant', cuisine: 'Contemporary', priceLevel: '$$$', rating: 4.6 },
    ],
    stays: [
      { name: 'Four Seasons Resort Bali at Sayan', priceRange: '$600–$1,200/night', rating: 4.9, location: 'Ubud' },
      { name: 'Alaya Resort Ubud', priceRange: '$180–$350/night', rating: 4.7, location: 'Ubud' },
      { name: 'The Layar – Private Villas', priceRange: '$400–$900/night', rating: 4.8, location: 'Seminyak' },
      { name: 'Komaneka at Bisma', priceRange: '$300–$650/night', rating: 4.7, location: 'Ubud' },
      { name: 'Katamama Boutique Hotel', priceRange: '$250–$500/night', rating: 4.6, location: 'Seminyak' },
    ],
  },
  Paris: {
    places: [
      { name: 'Eiffel Tower', description: 'Gustave Eiffel\'s 330m iron lattice tower is the world\'s most visited paid monument.', category: 'Monument', image: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e?auto=format&fit=crop&w=600&q=80' },
      { name: 'Louvre Museum', description: 'The world\'s largest art museum, home to 35,000 works including the Mona Lisa.', category: 'Museum', image: 'https://images.unsplash.com/photo-1567942712661-82b9b407abbf?auto=format&fit=crop&w=600&q=80' },
      { name: 'Notre-Dame Cathedral', description: 'A masterpiece of French Gothic architecture on the Île de la Cité, currently under restoration.', category: 'Monument', image: 'https://images.unsplash.com/photo-1478391679764-b2d8b3cd1e94?auto=format&fit=crop&w=600&q=80' },
      { name: 'Montmartre & Sacré-Cœur', description: 'A hilltop village with cobbled streets, artist studios, and the iconic white basilica.', category: 'Monument', image: 'https://images.unsplash.com/photo-1555993539-1732b0258235?auto=format&fit=crop&w=600&q=80' },
      { name: 'Palace of Versailles', description: 'Louis XIV\'s magnificent royal palace with 2,000 acres of manicured French gardens.', category: 'Palace', image: 'https://images.unsplash.com/photo-1591030617239-46c3c0b60f3f?auto=format&fit=crop&w=600&q=80' },
    ],
    restaurants: [
      { name: 'Le Jules Verne', cuisine: 'French', priceLevel: '$$$', rating: 4.8 },
      { name: 'L\'Arpège', cuisine: 'Contemporary French', priceLevel: '$$$', rating: 4.9 },
      { name: 'Septime', cuisine: 'Modern Bistro', priceLevel: '$$', rating: 4.8 },
      { name: 'Café de Flore', cuisine: 'French Café', priceLevel: '$$', rating: 4.5 },
      { name: 'Le Comptoir du Relais', cuisine: 'Brasserie', priceLevel: '$$', rating: 4.6 },
    ],
    stays: [
      { name: 'Hôtel de Crillon', priceRange: '$900–$2,500/night', rating: 4.9, location: 'Place de la Concorde' },
      { name: 'Hôtel Le Marais', priceRange: '$200–$450/night', rating: 4.6, location: 'Le Marais' },
      { name: 'Le Bristol Paris', priceRange: '$800–$1,800/night', rating: 4.9, location: '8th Arrondissement' },
      { name: 'Hôtel des Grands Boulevards', priceRange: '$250–$500/night', rating: 4.7, location: '2nd Arrondissement' },
      { name: 'Generator Paris', priceRange: '$50–$120/night', rating: 4.2, location: '10th Arrondissement' },
    ],
  },
  Kyoto: {
    places: [
      { name: 'Fushimi Inari-taisha', description: 'Thousands of vermilion torii gates wind up the forested slopes of Mount Inari.', category: 'Temple', image: 'https://images.unsplash.com/photo-1545569341-4f74f339a5b0?auto=format&fit=crop&w=600&q=80' },
      { name: 'Arashiyama Bamboo Grove', description: 'Towering bamboo stalks create an otherworldly green tunnel in western Kyoto.', category: 'Nature', image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=600&q=80' },
      { name: 'Kinkaku-ji (Golden Pavilion)', description: 'A Zen Buddhist temple whose top two floors are completely covered in gold leaf, reflected in the surrounding pond.', category: 'Temple', image: 'https://images.unsplash.com/photo-1519181245277-cffeb31da2e3?auto=format&fit=crop&w=600&q=80' },
      { name: 'Gion District', description: 'Kyoto\'s most famous geisha district with preserved machiya townhouses and lantern-lit cobblestone lanes.', category: 'Other', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80' },
      { name: 'Nijo Castle', description: 'A flatland castle of the Tokugawa shogunate featuring "nightingale floors" that squeak as you walk.', category: 'Castle', image: 'https://images.unsplash.com/photo-1559543404-fbbf7e82c6ae?auto=format&fit=crop&w=600&q=80' },
    ],
    restaurants: [
      { name: 'Kikunoi Honten', cuisine: 'Kaiseki', priceLevel: '$$$', rating: 4.9 },
      { name: 'Nishiki Market Stalls', cuisine: 'Japanese Street Food', priceLevel: '$', rating: 4.6 },
      { name: 'Mizai', cuisine: 'Kaiseki', priceLevel: '$$$', rating: 4.8 },
      { name: 'Ippodo Tea House', cuisine: 'Japanese Tea & Sweets', priceLevel: '$', rating: 4.7 },
      { name: 'Ramen Togoshi', cuisine: 'Ramen', priceLevel: '$', rating: 4.5 },
    ],
    stays: [
      { name: 'Tawaraya Ryokan', priceRange: '$700–$1,500/night', rating: 4.9, location: 'Central Kyoto' },
      { name: 'The Ritz-Carlton Kyoto', priceRange: '$600–$1,200/night', rating: 4.8, location: 'Kamogawa Riverside' },
      { name: 'Hiiragiya Ryokan', priceRange: '$350–$800/night', rating: 4.7, location: 'Nakagyo Ward' },
      { name: 'Hotel Granvia Kyoto', priceRange: '$150–$300/night', rating: 4.5, location: 'Kyoto Station' },
      { name: 'Piece Hostel Sanjo', priceRange: '$30–$70/night', rating: 4.3, location: 'Sanjo' },
    ],
  },
  'New York': {
    places: [
      { name: 'Central Park', description: 'An 843-acre green lung in the heart of Manhattan offering lakes, meadows, and the famous Bethesda Fountain.', category: 'Park', image: 'https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?auto=format&fit=crop&w=600&q=80' },
      { name: 'Metropolitan Museum of Art', description: 'One of the world\'s greatest art museums spanning 5,000 years of culture across 17 curatorial departments.', category: 'Museum', image: 'https://images.unsplash.com/photo-1582642508087-e76280cf2b8e?auto=format&fit=crop&w=600&q=80' },
      { name: 'Brooklyn Bridge', description: 'The iconic 1883 suspension bridge connecting Manhattan and Brooklyn, with stunning city views from its walkway.', category: 'Monument', image: 'https://images.unsplash.com/photo-1490644658840-3f2e3f8c5625?auto=format&fit=crop&w=600&q=80' },
      { name: 'Statue of Liberty', description: 'France\'s gift to America — the copper statue on Liberty Island has welcomed immigrants since 1886.', category: 'Monument', image: 'https://images.unsplash.com/photo-1575451537558-cfc6f882cfb9?auto=format&fit=crop&w=600&q=80' },
      { name: 'Times Square', description: 'The dazzling "Crossroads of the World" — a sensory overload of LED billboards, Broadway theatres, and street performers.', category: 'Other', image: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=600&q=80' },
    ],
    restaurants: [
      { name: 'Eleven Madison Park', cuisine: 'Contemporary American', priceLevel: '$$$', rating: 4.9 },
      { name: 'Katz\'s Delicatessen', cuisine: 'Jewish Deli', priceLevel: '$', rating: 4.6 },
      { name: 'Le Bernardin', cuisine: 'French Seafood', priceLevel: '$$$', rating: 4.9 },
      { name: 'Joe\'s Pizza', cuisine: 'NYC Pizza', priceLevel: '$', rating: 4.7 },
      { name: 'Nobu New York', cuisine: 'Japanese Fusion', priceLevel: '$$$', rating: 4.7 },
    ],
    stays: [
      { name: 'The Plaza Hotel', priceRange: '$700–$2,000/night', rating: 4.8, location: 'Central Park South' },
      { name: 'The Standard High Line', priceRange: '$350–$700/night', rating: 4.6, location: 'Meatpacking District' },
      { name: 'Arlo NoMad', priceRange: '$180–$380/night', rating: 4.4, location: 'NoMad' },
      { name: 'Pod 51 Hotel', priceRange: '$80–$180/night', rating: 4.1, location: 'Midtown East' },
      { name: 'The Langham New York', priceRange: '$500–$1,200/night', rating: 4.8, location: 'Fifth Avenue' },
    ],
  },
  Santorini: {
    places: [
      { name: 'Oia Village', description: 'The postcard-perfect village of blue-domed churches and whitewashed houses perched on the caldera rim.', category: 'Other', image: 'https://images.unsplash.com/photo-1533105079780-a36d0d591333?auto=format&fit=crop&w=600&q=80' },
      { name: 'Red Beach', description: 'A striking volcanic beach of terracotta-red cliffs and pebbles near the ancient site of Akrotiri.', category: 'Beach', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=600&q=80' },
      { name: 'Akrotiri Excavations', description: 'A Minoan Bronze Age settlement buried by the Thera eruption in 1627 BC — Greece\'s Pompeii.', category: 'Museum', image: 'https://images.unsplash.com/photo-1525867787985-e64b1f0a57f9?auto=format&fit=crop&w=600&q=80' },
      { name: 'Fira Town', description: 'The island\'s bustling capital with cliff-top tavernas, boutiques, and the Archaeological Museum.', category: 'Other', image: 'https://images.unsplash.com/photo-1580502304784-8985b7eb7260?auto=format&fit=crop&w=600&q=80' },
      { name: 'Perissa Black Sand Beach', description: 'A 7km volcanic black-sand beach on the southeastern coast backed by the looming Mesa Vouno cliff.', category: 'Beach', image: 'https://images.unsplash.com/photo-1601581987809-a874a81309c9?auto=format&fit=crop&w=600&q=80' },
    ],
    restaurants: [
      { name: 'Kapari Natural Resort Restaurant', cuisine: 'Greek Mediterranean', priceLevel: '$$$', rating: 4.8 },
      { name: 'Ammoudi Fish Tavern', cuisine: 'Seafood', priceLevel: '$$', rating: 4.7 },
      { name: 'Selene', cuisine: 'Modern Greek', priceLevel: '$$$', rating: 4.9 },
      { name: 'Roka Restaurant', cuisine: 'Greek', priceLevel: '$$', rating: 4.5 },
      { name: 'Naoussa', cuisine: 'Traditional Greek', priceLevel: '$$', rating: 4.6 },
    ],
    stays: [
      { name: 'Andronis Luxury Suites', priceRange: '$800–$2,000/night', rating: 4.9, location: 'Oia' },
      { name: 'Canaves Oia Suites', priceRange: '$600–$1,500/night', rating: 4.9, location: 'Oia' },
      { name: 'Grace Hotel Santorini', priceRange: '$450–$1,000/night', rating: 4.8, location: 'Imerovigli' },
      { name: 'Hotel Aressana Spa', priceRange: '$200–$450/night', rating: 4.5, location: 'Fira' },
      { name: 'Caldera Villas', priceRange: '$350–$800/night', rating: 4.7, location: 'Oia' },
    ],
  },
  // Remaining 17 destinations use concise sub-entities
  'Cape Town': {
    places: [
      { name: 'Table Mountain', description: 'A flat-topped mountain offering panoramic views of the city and Cape Peninsula via cable car.', category: 'Nature', image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=600&q=80' },
      { name: 'Cape of Good Hope', description: 'The dramatic rocky promontory at the southwestern tip of Africa, within Table Mountain National Park.', category: 'Nature', image: 'https://images.unsplash.com/photo-1583422409186-b85c42aaa35e?auto=format&fit=crop&w=600&q=80' },
      { name: 'Robben Island', description: 'UNESCO World Heritage site where Nelson Mandela was imprisoned for 18 years.', category: 'Monument', image: 'https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&w=600&q=80' },
      { name: 'Boulders Beach Penguins', description: 'A sheltered cove home to a colony of 3,000 endangered African penguins near Simon\'s Town.', category: 'Nature', image: 'https://images.unsplash.com/photo-1545569341-4f74f339a5b0?auto=format&fit=crop&w=600&q=80' },
      { name: 'V&A Waterfront', description: 'A vibrant working harbour with restaurants, shops, the Two Oceans Aquarium, and mountain views.', category: 'Market', image: 'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=600&q=80' },
    ],
    restaurants: [
      { name: 'The Test Kitchen', cuisine: 'Contemporary', priceLevel: '$$$', rating: 4.9 },
      { name: 'La Colombe', cuisine: 'French', priceLevel: '$$$', rating: 4.8 },
      { name: 'Willoughby & Co', cuisine: 'Seafood', priceLevel: '$$', rating: 4.5 },
      { name: 'Mzoli\'s', cuisine: 'South African Braai', priceLevel: '$', rating: 4.6 },
      { name: 'Harbour House', cuisine: 'Seafood', priceLevel: '$$', rating: 4.6 },
    ],
    stays: [
      { name: 'One&Only Cape Town', priceRange: '$500–$1,400/night', rating: 4.9, location: 'V&A Waterfront' },
      { name: 'The Twelve Apostles Hotel', priceRange: '$350–$900/night', rating: 4.8, location: 'Camps Bay' },
      { name: 'Ellerman House', priceRange: '$700–$1,800/night', rating: 4.9, location: 'Bantry Bay' },
      { name: 'POD Camps Bay', priceRange: '$250–$600/night', rating: 4.6, location: 'Camps Bay' },
      { name: 'Long Street Backpackers', priceRange: '$20–$60/night', rating: 4.2, location: 'City Bowl' },
    ],
  },
  'Machu Picchu': {
    places: [
      { name: 'Machu Picchu Citadel', description: 'The 15th-century Inca citadel at 2,430m, featuring temples, plazas, and terraced agriculture.', category: 'Monument', image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=600&q=80' },
      { name: 'Huayna Picchu', description: 'The iconic peak rising behind Machu Picchu offering vertigo-inducing views for those who climb it.', category: 'Nature', image: 'https://images.unsplash.com/photo-1510690682500-0b07a16cc82f?auto=format&fit=crop&w=600&q=80' },
      { name: 'Inca Trail', description: 'The legendary 4-day trek through cloud forest, mountain passes, and Inca ruins to the Sun Gate.', category: 'Nature', image: 'https://images.unsplash.com/photo-1580502304784-8985b7eb7260?auto=format&fit=crop&w=600&q=80' },
      { name: 'Aguas Calientes Hot Springs', description: 'Natural thermal baths in the gateway town offering relaxation after the rigours of Machu Picchu.', category: 'Nature', image: 'https://images.unsplash.com/photo-1525867787985-e64b1f0a57f9?auto=format&fit=crop&w=600&q=80' },
      { name: 'Sun Gate (Inti Punku)', description: 'The mountaintop gateway where Inca Trail trekkers get their first breathtaking view of Machu Picchu.', category: 'Monument', image: 'https://images.unsplash.com/photo-1601581987809-a874a81309c9?auto=format&fit=crop&w=600&q=80' },
    ],
    restaurants: [
      { name: 'Indio Feliz', cuisine: 'Peruvian French Fusion', priceLevel: '$$', rating: 4.7 },
      { name: 'Toto\'s House Restaurant', cuisine: 'Peruvian', priceLevel: '$$', rating: 4.5 },
      { name: 'Café Inkaterra', cuisine: 'Peruvian', priceLevel: '$$$', rating: 4.6 },
      { name: 'Hatun Inti Restaurant', cuisine: 'Local Peruvian', priceLevel: '$', rating: 4.4 },
      { name: 'El Mapi Restaurant', cuisine: 'International', priceLevel: '$$', rating: 4.5 },
    ],
    stays: [
      { name: 'Belmond Sanctuary Lodge', priceRange: '$800–$2,000/night', rating: 4.8, location: 'Machu Picchu Entrance' },
      { name: 'Inkaterra Machu Picchu Pueblo Hotel', priceRange: '$500–$1,200/night', rating: 4.9, location: 'Aguas Calientes' },
      { name: 'El MaPi by Inkaterra', priceRange: '$150–$350/night', rating: 4.7, location: 'Aguas Calientes' },
      { name: 'Sumaq Machu Picchu Hotel', priceRange: '$300–$700/night', rating: 4.7, location: 'Aguas Calientes' },
      { name: 'Rupa Wasi Lodge', priceRange: '$80–$200/night', rating: 4.4, location: 'Aguas Calientes' },
    ],
  },
  Dubai: {
    places: [
      { name: 'Burj Khalifa', description: 'The world\'s tallest building at 828m, with observation decks offering views of desert and Gulf.', category: 'Monument', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80' },
      { name: 'Dubai Creek & Gold Souk', description: 'The historic heart of Dubai where abras cross the creek and the glittering Gold Souk dazzles.', category: 'Market', image: 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?auto=format&fit=crop&w=600&q=80' },
      { name: 'Palm Jumeirah', description: 'An artificial palm-shaped island hosting luxury hotels, residences, and Atlantis resort.', category: 'Other', image: 'https://images.unsplash.com/photo-1546412414-8035e1776c9a?auto=format&fit=crop&w=600&q=80' },
      { name: 'Dubai Desert Safari', description: 'Dune bashing, camel rides, and Bedouin camp dinners under the stars in the Arabian Desert.', category: 'Nature', image: 'https://images.unsplash.com/photo-1509233725247-49e657c54213?auto=format&fit=crop&w=600&q=80' },
      { name: 'Dubai Museum', description: 'Set in the 1787 Al Fahidi Fort, the city\'s oldest building traces Dubai\'s evolution from fishing village.', category: 'Museum', image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=600&q=80' },
    ],
    restaurants: [
      { name: 'Nobu Dubai', cuisine: 'Japanese Fusion', priceLevel: '$$$', rating: 4.8 },
      { name: 'At.mosphere', cuisine: 'International', priceLevel: '$$$', rating: 4.7 },
      { name: 'Al Fanar Restaurant', cuisine: 'Emirati', priceLevel: '$$', rating: 4.6 },
      { name: 'Ravi Restaurant', cuisine: 'Pakistani', priceLevel: '$', rating: 4.5 },
      { name: 'Pierchic', cuisine: 'Seafood', priceLevel: '$$$', rating: 4.7 },
    ],
    stays: [
      { name: 'Burj Al Arab Jumeirah', priceRange: '$1,500–$8,000/night', rating: 4.9, location: 'Jumeirah Beach' },
      { name: 'Atlantis The Palm', priceRange: '$400–$1,200/night', rating: 4.7, location: 'Palm Jumeirah' },
      { name: 'Armani Hotel Dubai', priceRange: '$600–$1,500/night', rating: 4.8, location: 'Burj Khalifa' },
      { name: 'Rove Downtown Dubai', priceRange: '$80–$200/night', rating: 4.4, location: 'Downtown Dubai' },
      { name: 'XVA Art Hotel', priceRange: '$100–$250/night', rating: 4.5, location: 'Al Fahidi' },
    ],
  },
  Bangkok: {
    places: [
      { name: 'Wat Phra Kaew (Grand Palace)', description: 'The holiest site in Thailand, housing the revered Emerald Buddha within the Grand Palace complex.', category: 'Temple', image: 'https://images.unsplash.com/photo-1508009603885-50cf7c8dd0d4?auto=format&fit=crop&w=600&q=80' },
      { name: 'Wat Arun', description: 'The "Temple of Dawn" on the Chao Phraya riverbank, encrusted with colourful Chinese porcelain.', category: 'Temple', image: 'https://images.unsplash.com/photo-1563492065599-3520f775eeed?auto=format&fit=crop&w=600&q=80' },
      { name: 'Chatuchak Weekend Market', description: 'One of the world\'s largest markets with 15,000 stalls selling everything from vintage to street food.', category: 'Market', image: 'https://images.unsplash.com/photo-1563693983366-4adf0b1d3d3f?auto=format&fit=crop&w=600&q=80' },
      { name: 'Damnoen Saduak Floating Market', description: 'Vendors in traditional Thai hats paddle wooden boats laden with tropical produce and cooked food.', category: 'Market', image: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=600&q=80' },
      { name: 'Jim Thompson House Museum', description: 'A complex of 6 traditional Thai houses filled with the legendary silk merchant\'s Asian art collection.', category: 'Museum', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=600&q=80' },
    ],
    restaurants: [
      { name: 'Gaggan Anand', cuisine: 'Progressive Indian', priceLevel: '$$$', rating: 4.9 },
      { name: 'Jay Fai', cuisine: 'Thai Street Food', priceLevel: '$$', rating: 4.8 },
      { name: 'Nahm', cuisine: 'Traditional Thai', priceLevel: '$$$', rating: 4.7 },
      { name: 'Or Tor Kor Market', cuisine: 'Thai Market', priceLevel: '$', rating: 4.6 },
      { name: 'Blue Elephant', cuisine: 'Royal Thai', priceLevel: '$$$', rating: 4.7 },
    ],
    stays: [
      { name: 'Mandarin Oriental Bangkok', priceRange: '$400–$1,000/night', rating: 4.9, location: 'Chao Phraya Riverside' },
      { name: 'Capella Bangkok', priceRange: '$500–$1,200/night', rating: 4.9, location: 'Chao Phraya Riverside' },
      { name: 'The Peninsula Bangkok', priceRange: '$350–$900/night', rating: 4.8, location: 'Charoen Nakhon' },
      { name: 'Citizen Hotel', priceRange: '$50–$120/night', rating: 4.3, location: 'Sukhumvit' },
      { name: 'ONCE Bangkok', priceRange: '$120–$280/night', rating: 4.5, location: 'Silom' },
    ],
  },
  Rome: {
    places: [
      { name: 'Colosseum', description: 'The iconic 2,000-year-old amphitheatre that once held 80,000 spectators for gladiatorial contests.', category: 'Monument', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80' },
      { name: 'Vatican Museums & Sistine Chapel', description: 'Home to Michelangelo\'s breathtaking ceiling frescoes and one of the world\'s greatest art collections.', category: 'Museum', image: 'https://images.unsplash.com/photo-1518994603827-7d13543b3f3e?auto=format&fit=crop&w=600&q=80' },
      { name: 'Trevi Fountain', description: 'The world\'s most famous fountain — toss a coin to ensure your return to Rome.', category: 'Monument', image: 'https://images.unsplash.com/photo-1515542706656-8e4929680b87?auto=format&fit=crop&w=600&q=80' },
      { name: 'Roman Forum', description: 'The heart of ancient Rome — ruins of temples, arches, and public buildings that once ruled the world.', category: 'Monument', image: 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?auto=format&fit=crop&w=600&q=80' },
      { name: 'Borghese Gallery', description: 'A baroque villa housing Bernini sculptures and Caravaggio paintings in a Renaissance garden setting.', category: 'Museum', image: 'https://images.unsplash.com/photo-1553696590-7b5b53c46b70?auto=format&fit=crop&w=600&q=80' },
    ],
    restaurants: [
      { name: 'La Pergola', cuisine: 'Contemporary Italian', priceLevel: '$$$', rating: 4.9 },
      { name: 'Da Enzo al 29', cuisine: 'Roman Trattoria', priceLevel: '$$', rating: 4.7 },
      { name: 'Supplì Roma', cuisine: 'Roman Street Food', priceLevel: '$', rating: 4.6 },
      { name: 'Osteria dell\'Enoteca', cuisine: 'Tuscan', priceLevel: '$$$', rating: 4.7 },
      { name: 'Armando al Pantheon', cuisine: 'Roman', priceLevel: '$$', rating: 4.8 },
    ],
    stays: [
      { name: 'Hotel de Russie', priceRange: '$600–$1,500/night', rating: 4.8, location: 'Via del Babuino' },
      { name: 'Portrait Roma', priceRange: '$500–$1,200/night', rating: 4.8, location: 'Via Bocca di Leone' },
      { name: 'The Inn at the Roman Forum', priceRange: '$300–$700/night', rating: 4.7, location: 'Fori Imperiali' },
      { name: 'Hotel Campo de\' Fiori', priceRange: '$150–$350/night', rating: 4.4, location: 'Campo de\' Fiori' },
      { name: 'Alessandro Palace Hostel', priceRange: '$25–$70/night', rating: 4.3, location: 'Termini' },
    ],
  },
  Amsterdam: {
    places: [
      { name: 'Anne Frank House', description: 'The hiding place of Anne Frank during WWII, now a museum preserving the original rooms and diary.', category: 'Museum', image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&w=600&q=80' },
      { name: 'Rijksmuseum', description: 'The Netherlands\' premier art museum housing Rembrandt\'s Night Watch and Vermeer masterpieces.', category: 'Museum', image: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=600&q=80' },
      { name: 'Canal Ring (Grachtengordel)', description: 'UNESCO-listed 17th-century canal belt of 165 canals lined with gabled merchant houses.', category: 'Other', image: 'https://images.unsplash.com/photo-1520640023173-50a135e35e4c?auto=format&fit=crop&w=600&q=80' },
      { name: 'Keukenhof Gardens', description: 'The world\'s largest flower garden — 7 million bulbs bloom each spring near Lisse.', category: 'Park', image: 'https://images.unsplash.com/photo-1468929736547-7c2c4bdcd3fc?auto=format&fit=crop&w=600&q=80' },
      { name: 'Van Gogh Museum', description: 'The world\'s largest collection of Van Gogh works — 200 paintings, 500 drawings, 700 letters.', category: 'Museum', image: 'https://images.unsplash.com/photo-1564399580075-5dfe19c205f3?auto=format&fit=crop&w=600&q=80' },
    ],
    restaurants: [
      { name: 'Rijks Restaurant', cuisine: 'Modern Dutch', priceLevel: '$$$', rating: 4.8 },
      { name: 'De Kas', cuisine: 'Farm-to-Table', priceLevel: '$$$', rating: 4.8 },
      { name: 'Pantry', cuisine: 'Traditional Dutch', priceLevel: '$$', rating: 4.5 },
      { name: 'Foodhallen', cuisine: 'International Street Food', priceLevel: '$', rating: 4.5 },
      { name: 'Broodje Bert', cuisine: 'Dutch Sandwiches', priceLevel: '$', rating: 4.4 },
    ],
    stays: [
      { name: 'Waldorf Astoria Amsterdam', priceRange: '$500–$1,200/night', rating: 4.8, location: 'Herengracht Canal' },
      { name: 'Hotel V Nesplein', priceRange: '$150–$350/night', rating: 4.5, location: 'City Centre' },
      { name: 'Conservatorium Hotel', priceRange: '$350–$800/night', rating: 4.7, location: 'Museum Quarter' },
      { name: 'The Flying Pig Downtown', priceRange: '$30–$80/night', rating: 4.3, location: 'Nieuwmarkt' },
      { name: 'Hampshire Hotel Amsterdam', priceRange: '$120–$300/night', rating: 4.4, location: 'Amsterdam Zuid' },
    ],
  },
  Sydney: {
    places: [
      { name: 'Sydney Opera House', description: 'Jørn Utzon\'s UNESCO-listed masterpiece on Bennelong Point — the world\'s most distinctive building.', category: 'Monument', image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=600&q=80' },
      { name: 'Bondi Beach', description: 'Australia\'s most iconic beach — golden sand, surf breaks, and the famous cliff-top coastal walk.', category: 'Beach', image: 'https://images.unsplash.com/photo-1549893072-31fb8ba62e7e?auto=format&fit=crop&w=600&q=80' },
      { name: 'Sydney Harbour Bridge', description: 'The "Coathanger" — climb to the summit for 360-degree views of the harbour and city skyline.', category: 'Monument', image: 'https://images.unsplash.com/photo-1524820197278-540916411e20?auto=format&fit=crop&w=600&q=80' },
      { name: 'Blue Mountains', description: 'Dramatic sandstone escarpments, waterfalls, and the Three Sisters rock formation 90 min from Sydney.', category: 'Nature', image: 'https://images.unsplash.com/photo-1572371711709-c5b4d83f3d21?auto=format&fit=crop&w=600&q=80' },
      { name: 'Taronga Zoo', description: 'A world-class zoo on the harbour foreshore with native Australian wildlife and harbour views.', category: 'Park', image: 'https://images.unsplash.com/photo-1578326457399-3b34dbbf23b8?auto=format&fit=crop&w=600&q=80' },
    ],
    restaurants: [
      { name: 'Quay', cuisine: 'Contemporary Australian', priceLevel: '$$$', rating: 4.8 },
      { name: 'Tetsuya\'s', cuisine: 'Japanese French Fusion', priceLevel: '$$$', rating: 4.9 },
      { name: 'Icebergs Dining Room', cuisine: 'Modern Italian', priceLevel: '$$$', rating: 4.7 },
      { name: 'The Rocks Market', cuisine: 'Australian Street Food', priceLevel: '$', rating: 4.5 },
      { name: 'Chat Thai', cuisine: 'Thai', priceLevel: '$', rating: 4.6 },
    ],
    stays: [
      { name: 'Park Hyatt Sydney', priceRange: '$600–$1,800/night', rating: 4.9, location: 'Circular Quay' },
      { name: 'MONA (Museum of Old and New Art) Pavilions', priceRange: '$900–$2,500/night', rating: 4.9, location: 'Hobart' },
      { name: 'QT Sydney', priceRange: '$250–$600/night', rating: 4.6, location: 'CBD' },
      { name: 'Base Sydney Backpackers', priceRange: '$30–$80/night', rating: 4.2, location: 'Haymarket' },
      { name: 'The Langham Sydney', priceRange: '$400–$1,000/night', rating: 4.8, location: 'The Rocks' },
    ],
  },
  Istanbul: {
    places: [
      { name: 'Hagia Sophia', description: 'A 6th-century Byzantine basilica converted to an Ottoman mosque, now once again a functioning mosque.', category: 'Temple', image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=600&q=80' },
      { name: 'Blue Mosque (Sultan Ahmed)', description: 'The only mosque in Istanbul with six minarets, famous for 20,000 blue Iznik tiles inside.', category: 'Temple', image: 'https://images.unsplash.com/photo-1543831776-7ada8b9fb6e1?auto=format&fit=crop&w=600&q=80' },
      { name: 'Grand Bazaar', description: 'One of the world\'s oldest covered markets with 4,000 shops across 60 covered streets.', category: 'Market', image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=600&q=80' },
      { name: 'Topkapi Palace', description: 'The lavish administrative heart of the Ottoman Empire for 400 years, housing imperial treasures.', category: 'Palace', image: 'https://images.unsplash.com/photo-1559073134-e8c0c6b56c8c?auto=format&fit=crop&w=600&q=80' },
      { name: 'Bosphorus Cruise', description: 'A scenic ferry journey between Europe and Asia, past Ottoman palaces and wooden yalıs.', category: 'Other', image: 'https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?auto=format&fit=crop&w=600&q=80' },
    ],
    restaurants: [
      { name: 'Mikla Restaurant', cuisine: 'New Anatolian', priceLevel: '$$$', rating: 4.8 },
      { name: 'Karaköy Lokantası', cuisine: 'Turkish', priceLevel: '$$', rating: 4.6 },
      { name: 'Sait Halim Pasha Mansion', cuisine: 'Ottoman', priceLevel: '$$$', rating: 4.7 },
      { name: 'Hafız Mustafa', cuisine: 'Turkish Sweets', priceLevel: '$', rating: 4.6 },
      { name: 'Çiya Sofrası', cuisine: 'Anatolian', priceLevel: '$', rating: 4.7 },
    ],
    stays: [
      { name: 'Four Seasons Istanbul at Sultanahmet', priceRange: '$500–$1,200/night', rating: 4.8, location: 'Sultanahmet' },
      { name: 'Çırağan Palace Kempinski', priceRange: '$400–$1,000/night', rating: 4.8, location: 'Beşiktaş' },
      { name: 'The House Hotel Nişantaşı', priceRange: '$150–$400/night', rating: 4.5, location: 'Nişantaşı' },
      { name: 'Sirkeci Mansion', priceRange: '$100–$250/night', rating: 4.4, location: 'Sirkeci' },
      { name: 'Istanbul Hostel', priceRange: '$15–$50/night', rating: 4.2, location: 'Sultanahmet' },
    ],
  },
  Barcelona: {
    places: [
      { name: 'Sagrada Família', description: 'Gaudí\'s breathtaking unfinished basilica — a UNESCO monument under construction since 1882.', category: 'Temple', image: 'https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?auto=format&fit=crop&w=600&q=80' },
      { name: 'Park Güell', description: 'A colourful mosaic park and UNESCO site designed by Gaudí with panoramic views of the city.', category: 'Park', image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=600&q=80' },
      { name: 'Casa Batlló', description: 'Gaudí\'s masterpiece on Passeig de Gràcia — a building that looks like a living organism of colour.', category: 'Monument', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80' },
      { name: 'La Barceloneta Beach', description: 'The city\'s main urban beach — 1.1km of golden sand 10 minutes from Las Ramblas.', category: 'Beach', image: 'https://images.unsplash.com/photo-1558618047-3d08dbe0cf28?auto=format&fit=crop&w=600&q=80' },
      { name: 'Gothic Quarter (Barri Gòtic)', description: 'A medieval labyrinth of narrow streets, Roman ruins, and Barcelona Cathedral at its heart.', category: 'Other', image: 'https://images.unsplash.com/photo-1508050919630-b135583b29ab?auto=format&fit=crop&w=600&q=80' },
    ],
    restaurants: [
      { name: 'Disfrutar', cuisine: 'Creative Catalan', priceLevel: '$$$', rating: 4.9 },
      { name: 'Tickets', cuisine: 'Avant-Garde Tapas', priceLevel: '$$$', rating: 4.8 },
      { name: 'Can Solé', cuisine: 'Traditional Catalan Seafood', priceLevel: '$$', rating: 4.6 },
      { name: 'Bar Cañete', cuisine: 'Spanish Tapas', priceLevel: '$$', rating: 4.7 },
      { name: 'La Boqueria Market', cuisine: 'Market Food', priceLevel: '$', rating: 4.5 },
    ],
    stays: [
      { name: 'Hotel Arts Barcelona', priceRange: '$400–$1,000/night', rating: 4.8, location: 'Barceloneta' },
      { name: 'Mandarin Oriental Barcelona', priceRange: '$500–$1,200/night', rating: 4.9, location: 'Passeig de Gràcia' },
      { name: 'Casa Camper Barcelona', priceRange: '$200–$450/night', rating: 4.5, location: 'El Raval' },
      { name: 'Soho House Barcelona', priceRange: '$250–$600/night', rating: 4.6, location: 'Eixample' },
      { name: 'Equity Point Gothic Hostel', priceRange: '$25–$70/night', rating: 4.2, location: 'Gothic Quarter' },
    ],
  },
  Maldives: {
    places: [
      { name: 'Banana Reef', description: 'One of the Maldives\' first and most famous dive sites — vibrant coral gardens teeming with fish.', category: 'Other', image: 'https://images.unsplash.com/photo-1540979388789-ba8bf0e7c8a4?auto=format&fit=crop&w=600&q=80' },
      { name: 'Male Fish Market', description: 'The vibrant waterfront market where Maldivian fishermen sell the day\'s catch at dawn.', category: 'Market', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=600&q=80' },
      { name: 'Vaadhoo Island Bioluminescent Beach', description: 'A beach that glows blue at night from bioluminescent phytoplankton — a natural wonder.', category: 'Beach', image: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=600&q=80' },
      { name: 'Hulhumale Island Reef', description: 'An accessible coral reef off the reclaimed island of Hulhumale, perfect for snorkelling.', category: 'Nature', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80' },
      { name: 'National Museum Malé', description: 'Traces Maldivian history from the pre-Islamic Buddhist era through the sultanate period.', category: 'Museum', image: 'https://images.unsplash.com/photo-1587561278056-f47fb14116d3?auto=format&fit=crop&w=600&q=80' },
    ],
    restaurants: [
      { name: 'Ithaa Undersea Restaurant', cuisine: 'International', priceLevel: '$$$', rating: 4.8 },
      { name: 'Muraka', cuisine: 'European', priceLevel: '$$$', rating: 4.7 },
      { name: 'Sea Fire Salt', cuisine: 'Grilled Seafood', priceLevel: '$$$', rating: 4.7 },
      { name: 'Thai Village Restaurant', cuisine: 'Thai', priceLevel: '$$', rating: 4.5 },
      { name: 'Seagull Café House', cuisine: 'Maldivian', priceLevel: '$', rating: 4.4 },
    ],
    stays: [
      { name: 'Soneva Jani', priceRange: '$2,000–$6,000/night', rating: 4.9, location: 'Noonu Atoll' },
      { name: 'Six Senses Laamu', priceRange: '$1,200–$3,500/night', rating: 4.9, location: 'Laamu Atoll' },
      { name: 'Conrad Maldives Rangali Island', priceRange: '$800–$2,500/night', rating: 4.8, location: 'South Ari Atoll' },
      { name: 'Malahini Kuda Bandos', priceRange: '$200–$600/night', rating: 4.5, location: 'North Malé Atoll' },
      { name: 'Kuda Villingili Resort', priceRange: '$500–$1,500/night', rating: 4.7, location: 'South Malé Atoll' },
    ],
  },
  Prague: {
    places: [
      { name: 'Prague Castle', description: 'The largest ancient castle complex in the world, dominating the city from Hradčany hill.', category: 'Castle', image: 'https://images.unsplash.com/photo-1539819010-10f3a91d9f39?auto=format&fit=crop&w=600&q=80' },
      { name: 'Charles Bridge', description: 'A 14th-century Gothic bridge with 30 Baroque statues spanning the Vltava River.', category: 'Monument', image: 'https://images.unsplash.com/photo-1513805959324-96eb66ca8713?auto=format&fit=crop&w=600&q=80' },
      { name: 'Old Town Square', description: 'The medieval heart of Prague with its Astronomical Clock, Gothic Týn Cathedral, and Baroque palaces.', category: 'Monument', image: 'https://images.unsplash.com/photo-1558019137-54f57c8aafc3?auto=format&fit=crop&w=600&q=80' },
      { name: 'St. Vitus Cathedral', description: 'A stunning Gothic cathedral within Prague Castle, the largest in the Czech Republic.', category: 'Temple', image: 'https://images.unsplash.com/photo-1477894615569-be51d4f7cd91?auto=format&fit=crop&w=600&q=80' },
      { name: 'Josefov Jewish Quarter', description: 'Europe\'s best-preserved Jewish quarter with six synagogues and a medieval cemetery.', category: 'Museum', image: 'https://images.unsplash.com/photo-1533920379810-6bedac9abb49?auto=format&fit=crop&w=600&q=80' },
    ],
    restaurants: [
      { name: 'Field Restaurant', cuisine: 'Modern Czech', priceLevel: '$$$', rating: 4.8 },
      { name: 'Lokál', cuisine: 'Czech Pub Food', priceLevel: '$', rating: 4.6 },
      { name: 'La Degustation Bohême Bourgeoise', cuisine: 'Czech Fine Dining', priceLevel: '$$$', rating: 4.8 },
      { name: 'Kantýna', cuisine: 'Czech', priceLevel: '$', rating: 4.5 },
      { name: 'Mlýnec', cuisine: 'Contemporary Czech', priceLevel: '$$', rating: 4.6 },
    ],
    stays: [
      { name: 'Four Seasons Hotel Prague', priceRange: '$400–$1,000/night', rating: 4.8, location: 'Old Town' },
      { name: 'Hotel Josef', priceRange: '$150–$350/night', rating: 4.6, location: 'Old Town' },
      { name: 'Mosaic House', priceRange: '$50–$150/night', rating: 4.4, location: 'New Town' },
      { name: 'Alchymist Grand Hotel', priceRange: '$300–$700/night', rating: 4.7, location: 'Malá Strana' },
      { name: 'Sir Toby\'s Hostel', priceRange: '$20–$55/night', rating: 4.4, location: 'Holešovice' },
    ],
  },
  Queenstown: {
    places: [
      { name: 'Skyline Gondola & Luge', description: 'A gondola ride to Bob\'s Peak for panoramic views, followed by thrilling luge cart rides down.', category: 'Nature', image: 'https://images.unsplash.com/photo-1528543606781-2f0fd0f3c669?auto=format&fit=crop&w=600&q=80' },
      { name: 'Milford Sound', description: 'New Zealand\'s most iconic fjord — towering cliffs, waterfalls, and Mitre Peak rising 1,692m.', category: 'Nature', image: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=600&q=80' },
      { name: 'The Remarkables Ski Field', description: 'A world-class ski resort with sweeping views of Lake Wakatipu 30 minutes from Queenstown.', category: 'Nature', image: 'https://images.unsplash.com/photo-1542223616-740d5dff7f56?auto=format&fit=crop&w=600&q=80' },
      { name: 'Kawarau Bridge Bungy', description: 'The world\'s first commercial bungy jump site — a 43m leap above the turquoise Kawarau River.', category: 'Other', image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80' },
      { name: 'Arrowtown Historic Village', description: 'A charming gold-rush village with autumn foliage, historic miners\' cottages, and gold panning.', category: 'Other', image: 'https://images.unsplash.com/photo-1558618047-3d08dbe0cf28?auto=format&fit=crop&w=600&q=80' },
    ],
    restaurants: [
      { name: 'Amisfield Winery & Bistro', cuisine: 'Modern NZ', priceLevel: '$$$', rating: 4.8 },
      { name: 'The Bunker Restaurant', cuisine: 'Contemporary', priceLevel: '$$', rating: 4.7 },
      { name: 'Fergburger', cuisine: 'Gourmet Burgers', priceLevel: '$', rating: 4.7 },
      { name: 'Rata', cuisine: 'New Zealand', priceLevel: '$$$', rating: 4.8 },
      { name: 'Vudu Café & Larder', cuisine: 'Café', priceLevel: '$', rating: 4.5 },
    ],
    stays: [
      { name: 'Eichardt\'s Private Hotel', priceRange: '$600–$1,500/night', rating: 4.9, location: 'Queenstown Waterfront' },
      { name: 'Matakauri Lodge', priceRange: '$800–$2,000/night', rating: 4.9, location: 'Lake Wakatipu' },
      { name: 'The Rees Hotel', priceRange: '$250–$600/night', rating: 4.7, location: 'Lake Wakatipu' },
      { name: 'Nomads Queenstown Hostel', priceRange: '$25–$70/night', rating: 4.2, location: 'Queenstown Centre' },
      { name: 'Heartland Hotel Queenstown', priceRange: '$120–$280/night', rating: 4.4, location: 'Queenstown Centre' },
    ],
  },
  Marrakech: {
    places: [
      { name: 'Djemaa el-Fna Square', description: 'The beating heart of Marrakech — a UNESCO square of snake charmers, storytellers, and food stalls.', category: 'Market', image: 'https://images.unsplash.com/photo-1553953861-e5d79891d7a0?auto=format&fit=crop&w=600&q=80' },
      { name: 'Majorelle Garden', description: 'A dreamlike botanical garden of cobalt-blue buildings and exotic plants, owned by Yves Saint Laurent.', category: 'Park', image: 'https://images.unsplash.com/photo-1571683014009-7b671f98d2c1?auto=format&fit=crop&w=600&q=80' },
      { name: 'Bahia Palace', description: 'A late 19th-century palace complex of ornate Moroccan and Islamic architecture and tiled courtyards.', category: 'Palace', image: 'https://images.unsplash.com/photo-1548018560-c7196548e346?auto=format&fit=crop&w=600&q=80' },
      { name: 'Medina Souks', description: 'A labyrinth of covered markets selling spices, leather, textiles, and lanterns in the UNESCO-listed old city.', category: 'Market', image: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=600&q=80' },
      { name: 'Koutoubia Mosque', description: 'The largest mosque in Marrakech, whose 70m minaret has guided travellers since the 12th century.', category: 'Temple', image: 'https://images.unsplash.com/photo-1548357040-b8b7e97a4b9a?auto=format&fit=crop&w=600&q=80' },
    ],
    restaurants: [
      { name: 'Le Jardin', cuisine: 'Moroccan', priceLevel: '$$', rating: 4.7 },
      { name: 'Dar Yacout', cuisine: 'Traditional Moroccan', priceLevel: '$$$', rating: 4.8 },
      { name: 'Nomad', cuisine: 'Modern Moroccan', priceLevel: '$$', rating: 4.7 },
      { name: 'Café de France', cuisine: 'Moroccan Café', priceLevel: '$', rating: 4.3 },
      { name: 'Al Fassia', cuisine: 'Traditional Moroccan', priceLevel: '$$', rating: 4.6 },
    ],
    stays: [
      { name: 'La Mamounia', priceRange: '$500–$1,500/night', rating: 4.9, location: 'Medina' },
      { name: 'Royal Mansour Marrakech', priceRange: '$800–$2,500/night', rating: 4.9, location: 'Medina' },
      { name: 'Riad BE Marrakech', priceRange: '$150–$400/night', rating: 4.7, location: 'Medina' },
      { name: 'Riad Yasmine', priceRange: '$80–$200/night', rating: 4.5, location: 'Medina' },
      { name: 'Earth Hostel', priceRange: '$15–$40/night', rating: 4.3, location: 'Medina' },
    ],
  },
  Reykjavik: {
    places: [
      { name: 'Hallgrímskirkja Church', description: 'Reykjavik\'s iconic 74.5m concrete church inspired by basalt lava columns, with a panoramic tower.', category: 'Temple', image: 'https://images.unsplash.com/photo-1529963183131-ea6ec08c2701?auto=format&fit=crop&w=600&q=80' },
      { name: 'Blue Lagoon Geothermal Spa', description: 'A milky-blue geothermal pool in a lava field — Iceland\'s most visited attraction.', category: 'Nature', image: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=600&q=80' },
      { name: 'Northern Lights (Aurora Borealis)', description: 'Iceland\'s magical celestial display — best viewed September through March away from city lights.', category: 'Nature', image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=600&q=80' },
      { name: 'Golden Circle', description: 'A classic day route linking Þingvellir National Park, Geysir hot springs, and Gullfoss waterfall.', category: 'Nature', image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80' },
      { name: 'Harpa Concert Hall', description: 'An award-winning glass-and-steel concert hall on the harbour, glittering like Iceland\'s Northern Lights.', category: 'Monument', image: 'https://images.unsplash.com/photo-1548965716-6c5cf49614c7?auto=format&fit=crop&w=600&q=80' },
    ],
    restaurants: [
      { name: 'Dill Restaurant', cuisine: 'New Nordic Icelandic', priceLevel: '$$$', rating: 4.8 },
      { name: 'Nostra', cuisine: 'Contemporary', priceLevel: '$$$', rating: 4.7 },
      { name: 'Bæjarins Beztu Pylsur', cuisine: 'Icelandic Hot Dogs', priceLevel: '$', rating: 4.6 },
      { name: 'Fiskmarkaðurinn (Fish Market)', cuisine: 'Seafood', priceLevel: '$$$', rating: 4.7 },
      { name: 'Messinn', cuisine: 'Icelandic Seafood', priceLevel: '$$', rating: 4.6 },
    ],
    stays: [
      { name: 'Ion Adventure Hotel', priceRange: '$400–$900/night', rating: 4.7, location: 'Nesjavellir' },
      { name: 'Hotel Borg', priceRange: '$250–$600/night', rating: 4.7, location: 'Austurvöllur Square' },
      { name: 'Canopy by Hilton Reykjavik City Centre', priceRange: '$180–$400/night', rating: 4.5, location: 'City Centre' },
      { name: 'KEX Hostel', priceRange: '$35–$90/night', rating: 4.3, location: 'Mýrargata' },
      { name: 'Apotek Hotel', priceRange: '$200–$450/night', rating: 4.6, location: 'Austurstræti' },
    ],
  },
  Singapore: {
    places: [
      { name: 'Gardens by the Bay', description: 'A futuristic nature park featuring 18 Supertree towers, the Cloud Forest dome, and Flower Dome.', category: 'Park', image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=600&q=80' },
      { name: 'Marina Bay Sands SkyPark', description: 'The iconic three-tower hotel with a rooftop infinity pool and observation deck 200m above the city.', category: 'Monument', image: 'https://images.unsplash.com/photo-1467347689923-08e59bdc94fc?auto=format&fit=crop&w=600&q=80' },
      { name: 'Chinatown & Thian Hock Keng', description: 'Singapore\'s colourful Chinatown with the magnificent 1840s Hokkien temple and heritage shophouses.', category: 'Temple', image: 'https://images.unsplash.com/photo-1549918864-48ac978761a4?auto=format&fit=crop&w=600&q=80' },
      { name: 'Sentosa Island', description: 'A resort island with Universal Studios, beach clubs, and cable car rides off Singapore\'s southern coast.', category: 'Beach', image: 'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=600&q=80' },
      { name: 'Singapore Botanic Gardens', description: 'A UNESCO World Heritage tropical garden established in 1859, home to the National Orchid Garden.', category: 'Park', image: 'https://images.unsplash.com/photo-1547489432-cf93fa6c71ee?auto=format&fit=crop&w=600&q=80' },
    ],
    restaurants: [
      { name: 'Odette', cuisine: 'French', priceLevel: '$$$', rating: 4.9 },
      { name: 'Burnt Ends', cuisine: 'Modern Barbecue', priceLevel: '$$$', rating: 4.8 },
      { name: 'Maxwell Food Centre', cuisine: 'Hawker Centre', priceLevel: '$', rating: 4.7 },
      { name: 'Imperial Treasure Super Peking Duck', cuisine: 'Chinese', priceLevel: '$$$', rating: 4.7 },
      { name: 'Lau Pa Sat', cuisine: 'Hawker Centre', priceLevel: '$', rating: 4.5 },
    ],
    stays: [
      { name: 'Marina Bay Sands', priceRange: '$400–$1,000/night', rating: 4.7, location: 'Marina Bay' },
      { name: 'Capella Singapore', priceRange: '$600–$1,500/night', rating: 4.9, location: 'Sentosa Island' },
      { name: 'The Warehouse Hotel', priceRange: '$200–$500/night', rating: 4.7, location: 'Robertson Quay' },
      { name: 'Ibis Budget Singapore Clarke Quay', priceRange: '$60–$150/night', rating: 4.1, location: 'Clarke Quay' },
      { name: 'Raffles Singapore', priceRange: '$700–$2,000/night', rating: 4.8, location: 'City Hall' },
    ],
  },
  Lisbon: {
    places: [
      { name: 'Belém Tower', description: 'A 16th-century fortified tower on the Tagus estuary — a UNESCO symbol of Portugal\'s Age of Discovery.', category: 'Monument', image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=600&q=80' },
      { name: 'Jerónimos Monastery', description: 'A late Gothic Manueline masterpiece housing Vasco da Gama\'s tomb — a UNESCO World Heritage site.', category: 'Temple', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80' },
      { name: 'Alfama District & São Jorge Castle', description: 'Lisbon\'s oldest Moorish neighbourhood of Fado bars, tiled churches, and hilltop castle views.', category: 'Castle', image: 'https://images.unsplash.com/photo-1586102259932-c8b3ae2aa9b9?auto=format&fit=crop&w=600&q=80' },
      { name: 'Sintra Palace & Gardens', description: 'A fairy-tale town of Romanticist palaces and gardens in the cool hills 30km west of Lisbon.', category: 'Palace', image: 'https://images.unsplash.com/photo-1538332576228-eb5b4c4de6f5?auto=format&fit=crop&w=600&q=80' },
      { name: 'Time Out Market', description: 'Lisbon\'s iconic food hall in the Mercado da Ribeira, showcasing the best of Portuguese cuisine.', category: 'Market', image: 'https://images.unsplash.com/photo-1567359781514-3b964e2b04d6?auto=format&fit=crop&w=600&q=80' },
    ],
    restaurants: [
      { name: 'Belcanto', cuisine: 'Contemporary Portuguese', priceLevel: '$$$', rating: 4.8 },
      { name: 'Solar dos Presuntos', cuisine: 'Traditional Portuguese', priceLevel: '$$', rating: 4.7 },
      { name: 'Taberna da Rua das Flores', cuisine: 'Portuguese Petiscos', priceLevel: '$$', rating: 4.7 },
      { name: 'A Cevicheria', cuisine: 'Peruvian-Portuguese', priceLevel: '$$', rating: 4.7 },
      { name: 'Pastéis de Belém', cuisine: 'Portuguese Pastries', priceLevel: '$', rating: 4.8 },
    ],
    stays: [
      { name: 'Bairro Alto Hotel', priceRange: '$400–$900/night', rating: 4.8, location: 'Bairro Alto' },
      { name: 'Memmo Alfama', priceRange: '$200–$500/night', rating: 4.7, location: 'Alfama' },
      { name: 'The Independente Hostel & Suites', priceRange: '$25–$80/night', rating: 4.4, location: 'Bairro Alto' },
      { name: 'Palácio do Governador', priceRange: '$180–$400/night', rating: 4.6, location: 'Belém' },
      { name: 'LX Boutique Hotel', priceRange: '$120–$280/night', rating: 4.5, location: 'Cais do Sodré' },
    ],
  },
  Copenhagen: {
    places: [
      { name: 'Nyhavn Harbour', description: 'Copenhagen\'s most photographed canal lined with brightly coloured 17th and 18th-century townhouses.', category: 'Other', image: 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?auto=format&fit=crop&w=600&q=80' },
      { name: 'Tivoli Gardens', description: 'One of the world\'s oldest amusement parks (1843) with rides, gardens, and concert stages.', category: 'Park', image: 'https://images.unsplash.com/photo-1596815064285-8295fde7e37f?auto=format&fit=crop&w=600&q=80' },
      { name: 'The Little Mermaid', description: 'A small bronze statue based on Hans Christian Andersen\'s fairy tale, sitting on a rock in the harbour.', category: 'Monument', image: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?auto=format&fit=crop&w=600&q=80' },
      { name: 'Rosenborg Castle', description: 'A Renaissance castle housing the Danish Crown Jewels and the personal collections of Danish kings.', category: 'Castle', image: 'https://images.unsplash.com/photo-1558018542-f3c4e7f05823?auto=format&fit=crop&w=600&q=80' },
      { name: 'Louisiana Museum of Modern Art', description: 'Denmark\'s most visited art museum north of Copenhagen, overlooking the Øresund strait.', category: 'Museum', image: 'https://images.unsplash.com/photo-1580136579312-94651dfd596d?auto=format&fit=crop&w=600&q=80' },
    ],
    restaurants: [
      { name: 'Noma', cuisine: 'New Nordic', priceLevel: '$$$', rating: 4.9 },
      { name: 'Geranium', cuisine: 'New Nordic', priceLevel: '$$$', rating: 4.9 },
      { name: 'Torvehallerne Market', cuisine: 'Danish Market', priceLevel: '$', rating: 4.6 },
      { name: 'Restaurant Schønnemann', cuisine: 'Traditional Danish Smørrebrød', priceLevel: '$$', rating: 4.7 },
      { name: 'Höst', cuisine: 'New Nordic', priceLevel: '$$', rating: 4.7 },
    ],
    stays: [
      { name: 'Nimb Hotel', priceRange: '$500–$1,200/night', rating: 4.9, location: 'Tivoli Gardens' },
      { name: 'Hotel SP34', priceRange: '$200–$500/night', rating: 4.6, location: 'Latin Quarter' },
      { name: 'Copenhagen Island Hotel', priceRange: '$180–$400/night', rating: 4.5, location: 'Islands Brygge' },
      { name: 'Generator Copenhagen', priceRange: '$30–$90/night', rating: 4.3, location: 'Vesterbro' },
      { name: 'Hotel d\'Angleterre', priceRange: '$600–$1,500/night', rating: 4.8, location: 'Kongens Nytorv' },
    ],
  },
  // ─── India ───────────────────────────────────────────────────────────────────
  Mumbai: {
    places: [
      { name: 'Gateway of India', description: 'Iconic 1924 arch monument overlooking Mumbai Harbour, the city\'s most recognised landmark.', category: 'Monument', image: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&w=600&q=80' },
      { name: 'Elephanta Caves', description: 'UNESCO-listed rock-cut cave temples on an island dedicated to Lord Shiva, dating to the 5th century.', category: 'Temple', image: 'https://images.unsplash.com/photo-1582652839593-0c6d9de3e1b8?auto=format&fit=crop&w=600&q=80' },
      { name: 'Marine Drive', description: 'A 3.6km waterfront promenade along the Arabian Sea, glittering like a necklace of pearls at night.', category: 'Nature', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=600&q=80' },
      { name: 'Chhatrapati Shivaji Maharaj Terminus', description: 'A UNESCO World Heritage Victorian Gothic railway station, one of India\'s most photographed buildings.', category: 'Monument', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80' },
      { name: 'Dharavi', description: 'Asia\'s largest slum is a thriving economic hub with small industries, creative workshops, and incredible resilience.', category: 'Other', image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=600&q=80' },
    ],
    restaurants: [
      { name: 'Trishna', cuisine: 'Coastal Seafood', priceLevel: '$$$', rating: 4.8 },
      { name: 'Britannia & Co', cuisine: 'Parsi', priceLevel: '$', rating: 4.7 },
      { name: 'Bastian', cuisine: 'Seafood', priceLevel: '$$$', rating: 4.7 },
      { name: 'Bademiya', cuisine: 'Street Kebabs', priceLevel: '$', rating: 4.6 },
      { name: 'The Table', cuisine: 'Contemporary', priceLevel: '$$$', rating: 4.8 },
    ],
    stays: [
      { name: 'The Taj Mahal Palace', priceRange: '₹25,000–₹90,000/night', rating: 4.9, location: 'Colaba' },
      { name: 'The Oberoi Mumbai', priceRange: '₹20,000–₹60,000/night', rating: 4.8, location: 'Nariman Point' },
      { name: 'Trident Nariman Point', priceRange: '₹12,000–₹35,000/night', rating: 4.7, location: 'Nariman Point' },
      { name: 'Abode Bombay', priceRange: '₹5,000–₹12,000/night', rating: 4.5, location: 'Colaba' },
      { name: 'Zostel Mumbai', priceRange: '₹600–₹2,000/night', rating: 4.2, location: 'Bandra' },
    ],
  },
  Jaipur: {
    places: [
      { name: 'Amber Fort', description: 'A magnificent 16th-century fort palace perched on a hill, blending Rajput and Mughal architectural styles.', category: 'Castle', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=600&q=80' },
      { name: 'Hawa Mahal', description: 'The iconic Palace of Winds — a five-storey pink sandstone screen facade with 953 small windows.', category: 'Monument', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80' },
      { name: 'City Palace', description: 'A grand palace complex at the heart of Jaipur housing museums, courtyards, and the Chandra Mahal.', category: 'Palace', image: 'https://images.unsplash.com/photo-1519922639192-e73293ca430e?auto=format&fit=crop&w=600&q=80' },
      { name: 'Jantar Mantar', description: 'UNESCO-listed astronomical observatory built in 1734, containing the world\'s largest stone sundial.', category: 'Monument', image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80' },
      { name: 'Johari Bazaar', description: 'Jaipur\'s famous jewellery market, renowned for gemstones, Kundan jewellery, and traditional textiles.', category: 'Market', image: 'https://images.unsplash.com/photo-1606293459339-aa3e6f73b4e9?auto=format&fit=crop&w=600&q=80' },
    ],
    restaurants: [
      { name: '1135 AD', cuisine: 'Rajasthani Royal', priceLevel: '$$$', rating: 4.8 },
      { name: 'Laxmi Mishtan Bhandar', cuisine: 'Rajasthani Sweets', priceLevel: '$', rating: 4.7 },
      { name: 'Spice Court', cuisine: 'Rajasthani', priceLevel: '$$', rating: 4.6 },
      { name: 'Suvarna Mahal', cuisine: 'Indian Royal', priceLevel: '$$$', rating: 4.8 },
      { name: 'Tapri Central', cuisine: 'Chai & Snacks', priceLevel: '$', rating: 4.5 },
    ],
    stays: [
      { name: 'Rambagh Palace', priceRange: '₹30,000–₹1,20,000/night', rating: 4.9, location: 'Bhawani Singh Road' },
      { name: 'The Oberoi Rajvilas', priceRange: '₹35,000–₹1,00,000/night', rating: 4.9, location: 'Goner Road' },
      { name: 'Alsisar Haveli', priceRange: '₹4,000–₹12,000/night', rating: 4.6, location: 'Sansar Chandra Road' },
      { name: 'Pearl Palace Heritage', priceRange: '₹2,000–₹6,000/night', rating: 4.5, location: 'Hathroi Fort' },
      { name: 'Zostel Jaipur', priceRange: '₹500–₹1,800/night', rating: 4.3, location: 'Bani Park' },
    ],
  },
  Goa: {
    places: [
      { name: 'Baga Beach', description: 'Goa\'s most popular stretch of sand, famous for water sports, shacks, and vibrant nightlife.', category: 'Beach', image: 'https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?auto=format&fit=crop&w=600&q=80' },
      { name: 'Basilica of Bom Jesus', description: 'UNESCO World Heritage baroque church housing the mortal remains of St. Francis Xavier.', category: 'Temple', image: 'https://images.unsplash.com/photo-1587160813030-a1a09a99e487?auto=format&fit=crop&w=600&q=80' },
      { name: 'Dudhsagar Waterfalls', description: 'A spectacular four-tiered waterfall on the Mandovi River, one of India\'s tallest at 310m.', category: 'Nature', image: 'https://images.unsplash.com/photo-1625050326285-9b65daab0a49?auto=format&fit=crop&w=600&q=80' },
      { name: 'Fort Aguada', description: 'A 17th-century Portuguese fort and lighthouse at the junction of the Mandovi River and the Arabian Sea.', category: 'Castle', image: 'https://images.unsplash.com/photo-1567606404787-2b88cfe52b23?auto=format&fit=crop&w=600&q=80' },
      { name: 'Anjuna Flea Market', description: 'Goa\'s legendary Wednesday market selling handicrafts, clothing, spices, and souvenirs.', category: 'Market', image: 'https://images.unsplash.com/photo-1605283176568-9b41fde3672e?auto=format&fit=crop&w=600&q=80' },
    ],
    restaurants: [
      { name: 'Gunpowder', cuisine: 'South Indian', priceLevel: '$$', rating: 4.7 },
      { name: 'Fisherman\'s Wharf', cuisine: 'Goan Seafood', priceLevel: '$$', rating: 4.6 },
      { name: 'Café Sussegad', cuisine: 'Portuguese-Goan', priceLevel: '$$', rating: 4.7 },
      { name: 'Vinayak Family Restaurant', cuisine: 'Konkani', priceLevel: '$', rating: 4.5 },
      { name: 'Thalassa', cuisine: 'Greek-Goan', priceLevel: '$$$', rating: 4.8 },
    ],
    stays: [
      { name: 'Taj Exotica Goa', priceRange: '₹18,000–₹70,000/night', rating: 4.8, location: 'Benaulim Beach' },
      { name: 'W Goa', priceRange: '₹15,000–₹55,000/night', rating: 4.7, location: 'Vagator' },
      { name: 'Alila Diwa Goa', priceRange: '₹10,000–₹35,000/night', rating: 4.7, location: 'Majorda' },
      { name: 'The Postcard Cuelim', priceRange: '₹8,000–₹25,000/night', rating: 4.6, location: 'South Goa' },
      { name: 'Jungle Book Resort', priceRange: '₹2,500–₹8,000/night', rating: 4.4, location: 'Siolim' },
    ],
  },
  Ladakh: {
    places: [
      { name: 'Pangong Tso Lake', description: 'A breathtaking high-altitude salt lake straddling India and China, famous for its ever-changing blue hues.', category: 'Nature', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80' },
      { name: 'Thikse Monastery', description: 'A 12-storey gompa resembling the Potala Palace, housing a massive Maitreya Buddha statue.', category: 'Temple', image: 'https://images.unsplash.com/photo-1567619905200-c66b4d6cad4b?auto=format&fit=crop&w=600&q=80' },
      { name: 'Nubra Valley', description: 'A high-altitude cold desert valley with Bactrian camels, sand dunes, and the Siachen Glacier gateway.', category: 'Nature', image: 'https://images.unsplash.com/photo-1599930113854-d6d7fd521f10?auto=format&fit=crop&w=600&q=80' },
      { name: 'Leh Palace', description: 'A 17th-century nine-storey palace dominating the old town of Leh, modelled on the Potala Palace.', category: 'Palace', image: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=600&q=80' },
      { name: 'Magnetic Hill', description: 'A gravity-defying stretch of road where vehicles appear to roll uphill on their own due to an optical illusion.', category: 'Other', image: 'https://images.unsplash.com/photo-1607462109225-6b64ae2dd3cb?auto=format&fit=crop&w=600&q=80' },
    ],
    restaurants: [
      { name: 'The Tibetan Kitchen', cuisine: 'Tibetan', priceLevel: '$', rating: 4.6 },
      { name: 'Bon Appetit', cuisine: 'Continental & Indian', priceLevel: '$$', rating: 4.5 },
      { name: 'Gesmo Restaurant', cuisine: 'Tibetan & Ladakhi', priceLevel: '$', rating: 4.5 },
      { name: 'Lamayuru Restaurant', cuisine: 'Multi-cuisine', priceLevel: '$$', rating: 4.4 },
      { name: 'Open Hand Café', cuisine: 'Café & Bakery', priceLevel: '$', rating: 4.6 },
    ],
    stays: [
      { name: 'The Grand Dragon Ladakh', priceRange: '₹8,000–₹25,000/night', rating: 4.7, location: 'Leh City' },
      { name: 'Chamba Camp Thiksey', priceRange: '₹30,000–₹80,000/night', rating: 4.9, location: 'Thiksey' },
      { name: 'Hotel Stok Palace Heritage', priceRange: '₹6,000–₹18,000/night', rating: 4.6, location: 'Stok Village' },
      { name: 'Nimmu House', priceRange: '₹5,000–₹15,000/night', rating: 4.5, location: 'Nimmu' },
      { name: 'Zostel Leh', priceRange: '₹500–₹2,000/night', rating: 4.3, location: 'Old Town Leh' },
    ],
  },
  Shimla: {
    places: [
      { name: 'The Ridge', description: 'A large open space in the heart of Shimla offering panoramic views of the Himalayas and the town below.', category: 'Nature', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80' },
      { name: 'Jakhu Temple', description: 'A 2,455m hilltop temple dedicated to Lord Hanuman, with a 33m statue visible across Shimla.', category: 'Temple', image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=600&q=80' },
      { name: 'Viceregal Lodge', description: 'A stunning Victorian Gothic mansion that served as the residence of British Viceroys of India.', category: 'Monument', image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=600&q=80' },
      { name: 'Kufri', description: 'A popular hill station near Shimla offering skiing in winter and trekking with Himalayan views year-round.', category: 'Nature', image: 'https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?auto=format&fit=crop&w=600&q=80' },
      { name: 'Kalka–Shimla Toy Train', description: 'A UNESCO World Heritage narrow-gauge railway climbing 1,400m across 102 tunnels and 864 bridges.', category: 'Other', image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=600&q=80' },
    ],
    restaurants: [
      { name: 'Café Sol', cuisine: 'Continental', priceLevel: '$$', rating: 4.5 },
      { name: 'Himachali Rasoi', cuisine: 'Himachali', priceLevel: '$', rating: 4.6 },
      { name: 'Wake & Bake Café', cuisine: 'Café & Bakery', priceLevel: '$', rating: 4.5 },
      { name: 'Ashiana & Goofa', cuisine: 'Indian', priceLevel: '$$', rating: 4.4 },
      { name: 'Indian Coffee House', cuisine: 'South Indian', priceLevel: '$', rating: 4.3 },
    ],
    stays: [
      { name: 'Wildflower Hall, An Oberoi Resort', priceRange: '₹25,000–₹80,000/night', rating: 4.9, location: 'Mashobra' },
      { name: 'Oberoi Cecil', priceRange: '₹15,000–₹45,000/night', rating: 4.8, location: 'The Mall' },
      { name: 'Hotel Combermere', priceRange: '₹4,000–₹12,000/night', rating: 4.5, location: 'The Mall' },
      { name: 'Honeymoon Inn Shimla', priceRange: '₹3,000–₹9,000/night', rating: 4.4, location: 'Circular Road' },
      { name: 'Zostel Shimla', priceRange: '₹500–₹2,000/night', rating: 4.2, location: 'Near Ridge' },
    ],
  },
  Pondicherry: {
    places: [
      { name: 'French Quarter', description: 'The charming colonial enclave of mustard-yellow buildings, bougainvillea lanes, and café-lined streets.', category: 'Other', image: 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&w=600&q=80' },
      { name: 'Auroville', description: 'An experimental universal township and intentional community built around peace and human unity.', category: 'Other', image: 'https://images.unsplash.com/photo-1609768532378-9d7ca3d11c74?auto=format&fit=crop&w=600&q=80' },
      { name: 'Sri Aurobindo Ashram', description: 'A spiritual community founded in 1926 that draws thousands of seekers and meditators from across the world.', category: 'Temple', image: 'https://images.unsplash.com/photo-1604608672516-5cc2c4dbda5a?auto=format&fit=crop&w=600&q=80' },
      { name: 'Promenade Beach', description: 'A scenic 1.5km beachfront promenade perfect for morning walks, sunsets, and fresh seafood.', category: 'Beach', image: 'https://images.unsplash.com/photo-1589308454676-22e7a6f14c34?auto=format&fit=crop&w=600&q=80' },
      { name: 'Botanical Garden', description: 'A 22-hectare 19th-century French colonial garden with aquarium, fountain, and over 1,500 plant species.', category: 'Park', image: 'https://images.unsplash.com/photo-1557456170-0cf4f4d0d362?auto=format&fit=crop&w=600&q=80' },
    ],
    restaurants: [
      { name: 'Le Café', cuisine: 'French Café', priceLevel: '$', rating: 4.5 },
      { name: 'Satsanga', cuisine: 'French-Pondicherrian', priceLevel: '$$', rating: 4.6 },
      { name: 'Surguru', cuisine: 'South Indian', priceLevel: '$', rating: 4.7 },
      { name: 'Villa Shanti', cuisine: 'Contemporary French', priceLevel: '$$$', rating: 4.8 },
      { name: 'Baker Street', cuisine: 'Bakery & Café', priceLevel: '$', rating: 4.4 },
    ],
    stays: [
      { name: 'Palais de Mahe', priceRange: '₹8,000–₹25,000/night', rating: 4.8, location: 'French Quarter' },
      { name: 'Maison Perumal', priceRange: '₹5,000–₹15,000/night', rating: 4.7, location: 'Tamil Quarter' },
      { name: 'Le Dupleix', priceRange: '₹6,000–₹18,000/night', rating: 4.7, location: 'French Quarter' },
      { name: 'The Promenade', priceRange: '₹4,000–₹12,000/night', rating: 4.5, location: 'Beach Road' },
      { name: 'Kasha Ki Aasha', priceRange: '₹2,500–₹7,000/night', rating: 4.4, location: 'French Quarter' },
    ],
  },
  Kerala: {
    places: [
      { name: 'Alleppey Backwaters', description: 'A network of serene canals, lagoons, and lakes best explored on traditional kettuvallam houseboats.', category: 'Nature', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80' },
      { name: 'Munnar Tea Estates', description: 'Rolling hills carpeted with emerald tea plantations at 1,500m, dotted with colonial bungalows.', category: 'Nature', image: 'https://images.unsplash.com/photo-1599930113854-d6d7fd521f10?auto=format&fit=crop&w=600&q=80' },
      { name: 'Periyar Wildlife Sanctuary', description: 'A scenic tiger reserve and elephant habitat around the Periyar Lake, best explored by boat or trekking.', category: 'Nature', image: 'https://images.unsplash.com/photo-1551649001-7a2d79cd3c44?auto=format&fit=crop&w=600&q=80' },
      { name: 'Varkala Cliff Beach', description: 'Red laterite cliffs drop dramatically into the Arabian Sea at this spiritual beach town with mineral springs.', category: 'Beach', image: 'https://images.unsplash.com/photo-1527494232788-10e52bc6f193?auto=format&fit=crop&w=600&q=80' },
      { name: 'Fort Kochi', description: 'A historic harbour town with Dutch, Portuguese, and British heritage, Chinese fishing nets, and vibrant art cafés.', category: 'Monument', image: 'https://images.unsplash.com/photo-1590862786197-f0b5cf1dd05f?auto=format&fit=crop&w=600&q=80' },
    ],
    restaurants: [
      { name: 'Malabar Junction', cuisine: 'Kerala', priceLevel: '$$$', rating: 4.8 },
      { name: 'Dhe Puttu', cuisine: 'Traditional Kerala', priceLevel: '$', rating: 4.7 },
      { name: 'Fusion Bay', cuisine: 'Seafood', priceLevel: '$$', rating: 4.6 },
      { name: 'Saravana Bhavan', cuisine: 'South Indian Vegetarian', priceLevel: '$', rating: 4.5 },
      { name: 'The Rice Boat', cuisine: 'Kerala Seafood', priceLevel: '$$$', rating: 4.8 },
    ],
    stays: [
      { name: 'Kumarakom Lake Resort', priceRange: '₹15,000–₹60,000/night', rating: 4.9, location: 'Kumarakom' },
      { name: 'Spice Village CGH Earth', priceRange: '₹10,000–₹30,000/night', rating: 4.8, location: 'Thekkady' },
      { name: 'Coconut Lagoon CGH Earth', priceRange: '₹12,000–₹40,000/night', rating: 4.8, location: 'Kumarakom' },
      { name: 'Fragrant Nature Backwaters', priceRange: '₹5,000–₹15,000/night', rating: 4.5, location: 'Kollam' },
      { name: 'Zostel Kochi', priceRange: '₹500–₹2,000/night', rating: 4.3, location: 'Fort Kochi' },
    ],
  },
};

// ─── Seed function ────────────────────────────────────────────────────────────

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      Destination.deleteMany({}),
      Place.deleteMany({}),
      Restaurant.deleteMany({}),
      PropertyStay.deleteMany({}),
    ]);
    console.log('🗑  Cleared existing data');

    // Insert destinations
    const insertedDestinations = await Destination.insertMany(destinations);
    console.log(`📍 Inserted ${insertedDestinations.length} destinations`);

    // Build a name → _id map
    const idMap = {};
    insertedDestinations.forEach((d) => { idMap[d.name] = d._id; });

    // Insert sub-entities
    const places = [];
    const restaurants = [];
    const stays = [];

    for (const [name, data] of Object.entries(subEntities)) {
      const destinationId = idMap[name];
      if (!destinationId) {
        console.warn(`⚠️  No destination found for: ${name}`);
        continue;
      }
      data.places.forEach((p) => places.push({ ...p, destinationId }));
      data.restaurants.forEach((r) => restaurants.push({ ...r, destinationId }));
      data.stays.forEach((s) => stays.push({ ...s, destinationId }));
    }

    await Place.insertMany(places);
    await Restaurant.insertMany(restaurants);
    await PropertyStay.insertMany(stays);

    console.log(`🏛  Inserted ${places.length} places`);
    console.log(`🍽  Inserted ${restaurants.length} restaurants`);
    console.log(`🏨  Inserted ${stays.length} property stays`);
    console.log('✅ Seed complete');
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
};

seed();
