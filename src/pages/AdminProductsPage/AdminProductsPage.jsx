/* ===== ADMIN PRODUCTS PAGE ===== */
/* Admin-only product CRUD interface (create, edit, delete products) */
/* Admin Route - requires admin role */

import { useEffect, useState, useCallback } from 'react'
import {
  useAppDispatch,
  useProducts,
  useProductStatus,
  useProductMutationStatus,
} from '../../hooks'
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../../features/products/productSlice'
import { addToast } from '../../features/ui/uiSlice'
import LoadingSpinner from '../../components/shared/LoadingSpinner'
import EmptyState from '../../components/shared/EmptyState'
import Button from '../../components/shared/Button'
import { formatCurrency } from '../../utils/helpers'
import './AdminProductsPage.css'

const INITIAL_FORM_STATE = {
  title: '',
  price: '',
  category: '',
  image: '',
  description: '',
}

function ProductFormModal({ mode, product, onSubmit, onClose, isSubmitting }) {
  const [form, setForm] = useState(
    mode === 'edit' && product
      ? {
          title: product.title,
          price: String(product.price),
          category: product.category,
          image: product.image,
          description: product.description,
        }
      : { ...INITIAL_FORM_STATE }
  )

  const updateField = useCallback((key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ ...form, price: Number(form.price) })
  }

  return (
    <div className="admin-modal__backdrop" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <h2>{mode === 'add' ? 'Add' : 'Edit'} Product</h2>
        <form onSubmit={handleSubmit} className="admin-modal__form">
          <label>
            Title
            <input
              required
              value={form.title}
              onChange={(e) => updateField('title', e.target.value)}
            />
          </label>
          <label>
            Price
            <input
              required
              type="number"
              step="0.01"
              value={form.price}
              onChange={(e) => updateField('price', e.target.value)}
            />
          </label>
          <label>
            Category
            <input
              required
              value={form.category}
              onChange={(e) => updateField('category', e.target.value)}
            />
          </label>
          <label>
            Image URL
            <input
              value={form.image}
              onChange={(e) => updateField('image', e.target.value)}
            />
          </label>
          <label>
            Description
            <textarea
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              rows={3}
            />
          </label>
          <div className="admin-modal__buttons">
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              Save
            </Button>
            <Button variant="ghost" type="button" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminProductsPage() {
  const dispatch = useAppDispatch()
  const products = useProducts()
  const status = useProductStatus()
  const mutationStatus = useProductMutationStatus()
  const [modalMode, setModalMode] = useState(null)
  const [editProductId, setEditProductId] = useState(null)

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  const openAdd = useCallback(() => {
    setModalMode('add')
    setEditProductId(null)
  }, [])

  const openEdit = useCallback((product) => {
    setModalMode('edit')
    setEditProductId(product._id)
  }, [])

  const closeModal = useCallback(() => {
    setModalMode(null)
    setEditProductId(null)
  }, [])

  const handleSave = async (payload) => {
    let result
    if (modalMode === 'add') {
      result = await dispatch(createProduct(payload))
    } else {
      result = await dispatch(updateProduct({ id: editProductId, ...payload }))
    }

    if (
      createProduct.fulfilled.match(result) ||
      updateProduct.fulfilled.match(result)
    ) {
      dispatch(
        addToast({
          title: 'Success',
          message: `Product ${modalMode === 'add' ? 'created' : 'updated'}.`,
          type: 'success',
        })
      )
      closeModal()
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
    if (deleteProduct.fulfilled.match(result)) {
      dispatch(
        addToast({
          title: 'Deleted',
          message: 'Product removed.',
          type: 'info',
        })
      )
    } else {
      dispatch(
        addToast({
          title: 'Failed',
          message: result.payload || 'Could not delete.',
          type: 'error',
        })
      )
    }
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
              {products.map((product) => (
                <tr key={product._id}>
                  <td>
                    <img
                      src={product.image || 'https://placehold.co/40x40'}
                      alt=""
                      className="admin-table__img"
                      loading="lazy"
                    />
                  </td>
                  <td>{product.title}</td>
                  <td>{product.category}</td>
                  <td>{formatCurrency(product.price)}</td>
                  <td>{product.stock ?? '\u2014'}</td>
                  <td className="admin-table__actions">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEdit(product)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(product._id)}
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

      {modalMode && (
        <ProductFormModal
          mode={modalMode}
          product={
            modalMode === 'edit'
              ? products.find((p) => p._id === editProductId)
              : null
          }
          onSubmit={handleSave}
          onClose={closeModal}
          isSubmitting={mutationStatus === 'loading'}
        />
      )}
    </div>
  )
}
