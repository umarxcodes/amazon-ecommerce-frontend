import { Suspense, lazy } from 'react'
import CategoryCard from '../components/CategoryCard.jsx'
import Footer from '../components/Footer.jsx'
import HeroBanner from '../components/HeroBanner.jsx'
import LifestyleGrid from '../components/LifestyleGrid.jsx'
import ProductCarousel from '../components/ProductCarousel.jsx'
import {
  footerColumns,
  footerServices,
  heroSlides,
  lifestyleRows,
  productCarousels,
  topCategories,
} from '../data/mockProducts'

const Header = lazy(() => import('../components/Header/Header'))

export default function Home() {
  const [
    pcCarousel,
    apparelCarousel,
    trendingCarousel,
    wirelessCarousel,
    computersCarousel,
    beautyCarousel,
    bestBeautyCarousel,
  ] = productCarousels

  const [homeLifestyleRow, mixedPromoRow, beautyHomeRow] = lifestyleRows

  return (
    <div className="amazon-home">
      <Suspense fallback={null}>
        <Header />
      </Suspense>

      <main>
        <HeroBanner slides={heroSlides} />

        <div className="amazon-home__content amazon-home__content--lifted">
          <section className="amazon-home-shell amazon-card-grid" id="top-categories">
            {topCategories.map((card) => (
              <CategoryCard
                key={card.title}
                title={card.title}
                items={card.items}
                linkText={card.linkText}
              />
            ))}
          </section>

          <ProductCarousel title={pcCarousel.title} products={pcCarousel.products} />
          <ProductCarousel title={apparelCarousel.title} products={apparelCarousel.products} />
          <LifestyleGrid id={homeLifestyleRow.id} items={homeLifestyleRow.items} />
          <ProductCarousel title={trendingCarousel.title} products={trendingCarousel.products} />
          <LifestyleGrid id={mixedPromoRow.id} items={mixedPromoRow.items} />
          <ProductCarousel title={wirelessCarousel.title} products={wirelessCarousel.products} />
          <LifestyleGrid id={beautyHomeRow.id} items={beautyHomeRow.items} />
          <ProductCarousel title={computersCarousel.title} products={computersCarousel.products} />
          <ProductCarousel title={beautyCarousel.title} products={beautyCarousel.products} />
          <ProductCarousel
            title={bestBeautyCarousel.title}
            products={bestBeautyCarousel.products}
          />
        </div>
      </main>

      <Footer columns={footerColumns} services={footerServices} />
    </div>
  )
}
