const image = (
  label,
  { size = '320x320', background = 'f6f7f8', color = '111111' } = {}
) =>
  `https://placehold.co/${size}/${background}/${color}?text=${encodeURIComponent(label)}`

const tile = (title, background, size = '280x280') => ({
  title,
  image: image(title, { size, background }),
})

const product = (title, background, badge) => ({
  title,
  image: image(title, { size: '260x260', background }),
  badge,
})

const slides = [
  {
    id: 1,
    image: '/src/assets/images/Hero1.png',
    title: 'Latest Electronics',
    description:
      'Discover the newest gadgets and tech innovations with exclusive deals.',
    buttonText: 'Shop Now',
  },
  {
    id: 2,
    image: '/src/assets/images/Hero2.png',
    title: 'Summer Fashion',
    description: 'Refresh your wardrobe with our latest summer collection.',
    buttonText: 'Shop Now',
  },
  {
    id: 3,
    image: '/src/assets/images/Hero3.png',
    title: 'Home & Kitchen',
    description: 'Upgrade your home with our premium kitchen appliances.',
    buttonText: 'Shop Now',
  },
  {
    id: 4,
    image: '/src/assets/images/Hero4.png',
    title: 'Fitness Equipment',
    description: 'Get fit at home with our range of exercise equipment.',
    buttonText: 'Shop Now',
  },
  {
    id: 5,
    image: '/src/assets/images/Hero5.jpg',
    title: 'Best Sellers',
    description:
      'Explore our collection of best-selling books across all genres.',
    buttonText: 'Shop Now',
  },
]

export const topCategories = [
  {
    title: 'Get your game on',
    linkText: 'See more',
    items: [
      tile('Gaming monitor', 'dbe7ff'),
      tile('Mechanical keyboard', 'f5ead6'),
      tile('Precision mouse', 'dff3ef'),
      tile('RGB headset', 'fce6eb'),
    ],
  },
  {
    title: 'Top categories in Kitchen appliances',
    linkText: 'Explore all products in Kitchen',
    items: [
      tile('Coffee machines', 'f6f4dc'),
      tile('Air fryers', 'fff1e0'),
      tile('Mixers', 'eaf4ff'),
      tile('Cookware sets', 'f7e4dc'),
    ],
  },
  {
    title: 'Shop Fashion for less',
    linkText: 'See more',
    items: [
      tile('Denim layers', 'f0f4ff'),
      tile('Bags & sneakers', 'ffe6ea'),
      tile('Easy dresses', 'e7f5ef'),
      tile('Jewelry picks', 'fff0da'),
    ],
  },
  {
    title: 'Find gifts for Mom',
    linkText: 'See more',
    items: [
      tile('Spa favorites', 'f9e7ef'),
      tile('Fragrance sets', 'eef4ff'),
      tile('Jewelry boxes', 'fff3df'),
      tile('Fresh florals', 'e8f7ef'),
    ],
  },
]

export const productCarousels = [
  {
    title: 'Popular products in PC internationally',
    products: [
      product('Tower desktop', 'eef4ff', 'intel Core i5'),
      product('Ergonomic mouse', 'fff2db'),
      product('Mini PC', 'e7f6f1'),
      product('Color monitor', 'fce7ec'),
      product('Laptop stand', 'eef1f6'),
      product('Keyboard bundle', 'fff7e8'),
      product('Creator tablet', 'f2ecff'),
    ],
  },
  {
    title: 'Popular products in Apparel internationally',
    products: [
      product('Classic denim jacket', 'eef4ff'),
      product('Soft straw hat', 'f8edd7'),
      product('Tailored blazer', 'e8eef8'),
      product('Pleated trousers', 'f4f6f7'),
      product('Everyday tee', 'fbe8ef'),
      product('Mini shoulder bag', 'fff2de'),
      product('Slip-on sneakers', 'edf7f2'),
    ],
  },
  {
    title: 'Trending Internationally: Top Picks',
    products: [
      product('Hydration tumbler', 'e8f5f2'),
      product('Desk figure set', 'fff3de'),
      product('Scented candle trio', 'fce8ef'),
      product('Phone tripod', 'edf2ff'),
      product('Graphic tee', 'dfefff'),
      product('Travel organizer', 'f4f0ff'),
      product('Pressed powder', 'fff4e5'),
    ],
  },
  {
    title: 'Popular products in Wireless internationally',
    products: [
      product('Noise-canceling earbuds', 'eef4ff'),
      product('Smart watch', 'fef0da'),
      product('Portable charger', 'e8f7ef'),
      product('Phone mount', 'f9e8ef'),
      product('Fitness tracker', 'edf2ff'),
      product('Charging dock', 'fff4e2'),
      product('Bluetooth speaker', 'e8eef7'),
    ],
  },
  {
    title: 'Best Sellers in Computers & Accessories',
    products: [
      product('USB-C hub', 'edf3ff'),
      product('Wireless keyboard', 'fff2df'),
      product('Pastel laptop sleeve', 'fce6ec'),
      product('Stylus pen', 'f4f6f8'),
      product('Curved display', 'e7f6f0'),
      product('Compact webcam', 'fef2e3'),
      product('Portable SSD', 'e9eef7'),
    ],
  },
  {
    title: 'Popular products in Beauty internationally',
    products: [
      product('Daily body lotion', 'eef7ff'),
      product('Glow serum duo', 'fff3e1'),
      product('Hair dryer', 'fce6ef'),
      product('Facial brush', 'edf7ef'),
      product('Tinted lip oil', 'fdeff3'),
      product('Vitamin C cleanser', 'eff4ff'),
      product('Body scrub', 'fff7e5'),
    ],
  },
  {
    title: 'Best Sellers in Beauty & Personal Care',
    products: [
      product('Sheet mask set', 'fbe8ee'),
      product('Daily moisturizer', 'eef4ff'),
      product('Electric toothbrush', 'e8f6f0'),
      product('Makeup remover pads', 'fff2df'),
      product('Mascara duo', 'f4efff'),
      product('Setting spray', 'eef7f3'),
      product('Nail care kit', 'fff7e7'),
    ],
  },
]

export const lifestyleRows = [
  {
    id: 'home-finds',
    items: [
      {
        title: 'Finds for Home',
        linkText: 'Discover more',
        items: [
          tile('Accent chairs', 'f2ecff'),
          tile('Storage baskets', 'fff2df'),
          tile('Wall mirrors', 'edf5ff'),
          tile('Table lamps', 'fbe9ef'),
        ],
      },
      {
        title: 'Gear up to get fit',
        linkText: 'Discover more',
        items: [
          tile('Yoga mats', 'eef7f3'),
          tile('Free weights', 'edf2ff'),
          tile('Running shoes', 'fff5e5'),
          tile('Recovery tools', 'ffe7ec'),
        ],
      },
      {
        title: 'Deals on top categories',
        linkText: 'Discover more',
        items: [
          tile('Beauty offers', 'ffe9f0'),
          tile('Tech markdowns', 'edf4ff'),
          tile('Home favorites', 'fef2dd'),
          tile('Kitchen picks', 'eef8f1'),
        ],
      },
      {
        title: 'Wireless Tech',
        linkText: 'Shop the latest',
        items: [
          tile('Portable speakers', 'eef4ff'),
          tile('Charging pads', 'fef0de'),
          tile('Wearables', 'e7f6ee'),
          tile('Phone cases', 'fce6ec'),
        ],
      },
    ],
  },
  {
    id: 'mixed-promo',
    items: [
      {
        title: 'Level up your PC here',
        linkText: 'Discover more',
        items: [
          tile('Processors', 'eef4ff'),
          tile('Graphics cards', 'fdf0df'),
          tile('Gaming chairs', 'fce6ed'),
          tile('Desk setups', 'e8f6f0'),
        ],
      },
      {
        title: 'Elevate your Electronics',
        linkText: 'Shop the Brand',
        items: [
          tile('Smart TVs', 'edf2ff'),
          tile('Projectors', 'fff3e2'),
          tile('Home audio', 'e7f7ef'),
          tile('Cameras', 'fde9ef'),
        ],
      },
      {
        title: 'New home arrivals under $50',
        linkText: 'Shop the latest',
        items: [
          tile('Candles', 'fce9ef'),
          tile('Throws', 'eef4ff'),
          tile('Kitchen tools', 'fff2de'),
          tile('Bath accessories', 'e8f6f0'),
        ],
      },
      {
        title: 'Most-loved travel essentials',
        linkText: 'See more',
        items: [
          tile('Packing cubes', 'eef7ff'),
          tile('Travel bottles', 'fdf0dc'),
          tile('Luggage tags', 'fce7ec'),
          tile('Neck pillows', 'edf7ef'),
        ],
      },
    ],
  },
  {
    id: 'beauty-home',
    items: [
      {
        title: 'Score the top PCs & Accessories',
        linkText: 'See more',
        items: [
          tile('Portable monitors', 'edf3ff'),
          tile('Gaming mice', 'fff4df'),
          tile('Desk microphones', 'e8f6f1'),
          tile('Laptop docks', 'fde8ef'),
        ],
      },
      {
        title: 'Level up your beauty routine',
        linkText: 'See items',
        items: [
          tile('Facial rollers', 'fce8ee'),
          tile('Lip care', 'fff4e2'),
          tile('Hair tools', 'eef4ff'),
          tile('Serum sets', 'edf8f0'),
        ],
      },
      {
        title: 'Shop for your home essentials',
        linkText: 'See more',
        items: [
          tile('Storage jars', 'fff2df'),
          tile('Laundry helpers', 'eef5ff'),
          tile('Entryway trays', 'e7f6ef'),
          tile('Pantry labels', 'fde9ef'),
        ],
      },
      {
        title: 'Discover these beauty products for you',
        linkText: 'See items',
        items: [
          tile('Brush sets', 'fce8ef'),
          tile('Body oils', 'fff1dc'),
          tile('Makeup palettes', 'edf4ff'),
          tile('Spa bundles', 'e8f7f0'),
        ],
      },
    ],
  },
]

export const footerColumns = [
  {
    title: 'Get to Know Us',
    links: [
      'About Amazon',
      'Careers',
      'Press Center',
      'Investor Relations',
      'Amazon Devices',
    ],
  },
  {
    title: 'Make Money with Us',
    links: [
      'Sell products on Amazon',
      'Sell on Amazon Business',
      'Become an Affiliate',
      'Advertise Your Products',
      'Host an Amazon Hub',
    ],
  },
  {
    title: 'Amazon Payment Products',
    links: [
      'Amazon Business Card',
      'Shop with Points',
      'Reload Your Balance',
      'Amazon Currency Converter',
    ],
  },
  {
    title: 'Let Us Help You',
    links: [
      'Your Account',
      'Your Orders',
      'Returns & Replacements',
      'Help',
      'Manage Your Content',
    ],
  },
]

export const footerServices = [
  { title: 'Amazon Music', description: 'Stream millions of songs' },
  {
    title: 'Amazon Ads',
    description: 'Reach customers wherever they spend time',
  },
  { title: 'IMDb', description: 'Movies, TV & Celebrities' },
  { title: 'Amazon Photos', description: 'Secure unlimited photo storage' },
  { title: 'Goodreads', description: 'Book reviews & recommendations' },
  { title: 'Shopbop', description: 'Designer fashion brands' },
  { title: 'Amazon Business', description: 'Everything for your business' },
  { title: 'Prime Video', description: 'Movies, TV, and sports' },
]

export const mockProducts = [
  {
    _id: 'p-1',
    title: 'EchoWave Noise Cancelling Headphones',
    brand: 'Amazon Audio',
    category: 'Electronics',
    price: 149.99,
    salePrice: 119.99,
    rating: 4.6,
    reviewsCount: 1823,
    stock: 18,
    description: 'Adaptive ANC headphones with all-day battery life.',
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    tags: ['prime', 'wireless'],
    featured: true,
  },
  {
    _id: 'p-2',
    title: 'Kindle Paperwhite Signature Edition',
    brand: 'Amazon Devices',
    category: 'Books & Media',
    price: 189.99,
    salePrice: 169.99,
    rating: 4.8,
    reviewsCount: 982,
    stock: 33,
    description: 'Glare-free reader with wireless charging and warm light.',
    image:
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
    tags: ['bestseller'],
    featured: true,
  },
  {
    _id: 'p-3',
    title: 'Smart Home Starter Kit',
    brand: 'Amazon Home',
    category: 'Smart Home',
    price: 249.99,
    salePrice: 219.99,
    rating: 4.4,
    reviewsCount: 441,
    stock: 12,
    description: 'Alexa-compatible hub, bulbs, and sensors bundle.',
    image:
      'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80',
    tags: ['smart-home'],
    featured: true,
  },
  {
    _id: 'p-4',
    title: 'Ergonomic Mesh Office Chair',
    brand: 'Basics Pro',
    category: 'Furniture',
    price: 299.99,
    salePrice: 259.99,
    rating: 4.5,
    reviewsCount: 703,
    stock: 6,
    description: 'Breathable office chair with lumbar support and headrest.',
    image:
      'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=800&q=80',
    tags: ['workspace'],
    featured: false,
  },
  {
    _id: 'p-5',
    title: '4K Streaming Monitor 32"',
    brand: 'Aurora Displays',
    category: 'Electronics',
    price: 429.99,
    salePrice: 389.99,
    rating: 4.7,
    reviewsCount: 513,
    stock: 9,
    description: '32-inch 4K panel built for work, streaming, and gaming.',
    image:
      'https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?auto=format&fit=crop&w=800&q=80',
    tags: ['4k'],
    featured: false,
  },
  {
    _id: 'p-6',
    title: 'Travel Weekender Duffel',
    brand: 'North Urban',
    category: 'Fashion',
    price: 89.99,
    salePrice: 69.99,
    rating: 4.2,
    reviewsCount: 201,
    stock: 24,
    description: 'Water-resistant duffel with dedicated laptop sleeve.',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    tags: ['travel'],
    featured: false,
  },
]

export const mockOrders = [
  {
    _id: 'ord-1001',
    createdAt: '2026-03-27T09:30:00.000Z',
    status: 'Delivered',
    totalAmount: 289.98,
    shippingAddress: {
      fullName: 'Sarah Connor',
      city: 'Seattle',
      state: 'WA',
      country: 'USA',
    },
    items: [
      {
        productId: 'p-1',
        title: 'EchoWave Noise Cancelling Headphones',
        quantity: 1,
        price: 119.99,
      },
      {
        productId: 'p-6',
        title: 'Travel Weekender Duffel',
        quantity: 2,
        price: 69.99,
      },
    ],
  },
]

export const mockUsers = [
  {
    _id: 'u-1',
    name: 'Sarah Connor',
    email: 'sarah@example.com',
    role: 'customer',
    isActive: true,
  },
  {
    _id: 'u-2',
    name: 'John Admin',
    email: 'admin@example.com',
    role: 'admin',
    isActive: true,
  },
]
