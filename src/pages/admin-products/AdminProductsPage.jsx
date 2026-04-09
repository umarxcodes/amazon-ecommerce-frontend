import { useEffect, useState } from 'react'
import {
  useAppDispatch,
  useProducts,
  useProductStatus,
  useProductMutationStatus,
  useCreateAdmin,
} from '../../hooks'
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../../features/products/productSlice'
import { addToast } from '../../features/ui/uiSlice'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import EmptyState from '../../components/ui/EmptyState'
import { formatCurrency } from '../../utils/helpers'
import Button from '../../components/ui/Button'
import './AdminPage.css'

export default function AdminProductsPage() {
  const dispatch = useAppDispatch()
  const products = useProducts()
  const status = useProductStatus()
  const mutationStatus = useProductMutationStatus()
  const [modal, setModal] = useState(null) // 'add' | 'edit' | null
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({
    title: '',
    price: '',
    category: '',
    image: '',
    description: '',
  })

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  const openAdd = () => {
    setForm({ title: '', price: '', category: '', image: '', description: '' })
    setModal('add')
  }
  const openEdit = (p) => {
    setForm({
      title: p.title,
      price: p.price,
      category: p.category,
      image: p.image,
      description: p.description,
    })
    setEditId(p._id)
    setModal('edit')
  }
  const close = () => {
    setModal(null)
    setEditId(null)
  }

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = { ...form, price: Number(form.price) }
    let result
    if (modal === 'add') result = await dispatch(createProduct(payload))
    else result = await dispatch(updateProduct({ id: editId, ...payload }))
    if (
      createProduct.fulfilled.match(result) ||
      updateProduct.fulfilled.match(result)
    ) {
      dispatch(
        addToast({
          title: 'Success',
          message: `Product ${modal === 'add' ? 'created' : 'updated'}.`,
          type: 'success',
        })
      )
      close()
    } else {
      dispatch(
        addToast({
          title: 'Failed',
          message: result.payload || 'Could not save product.',
          type: 'error',
        })
      )
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return
    const result = await dispatch(deleteProduct(id))
    if (deleteProduct.fulfilled.match(result))
      dispatch(
        addToast({
          title: 'Deleted',
          message: 'Product removed.',
          type: 'info',
        })
      )
    else
      dispatch(
        addToast({
          title: 'Failed',
          message: result.payload || 'Could not delete.',
          type: 'error',
        })
      )
  }

  if (status === 'loading')
    return <LoadingSpinner label="Loading products..." fullScreen />

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h1>Manage Products</h1>
        <Button variant="primary" onClick={openAdd}>
          Add Product
        </Button>
      </div>

      {products.length === 0 ? (
        <EmptyState
          title="No products"
          description="Add your first product."
          action={
            <Button variant="primary" onClick={openAdd}>
              Add Product
            </Button>
          }
        />
      ) : (
        <div className="admin-table">
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>
                    <img
                      src={p.image || 'https://placehold.co/40x40'}
                      alt=""
                      className="admin-table__img"
                    />
                  </td>
                  <td>{p.title}</td>
                  <td>{p.category}</td>
                  <td>{formatCurrency(p.price)}</td>
                  <td>{p.stock ?? '—'}</td>
                  <td className="admin-table__actions">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEdit(p)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(p._id)}
                      disabled={mutationStatus === 'loading'}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className="admin-modal__backdrop" onClick={close}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h2>{modal === 'add' ? 'Add' : 'Edit'} Product</h2>
            <form onSubmit={handleSubmit} className="admin-modal__form">
              <label>
                Title{' '}
                <input
                  required
                  value={form.title}
                  onChange={(e) => update('title', e.target.value)}
                />
              </label>
              <label>
                Price{' '}
                <input
                  required
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => update('price', e.target.value)}
                />
              </label>
              <label>
                Category{' '}
                <input
                  required
                  value={form.category}
                  onChange={(e) => update('category', e.target.value)}
                />
              </label>
              <label>
                Image URL{' '}
                <input
                  value={form.image}
                  onChange={(e) => update('image', e.target.value)}
                />
              </label>
              <label>
                Description{' '}
                <textarea
                  value={form.description}
                  onChange={(e) => update('description', e.target.value)}
                  rows={3}
                />
              </label>
              <div className="admin-modal__buttons">
                <Button
                  variant="primary"
                  type="submit"
                  disabled={mutationStatus === 'loading'}
                >
                  Save
                </Button>
                <Button variant="ghost" type="button" onClick={close}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
