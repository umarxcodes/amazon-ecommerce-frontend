// ===*BACKEND UPLOAD DATA - BANNERS & PRODUCTS*===
// This file contains ALL mock data ready for backend database upload
// Each section is clearly marked with comments for easy identification
// Images use Cloudinary URLs - replace with your actual Cloudinary URLs when ready
// Upload order: Categories → Banners → Products

// ============================================
// ===*BANNER DATA - Hero Slides (Homepage Carousel)*===
// ============================================
// Purpose: Main hero banner carousel on homepage
// Fields: eyebrow (tag), title, description, ctaText, background (gradient), images (4 tiles per slide)
// Upload to: /api/banners or /api/heroslides
// Total slides: 3

export const bannerData = [
  {
    _id: 'banner-001',
    eyebrow: 'Limited-time event',
    title: 'Celebrate Mom with gifts she’ll love',
    background: 'linear-gradient(90deg, #dbe6d2 0%, #f6d8e0 45%, #f2d0a7 100%)',
    isActive: true,
    sortOrder: 1,
    images: [
      {
        title: 'Fresh bouquets',
        image:
          'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/banner/mothers-day-bouquets.jpg', // Upload to Cloudinary: banner/mothers-day-bouquets.jpg
      },
      {
        title: 'Gift bags',
        image:
          'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/banner/mothers-day-gift-bags.jpg', // Upload to Cloudinary: banner/mothers-day-gift-bags.jpg
      },
      {
        title: 'Kitchen helpers',
        image:
          'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/banner/kitchen-helpers.jpg', // Upload to Cloudinary: banner/kitchen-helpers.jpg
      },
      {
        title: 'Beauty picks',
        image:
          'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/banner/beauty-picks.jpg', // Upload to Cloudinary: banner/beauty-picks.jpg
      },
    ],
  },
  {
    _id: 'banner-002',
    eyebrow: 'Home refresh',
    title: 'Bring spring energy to every room',
    description:
      'Swap in warm neutrals, easy storage, and cheerful essentials for a lighter everyday setup.',
    ctaText: 'Browse home finds',
    background: 'linear-gradient(90deg, #d7ebf2 0%, #f5f2cf 45%, #f0d7c4 100%)',
    isActive: true,
    sortOrder: 2,
    images: [
      {
        title: 'Decor accents',
        image:
          'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/banner/decor-accents.jpg', // Upload to Cloudinary: banner/decor-accents.jpg
      },
      {
        title: 'Cozy bedding',
        image:
          'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/banner/cozy-bedding.jpg', // Upload to Cloudinary: banner/cozy-bedding.jpg
      },
      {
        title: 'Entry storage',
        image:
          'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/banner/entry-storage.jpg', // Upload to Cloudinary: banner/entry-storage.jpg
      },
      {
        title: 'Coffee corner',
        image:
          'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/banner/coffee-corner.jpg', // Upload to Cloudinary: banner/coffee-corner.jpg
      },
    ],
  },
  {
    _id: 'banner-003',
    eyebrow: 'Trending now',
    title: 'International best sellers are here',
    description:
      'Scroll the most-loved picks in apparel, beauty, wireless tech, and computer accessories.',
    ctaText: 'See top picks',
    background: 'linear-gradient(90deg, #dbe4f4 0%, #f7e9d7 45%, #f1d6e5 100%)',
    isActive: true,
    sortOrder: 3,
    images: [
      {
        image:
          'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/banner/statement-tees.jpg', // Upload to Cloudinary: banner/statement-tees.jpg
      },
      {
        title: 'Travel-ready beauty',
        image:
          'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/banner/travel-ready-beauty.jpg', // Upload to Cloudinary: banner/travel-ready-beauty.jpg
      },
      {
        image:
          'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/banner/smart-gadgets.jpg', // Upload to Cloudinary: banner/smart-gadgets.jpg
      },
      {
        image:
          'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/banner/workstation-upgrades.jpg', // Upload to Cloudinary: banner/workstation-upgrades.jpg
      },
    ],
  },
]

// ============================================
// ===*CATEGORY DATA - Top Categories (Homepage Cards)*===
// ============================================
// Purpose: Category cards displayed on homepage
// Fields: title, linkText, items (4 tiles per category)
// Upload to: /api/categories
// Total categories: 4

export const categoryData = [
  {
    _id: 'cat-001',
    title: 'Get your game on',
    linkText: 'See more',
    sortOrder: 1,
    isActive: true,
    items: [
      {
        title: 'Gaming monitor',
        image:
          'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/categories/gaming-monitor.jpg', // Upload to Cloudinary: categories/gaming-monitor.jpg
      },
      {
        title: 'Mechanical keyboard',
        image:
          'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/categories/mechanical-keyboard.jpg', // Upload to Cloudinary: categories/mechanical-keyboard.jpg
      },
      {
        title: 'Precision mouse',
        image:
          'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/categories/precision-mouse.jpg', // Upload to Cloudinary: categories/precision-mouse.jpg
      },
      {
        title: 'RGB headset',
        image:
          'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/categories/rgb-headset.jpg', // Upload to Cloudinary: categories/rgb-headset.jpg
      },
    ],
  },
  {
    _id: 'cat-002',
    title: 'Top categories in Kitchen appliances',
    linkText: 'Explore all products in Kitchen',
    sortOrder: 2,
    isActive: true,
    items: [
      {
        title: 'Coffee machines',
        image:
          'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/categories/coffee-machines.jpg', // Upload to Cloudinary: categories/coffee-machines.jpg
      },
      {
        title: 'Air fryers',
        image:
          'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/categories/air-fryers.jpg', // Upload to Cloudinary: categories/air-fryers.jpg
      },
      {
        title: 'Mixers',
        image:
          'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/categories/mixers.jpg', // Upload to Cloudinary: categories/mixers.jpg
      },
      {
        title: 'Cookware sets',
        image:
          'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/categories/cookware-sets.jpg', // Upload to Cloudinary: categories/cookware-sets.jpg
      },
    ],
  },
  {
    _id: 'cat-003',
    title: 'Shop Fashion for less',
    linkText: 'See more',
    sortOrder: 3,
    isActive: true,
    items: [
      {
        title: 'Denim layers',
        image:
          'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/categories/denim-layers.jpg', // Upload to Cloudinary: categories/denim-layers.jpg
      },
      {
        title: 'Bags & sneakers',
        image:
          'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/categories/bags-sneakers.jpg', // Upload to Cloudinary: categories/bags-sneakers.jpg
      },
      {
        title: 'Easy dresses',
        image:
          'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/categories/easy-dresses.jpg', // Upload to Cloudinary: categories/easy-dresses.jpg
      },
      {
        title: 'Jewelry picks',
        image:
          'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/categories/jewelry-picks.jpg', // Upload to Cloudinary: categories/jewelry-picks.jpg
      },
    ],
  },
  {
    _id: 'cat-004',
    title: 'Find gifts for Mom',
    linkText: 'See more',
    sortOrder: 4,
    isActive: true,
    items: [
      {
        title: 'Spa favorites',
        image:
          'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/categories/spa-favorites.jpg', // Upload to Cloudinary: categories/spa-favorites.jpg
      },
      {
        title: 'Fragrance sets',
        image:
          'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/categories/fragrance-sets.jpg', // Upload to Cloudinary: categories/fragrance-sets.jpg
      },
      {
        title: 'Jewelry boxes',
        image:
          'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/categories/jewelry-boxes.jpg', // Upload to Cloudinary: categories/jewelry-boxes.jpg
      },
      {
        title: 'Fresh florals',
        image:
          'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/categories/fresh-florals.jpg', // Upload to Cloudinary: categories/fresh-florals.jpg
      },
    ],
  },
]

// ============================================
// ===*PRODUCT DATA - Full Products for Database*===
// ============================================
// Purpose: Complete product catalog for database
// Fields: title, brand, category, price, salePrice, rating, reviewsCount, stock, description, images, tags, featured, isActive
// Upload to: /api/products (bulk upload)
// Total products: 6 (expand as needed)

export const productData = [
  {
    _id: 'prod-001',
    title: 'EchoWave Noise Cancelling Headphones',
    brand: 'Amazon Audio',
    category: 'Electronics',
    subcategory: 'Audio & Headphones',
    price: 149.99,
    salePrice: 119.99,
    rating: 4.6,
    reviewsCount: 1823,
    stock: 18,
    description:
      'Adaptive ANC headphones with all-day battery life. Features premium comfort cushions and 40-hour battery life with quick charge support.',
    sku: 'EWH-NC-001',
    isActive: true,
    featured: true,
    tags: ['prime', 'wireless', 'noise-cancelling'],
    images: {
      primary:
        'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/products/echowave-headphones-primary.jpg', // Upload: products/echowave-headphones-primary.jpg
      gallery: [
        'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/products/echowave-headphones-angle1.jpg', // Upload: products/echowave-headphones-angle1.jpg
        'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/products/echowave-headphones-angle2.jpg', // Upload: products/echowave-headphones-angle2.jpg
        'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/products/echowave-headphones-detail.jpg', // Upload: products/echowave-headphones-detail.jpg
      ],
    },
    specifications: {
      batteryLife: '40 hours',
      connectivity: 'Bluetooth 5.2',
      weight: '250g',
      color: 'Black',
    },
  },
  {
    _id: 'prod-002',
    title: 'Kindle Paperwhite Signature Edition',
    brand: 'Amazon Devices',
    category: 'Books & Media',
    subcategory: 'E-Readers',
    price: 189.99,
    salePrice: 169.99,
    rating: 4.8,
    reviewsCount: 982,
    stock: 33,
    description:
      'Glare-free reader with wireless charging and warm light. Waterproof design with adjustable warm light for comfortable reading day or night.',
    sku: 'KDL-PW-SIG',
    isActive: true,
    featured: true,
    tags: ['bestseller', 'prime', 'waterproof'],
    images: {
      primary:
        'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/products/kindle-paperwhite-primary.jpg', // Upload: products/kindle-paperwhite-primary.jpg
      gallery: [
        'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/products/kindle-paperwhite-angle1.jpg', // Upload: products/kindle-paperwhite-angle1.jpg
        'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/products/kindle-paperwhite-screen.jpg', // Upload: products/kindle-paperwhite-screen.jpg
        'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/products/kindle-paperwhite-charging.jpg', // Upload: products/kindle-paperwhite-charging.jpg
      ],
    },
    specifications: {
      storage: '32 GB',
      screen: '6.8 inch',
      waterproof: 'IPX8',
      batteryLife: '10 weeks',
    },
  },
  {
    _id: 'prod-003',
    title: 'Smart Home Starter Kit',
    brand: 'Amazon Home',
    category: 'Smart Home',
    subcategory: 'Smart Home Kits',
    price: 249.99,
    salePrice: 219.99,
    rating: 4.4,
    reviewsCount: 441,
    stock: 12,
    description:
      'Alexa-compatible hub, bulbs, and sensors bundle. Includes smart hub, 4 color bulbs, motion sensor, and door/window sensor for complete home automation.',
    sku: 'SHS-START-001',
    isActive: true,
    featured: true,
    tags: ['smart-home', 'alexa', 'bundle'],
    images: {
      primary:
        'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/products/smart-home-kit-primary.jpg', // Upload: products/smart-home-kit-primary.jpg
      gallery: [
        'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/products/smart-home-kit-hub.jpg', // Upload: products/smart-home-kit-hub.jpg
        'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/products/smart-home-kit-bulbs.jpg', // Upload: products/smart-home-kit-bulbs.jpg
        'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/products/smart-home-kit-sensors.jpg', // Upload: products/smart-home-kit-sensors.jpg
      ],
    },
    specifications: {
      hubConnectivity: 'WiFi, Zigbee, Z-Wave',
      bulbsIncluded: '4',
      voiceControl: 'Alexa, Google Home',
      warranty: '2 years',
    },
  },
  {
    _id: 'prod-004',
    title: 'Ergonomic Mesh Office Chair',
    brand: 'Basics Pro',
    category: 'Furniture',
    subcategory: 'Office Chairs',
    price: 299.99,
    salePrice: 259.99,
    rating: 4.5,
    reviewsCount: 703,
    stock: 6,
    description:
      'Breathable office chair with lumbar support and headrest. Adjustable armrests, seat depth, and tilt tension for all-day comfort.',
    sku: 'ERG-CHR-MESH',
    isActive: true,
    featured: false,
    tags: ['workspace', 'ergonomic', 'adjustable'],
    images: {
      primary:
        'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/products/ergonomic-chair-primary.jpg', // Upload: products/ergonomic-chair-primary.jpg
      gallery: [
        'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/products/ergonomic-chair-side.jpg', // Upload: products/ergonomic-chair-side.jpg
        'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/products/ergonomic-chair-back.jpg', // Upload: products/ergonomic-chair-back.jpg
        'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/products/ergonomic-chair-detail.jpg', // Upload: products/ergonomic-chair-detail.jpg
      ],
    },
    specifications: {
      maxWeight: '150 kg',
      material: 'Mesh + Aluminum',
      armrests: '4D Adjustable',
      warranty: '5 years',
    },
  },
  {
    _id: 'prod-005',
    title: '4K Streaming Monitor 32"',
    brand: 'Aurora Displays',
    category: 'Electronics',
    subcategory: 'Monitors',
    price: 429.99,
    salePrice: 389.99,
    rating: 4.7,
    reviewsCount: 513,
    stock: 9,
    description:
      '32-inch 4K panel built for work, streaming, and gaming. HDR600 support, USB-C connectivity, and built-in speakers for versatile use.',
    sku: 'AUR-4K-32',
    isActive: true,
    featured: false,
    tags: ['4k', 'hdr', 'gaming'],
    images: {
      primary:
        'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/products/4k-monitor-primary.jpg', // Upload: products/4k-monitor-primary.jpg
      gallery: [
        'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/products/4k-monitor-angle.jpg', // Upload: products/4k-monitor-angle.jpg
        'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/products/4k-monitor-ports.jpg', // Upload: products/4k-monitor-ports.jpg
        'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/products/4k-monitor-display.jpg', // Upload: products/4k-monitor-display.jpg
      ],
    },
    specifications: {
      resolution: '3840x2160',
      refreshRate: '144Hz',
      responseTime: '1ms',
      connectivity: 'USB-C, HDMI 2.1, DisplayPort',
    },
  },
  {
    _id: 'prod-006',
    title: 'Travel Weekender Duffel',
    brand: 'North Urban',
    category: 'Fashion',
    subcategory: 'Bags & Luggage',
    price: 89.99,
    salePrice: 69.99,
    rating: 4.2,
    reviewsCount: 201,
    stock: 24,
    description:
      'Water-resistant duffel with dedicated laptop sleeve. Perfect for weekend trips with multiple compartments and shoe pocket.',
    sku: 'NU-DUFFEL-WKND',
    isActive: true,
    featured: false,
    tags: ['travel', 'waterproof', 'laptop'],
    images: {
      primary:
        'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/products/travel-duffel-primary.jpg', // Upload: products/travel-duffel-primary.jpg
      gallery: [
        'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/products/travel-duffel-open.jpg', // Upload: products/travel-duffel-open.jpg
        'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/products/travel-duffel-side.jpg', // Upload: products/travel-duffel-side.jpg
        'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/products/travel-duffel-detail.jpg', // Upload: products/travel-duffel-detail.jpg
      ],
    },
    specifications: {
      capacity: '45L',
      material: 'Water-resistant Nylon',
      laptopSize: 'Up to 15.6"',
      warranty: '1 year',
    },
  },
]

// ============================================
// ===*CAROUSEL DATA - Product Carousels for Homepage*===
// ============================================
// Purpose: Product carousel sections on homepage
// Maps to existing productData above using product IDs
// Upload to: /api/carousels or reference productData directly

export const carouselData = [
  {
    _id: 'carousel-001',
    title: 'Popular products in PC internationally',
    sortOrder: 1,
    isActive: true,
    productIds: ['prod-005', 'prod-001', 'prod-003', 'prod-004'], // Reference product IDs from productData
  },
  {
    _id: 'carousel-002',
    title: 'Popular products in Apparel internationally',
    sortOrder: 2,
    isActive: true,
    productIds: [], // Add product IDs when apparel products are added
  },
  {
    _id: 'carousel-003',
    title: 'Trending Internationally: Top Picks',
    sortOrder: 3,
    isActive: true,
    productIds: ['prod-002', 'prod-006', 'prod-001'],
  },
  {
    _id: 'carousel-004',
    title: 'Popular products in Wireless internationally',
    sortOrder: 4,
    isActive: true,
    productIds: ['prod-001', 'prod-003'],
  },
  {
    _id: 'carousel-005',
    title: 'Best Sellers in Computers & Accessories',
    sortOrder: 5,
    isActive: true,
    productIds: ['prod-005', 'prod-003', 'prod-004'],
  },
]

// ============================================
// ===*PROMOTIONAL BANNER ROWS - Lifestyle/Marketing Rows*===
// ============================================
// Purpose: Promotional banner rows between product sections
// Upload to: /api/promo-banners
// Total rows: 3 layouts with 4 items each

export const promoBannerData = [
  {
    _id: 'promo-001',
    sectionId: 'home-finds',
    sortOrder: 1,
    isActive: true,
    banners: [
      {
        title: 'Finds for Home',
        linkText: 'Discover more',
        linkUrl: '/home-decor',
        items: [
          {
            title: 'Accent chairs',
            image:
              'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/promo/accent-chairs.jpg', // Upload: promo/accent-chairs.jpg
          },
          {
            title: 'Storage baskets',
            image:
              'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/promo/storage-baskets.jpg', // Upload: promo/storage-baskets.jpg
          },
          {
            title: 'Wall mirrors',
            image:
              'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/promo/wall-mirrors.jpg', // Upload: promo/wall-mirrors.jpg
          },
          {
            title: 'Table lamps',
            image:
              'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/promo/table-lamps.jpg', // Upload: promo/table-lamps.jpg
          },
        ],
      },
      {
        title: 'Gear up to get fit',
        linkText: 'Discover more',
        linkUrl: '/fitness',
        items: [
          {
            title: 'Yoga mats',
            image:
              'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/promo/yoga-mats.jpg', // Upload: promo/yoga-mats.jpg
          },
          {
            title: 'Free weights',
            image:
              'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/promo/free-weights.jpg', // Upload: promo/free-weights.jpg
          },
          {
            title: 'Running shoes',
            image:
              'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/promo/running-shoes.jpg', // Upload: promo/running-shoes.jpg
          },
          {
            title: 'Recovery tools',
            image:
              'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/promo/recovery-tools.jpg', // Upload: promo/recovery-tools.jpg
          },
        ],
      },
      {
        title: 'Deals on top categories',
        linkText: 'Discover more',
        linkUrl: '/deals',
        items: [
          {
            title: 'Beauty offers',
            image:
              'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/promo/beauty-offers.jpg', // Upload: promo/beauty-offers.jpg
          },
          {
            title: 'Tech markdowns',
            image:
              'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/promo/tech-markdowns.jpg', // Upload: promo/tech-markdowns.jpg
          },
          {
            title: 'Home favorites',
            image:
              'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/promo/home-favorites.jpg', // Upload: promo/home-favorites.jpg
          },
          {
            title: 'Kitchen picks',
            image:
              'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/promo/kitchen-picks.jpg', // Upload: promo/kitchen-picks.jpg
          },
        ],
      },
      {
        title: 'Wireless Tech',
        linkText: 'Shop the latest',
        linkUrl: '/wireless',
        items: [
          {
            title: 'Portable speakers',
            image:
              'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/promo/portable-speakers.jpg', // Upload: promo/portable-speakers.jpg
          },
          {
            title: 'Charging pads',
            image:
              'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/promo/charging-pads.jpg', // Upload: promo/charging-pads.jpg
          },
          {
            title: 'Wearables',
            image:
              'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/promo/wearables.jpg', // Upload: promo/wearables.jpg
          },
          {
            title: 'Phone cases',
            image:
              'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/promo/phone-cases.jpg', // Upload: promo/phone-cases.jpg
          },
        ],
      },
    ],
  },
]

// ============================================
// ===*UPLOAD ROADMAP - Step by Step Guide*===
// ============================================
/*

PHASE 1: CLOUDINARY IMAGE UPLOAD
=================================
Step 1: Create Cloudinary Account
  - Go to https://cloudinary.com
  - Sign up for free account
  - Get your CLOUD_NAME from dashboard

Step 2: Organize Image Files Locally
  Create folder structure:
  └── images/
      ├── banner/           (12 images - 3 banners × 4 images each)
      ├── categories/       (16 images - 4 categories × 4 items each)
      ├── products/         (24 images - 6 products × 4 images each)
      └── promo/            (16 images - promotional rows)
      Total: ~68 images

Step 3: Upload to Cloudinary
  Option A: Manual Upload via Cloudinary Dashboard
    - Go to Media Library
    - Create folders: banner, categories, products, promo
    - Upload images to respective folders
    - Copy public URLs for each image

  Option B: Cloudinary Upload API (Recommended for bulk)
    - Use Cloudinary Upload Widget
    - Or use API: POST https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload
    - Use folder parameter to organize: { folder: 'products' }

Step 4: Replace Placeholder URLs
  - Search & replace: YOUR_CLOUD_NAME → your actual Cloudinary name
  - Update all image URLs in this file
  - Test URLs in browser to confirm images load

PHASE 2: BACKEND API SETUP
============================
Step 5: Create Backend Models (MongoDB/Mongoose)
  Models needed:
  - Banner (heroSlides)
  - Category (topCategories)
  - Product (product catalog)
  - PromoBanner (lifestyle rows)
  - Carousel (product carousels)

Step 6: Create Backend API Endpoints
  POST   /api/banners/bulk          (upload all banners)
  POST   /api/categories/bulk       (upload all categories)
  POST   /api/products/bulk         (upload all products)
  POST   /api/carousels/bulk        (upload carousel config)
  POST   /api/promo-banners/bulk    (upload promo banners)

  GET    /api/banners               (fetch banners)
  GET    /api/categories            (fetch categories)
  GET    /api/products              (fetch products)
  GET    /api/products/:id          (fetch single product)
  GET    /api/carousels             (fetch carousels)
  GET    /api/promo-banners         (fetch promo banners)

Step 7: Add Authentication (if needed)
  - Protect POST endpoints with admin auth
  - Use JWT tokens for admin users

PHASE 3: BULK UPLOAD TO DATABASE
==================================
Step 8: Create Upload Script (Node.js/Express)
  Create file: backend/scripts/seedData.js

  Example structure:
  ```javascript
  import { productData } from '../data/productData.js';
  import Product from '../models/Product.js';

  async function seedProducts() {
    try {
      // Clear existing data
      await Product.deleteMany({});

      // Bulk insert
      await Product.insertMany(productData);
      console.log('✅ Products uploaded successfully');
    } catch (error) {
      console.error('❌ Upload failed:', error);
    }
  }

  seedProducts();
  ```

Step 9: Run Upload Script
  bash
  cd backend
  node scripts/seedData.js

Step 10: Verify Upload
  - Check database directly (MongoDB Compass)
  - Or test with GET endpoints
  - Verify all images load correctly

PHASE 4: FRONTEND INTEGRATION
===============================
Step 11: Create API Service Functions
  Create file: src/services/bannerService.js
  Create file: src/services/productService.js

  Example:
  ```javascript
  const API_URL = import.meta.env.VITE_API_URL;

  export const fetchBanners = async () => {
    const response = await fetch(`${API_URL}/api/banners`);
    return response.json();
  };

  export const fetchProducts = async () => {
    const response = await fetch(`${API_URL}/api/products`);
    return response.json();
  };
  ```

Step 12: Update Redux Slices
  - Modify productSlice.js to fetch from API
  - Create bannerSlice.js for banners
  - Update components to use Redux state

Step 13: Update Components
  - HeroBanner.jsx → fetch from bannerData API
  - ProductCarousel.jsx → fetch from productData API
  - Category cards → fetch from categoryData API

Step 14: Add Loading & Error States
  - Show skeletons while fetching
  - Handle errors gracefully
  - Add retry logic

PHASE 5: TESTING & DEPLOYMENT
===============================
Step 15: Test Everything
  ✓ All images load from Cloudinary
  ✓ All products display correctly
  ✓ Banners rotate properly
  ✓ Carousels scroll smoothly
  ✓ Mobile responsive
  ✓ No console errors

Step 16: Environment Variables
  Create .env file:
  VITE_API_URL=http://localhost:5000
  VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name

Step 17: Deploy
  Frontend: Vercel/Netlify
  Backend: Render/Railway/Heroku
  Database: MongoDB Atlas
  Images: Cloudinary (already done)

TIMELINE ESTIMATE:
==================
Phase 1 (Images):      2-3 hours
Phase 2 (Backend):     3-4 hours
Phase 3 (Upload):      1 hour
Phase 4 (Integration): 3-4 hours
Phase 5 (Testing):     2 hours
Total:                 ~12-14 hours

NEXT STEPS:
===========
1. ✅ Review this data file
2. 📸 Upload images to Cloudinary
3. 🗄️ Set up backend models & endpoints
4. 📤 Run bulk upload script
5. 🔗 Connect frontend to API
6. 🧪 Test everything
7. 🚀 Deploy!

*/

// ============================================
// ===*EXPORT SUMMARY*===
// ============================================
// Use these exports in your upload script

export const allData = {
  banners: bannerData, // 3 hero slides
  categories: categoryData, // 4 category cards
  products: productData, // 6 products
  carousels: carouselData, // 5 carousels
  promoBanners: promoBannerData, // 1 promo section
}

// Quick stats
export const dataStats = {
  totalBanners: bannerData.length,
  totalCategories: categoryData.length,
  totalProducts: productData.length,
  totalCarousels: carouselData.length,
  totalPromoSections: promoBannerData.length,
  totalImages: '68 images (upload to Cloudinary first)',
}
