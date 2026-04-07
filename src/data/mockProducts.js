const image = (
  label,
  {
    size = '320x320',
    background = 'f6f7f8',
    color = '111111',
  } = {}
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

export const heroSlides = [
  {
    eyebrow: 'Limited-time event',
    title: "Explore Mother's Day deals",
    description:
      'Discover thoughtful picks across beauty, home, fashion, and tech with fresh spring savings.',
    ctaText: 'Shop gift ideas',
    background: 'linear-gradient(90deg, #dbe6d2 0%, #f6d8e0 45%, #f2d0a7 100%)',
    images: [
      tile('Fresh bouquets', 'ffffff', '360x240'),
      tile('Gift bags', 'fde9e2', '360x240'),
      tile('Kitchen helpers', 'ffffff', '360x240'),
      tile('Beauty picks', 'fff2d8', '360x240'),
    ],
  },
  {
    eyebrow: 'Home refresh',
    title: 'Bring spring energy to every room',
    description:
      'Swap in warm neutrals, easy storage, and cheerful essentials for a lighter everyday setup.',
    ctaText: 'Browse home finds',
    background: 'linear-gradient(90deg, #d7ebf2 0%, #f5f2cf 45%, #f0d7c4 100%)',
    images: [
      tile('Decor accents', 'ffffff', '360x240'),
      tile('Cozy bedding', 'e9f4ff', '360x240'),
      tile('Entry storage', 'fff5de', '360x240'),
      tile('Coffee corner', 'ffffff', '360x240'),
    ],
  },
  {
    eyebrow: 'Trending now',
    title: 'International best sellers are here',
    description:
      'Scroll the most-loved picks in apparel, beauty, wireless tech, and computer accessories.',
    ctaText: 'See top picks',
    background: 'linear-gradient(90deg, #dbe4f4 0%, #f7e9d7 45%, #f1d6e5 100%)',
    images: [
      tile('Statement tees', 'ffffff', '360x240'),
      tile('Travel-ready beauty', 'fdf0f4', '360x240'),
      tile('Smart gadgets', 'ffffff', '360x240'),
      tile('Workstation upgrades', 'eef4ff', '360x240'),
    ],
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
    links: ['About Amazon', 'Careers', 'Press Center', 'Investor Relations', 'Amazon Devices'],
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
    links: ['Your Account', 'Your Orders', 'Returns & Replacements', 'Help', 'Manage Your Content'],
  },
]

export const footerServices = [
  { title: 'Amazon Music', description: 'Stream millions of songs' },
  { title: 'Amazon Ads', description: 'Reach customers wherever they spend time' },
  { title: 'IMDb', description: 'Movies, TV & Celebrities' },
  { title: 'Amazon Photos', description: 'Secure unlimited photo storage' },
  { title: 'Goodreads', description: 'Book reviews & recommendations' },
  { title: 'Shopbop', description: 'Designer fashion brands' },
  { title: 'Amazon Business', description: 'Everything for your business' },
  { title: 'Prime Video', description: 'Movies, TV, and sports' },
]
