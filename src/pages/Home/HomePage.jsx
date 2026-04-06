// ===*Components*===
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Carousel from '../../components/Carousel/Carousel'
import ProductCard from '../../components/ProductCard/ProductCard'
import { fetchProducts } from '../../features/products/productSlice'


// ===*Home Page*===
export default function HomePage() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  return (
    <>
      {/* // ===*Carousel Page *=== */}
      <Carousel />

      {/* // ===*Product Cards*=== */}
      <ProductCard />

      {/* // ===*Sign - in components*=== */}

    </>
  )
}
