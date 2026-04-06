import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { createProduct, deleteProduct, fetchProducts, updateProduct } from '../features/products/productSlice'
import { addToast } from '../features/ui/uiSlice'
import { formatCurrency } from '../utils/helpers'

const emptyProduct = {
  title: '',
  brand: '',
  category: '',
  price: '',
  salePrice: '',
  stock: '',
  image: '',
  description: '',
}

export default function AdminProducts() {
  const dispatch = useAppDispatch()
  const { items, mutationStatus } = useAppSelector((state) => state.products)
  const [formData, setFormData] = useState(emptyProduct)
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  const handleSubmit = async (event) => {
    event.preventDefault()

    const payload = {
      ...formData,
      price: Number(formData.price),
      salePrice: Number(formData.salePrice),
      stock: Number(formData.stock),
    }

    const result = editingId
      ? await dispatch(updateProduct({ productId: editingId, payload }))
      : await dispatch(createProduct(payload))

    if (createProduct.fulfilled.match(result) || updateProduct.fulfilled.match(result)) {
      dispatch(
        addToast({
          title: editingId ? 'Product updated' : 'Product created',
          message: 'Catalog changes have been applied.',
          type: 'success',
        })
      )
      setFormData(emptyProduct)
      setEditingId(null)
    }
  }

  return (
    <div className="container page admin-layout">
      <section className="stack-card">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Admin catalog</span>
            <h1>Manage products</h1>
          </div>
          <p>Create, update, and remove products through RTK async mutations.</p>
        </div>

        <form className="form-grid" onSubmit={handleSubmit}>
          {Object.entries(formData).map(([key, value]) => (
            <label className="input-group" key={key}>
              <span>{key.replace(/([A-Z])/g, ' $1')}</span>
              {key === 'description' ? (
                <textarea
                  value={value}
                  onChange={(event) =>
                    setFormData((current) => ({ ...current, [key]: event.target.value }))
                  }
                />
              ) : (
                <input
                  value={value}
                  onChange={(event) =>
                    setFormData((current) => ({ ...current, [key]: event.target.value }))
                  }
                />
              )}
            </label>
          ))}

          <button className="primary-button" disabled={mutationStatus === 'loading'} type="submit">
            {editingId ? 'Update product' : 'Create product'}
          </button>
        </form>
      </section>

      <section className="stack-card">
        <div className="stack-list">
          {items.map((product) => (
            <article className="admin-row" key={product._id}>
              <div>
                <strong>{product.title}</strong>
                <p>
                  {product.category} • {formatCurrency(product.salePrice || product.price)}
                </p>
              </div>

              <div className="row-actions">
                <button
                  className="ghost-button"
                  type="button"
                  onClick={() => {
                    setEditingId(product._id)
                    setFormData({
                      title: product.title,
                      brand: product.brand,
                      category: product.category,
                      price: product.price,
                      salePrice: product.salePrice || product.price,
                      stock: product.stock,
                      image: product.image,
                      description: product.description,
                    })
                  }}
                >
                  Edit
                </button>
                <button
                  className="danger-button"
                  type="button"
                  onClick={() => dispatch(deleteProduct(product._id))}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
