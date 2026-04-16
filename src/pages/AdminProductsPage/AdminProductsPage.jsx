/* ===== ADMIN PRODUCTS PAGE ===== */
/* Admin-only product CRUD interface (create, edit, delete products) */
/* Supports multipart/form-data for image uploads (up to 5 files) */

import { useEffect, useState, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  useAppDispatch,
  useProducts,
  useProductStatus,
  useProductMutationStatus,
  useFetchProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from '../../hooks'
import {
  createProduct,
  updateProduct,
  deleteProduct,
} from '../../features/products/productSlice'
import { addToast } from '../../features/ui/uiSlice'
import LoadingSpinner from '../../components/shared/LoadingSpinner'
import EmptyState from '../../components/shared/EmptyState'
import Button from '../../components/shared/Button'
import ConfirmationModal from '../../components/shared/ConfirmationModal'
import { formatCurrency } from '../../utils/helpers'
import './AdminProductsPage.css'

const INITIAL_FORM_STATE = {
  title: '',
  description: '',
  price: '',
  salePrice: '',
  category: '',
  brand: '',
  stock: '',
  rating: '',
  images: [],
}

function ProductFormModal({ mode, product, onSubmit, onClose, isSubmitting }) {
  const [form, setForm] = useState(
    mode === 'edit' && product
      ? {
          title: product.title ?? '',
          description: product.description ?? '',
          price: String(product.price ?? ''),
          salePrice: product.salePrice ? String(product.salePrice) : '',
          category: product.category ?? '',
          brand: product.brand ?? '',
          stock: String(product.stock ?? ''),
          rating:
            product.rating !== undefined && product.rating !== null
              ? String(product.rating)
              : product.ratings !== undefined && product.ratings !== null
                ? String(product.ratings)
                : '',
          images: product.images ?? (product.image ? [product.image] : []),
        }
      : { ...INITIAL_FORM_STATE }
  )
  const [imageFiles, setImageFiles] = useState([])
  const [formErrors, setFormErrors] = useState({})
  const fileInputRef = useRef(null)

  const updateField = useCallback((key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setFormErrors((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }, [])

  const handleImageChange = useCallback(
    (e) => {
      const files = Array.from(e.target.files)
      if (files.length + imageFiles.length > 5) {
        setFormErrors((prev) => ({
          ...prev,
          images: 'Maximum 5 images allowed.',
        }))
        return
      }
      setImageFiles((prev) => [...prev, ...files])
      setFormErrors((prev) => {
        const next = { ...prev }
        delete next.images
        return next
      })
    },
    [imageFiles.length]
  )

  const removeImage = useCallback((index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const removeExistingImage = useCallback((index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }, [])

  const validate = () => {
    const errors = {}
    if (!form.title.trim()) errors.title = 'Title is required'
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
      errors.price = 'Valid price is required'
    if (form.salePrice && Number(form.salePrice) >= Number(form.price))
      errors.salePrice = 'Sale price must be less than regular price'
    if (!form.category.trim()) errors.category = 'Category is required'
    if (!form.stock || isNaN(Number(form.stock)) || Number(form.stock) < 0)
      errors.stock = 'Valid stock value is required'
    if (
      form.rating !== '' &&
      (isNaN(Number(form.rating)) ||
        Number(form.rating) < 0 ||
        Number(form.rating) > 5)
    ) {
      errors.rating = 'Rating must be between 0 and 5'
    }
    if (mode === 'add' && imageFiles.length === 0 && form.images.length === 0)
      errors.images = 'At least one image is required for new products'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    const payload = {
      name: form.title,
      title: form.title,
      description: form.description,
      price: Number(form.price),
      salePrice: form.salePrice ? Number(form.salePrice) : undefined,
      category: form.category,
      brand: form.brand,
      stock: Number(form.stock),
      rating: form.rating !== '' ? Number(form.rating) : undefined,
    }

    // If we have files, use FormData for multipart upload
    if (imageFiles.length > 0 || mode === 'add') {
      const formData = new FormData()
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          formData.append(key, value)
        }
      })
      // Backend expects field name 'image' (singular)
      imageFiles.forEach((file) => {
        formData.append('image', file)
      })
      // Also include existing image URLs if editing
      if (mode === 'edit' && form.images.length > 0) {
        form.images.forEach((url) => {
          if (typeof url === 'string') {
            formData.append('existingImages', url)
          }
        })
      }
      onSubmit(formData, true)
    } else {
      onSubmit(payload, false)
    }
  }

  return (
    <div className="admin-modal__backdrop" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <h2>{mode === 'add' ? 'Add' : 'Edit'} Product</h2>
        <form onSubmit={handleSubmit} className="admin-modal__form">
          <div className="admin-modal__field">
            <label htmlFor="product-title">Title *</label>
            <input
              id="product-title"
              required
              value={form.title}
              onChange={(e) => updateField('title', e.target.value)}
              aria-invalid={!!formErrors.title}
            />
            {formErrors.title && (
              <span className="admin-modal__error">{formErrors.title}</span>
            )}
          </div>

          <div className="admin-modal__field">
            <label htmlFor="product-desc">Description</label>
            <textarea
              id="product-desc"
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              rows={3}
            />
          </div>

          <div className="admin-modal__row">
            <div className="admin-modal__field">
              <label htmlFor="product-price">Price *</label>
              <input
                id="product-price"
                required
                type="number"
                step="0.01"
                min="0.01"
                value={form.price}
                onChange={(e) => updateField('price', e.target.value)}
                aria-invalid={!!formErrors.price}
              />
              {formErrors.price && (
                <span className="admin-modal__error">{formErrors.price}</span>
              )}
            </div>

            <div className="admin-modal__field">
              <label htmlFor="product-sale-price">Sale Price</label>
              <input
                id="product-sale-price"
                type="number"
                step="0.01"
                min="0"
                value={form.salePrice}
                onChange={(e) => updateField('salePrice', e.target.value)}
                aria-invalid={!!formErrors.salePrice}
              />
              {formErrors.salePrice && (
                <span className="admin-modal__error">
                  {formErrors.salePrice}
                </span>
              )}
            </div>
          </div>

          <div className="admin-modal__row">
            <div className="admin-modal__field">
              <label htmlFor="product-category">Category *</label>
              <input
                id="product-category"
                required
                value={form.category}
                onChange={(e) => updateField('category', e.target.value)}
                aria-invalid={!!formErrors.category}
              />
              {formErrors.category && (
                <span className="admin-modal__error">
                  {formErrors.category}
                </span>
              )}
            </div>

            <div className="admin-modal__field">
              <label htmlFor="product-brand">Brand</label>
              <input
                id="product-brand"
                value={form.brand}
                onChange={(e) => updateField('brand', e.target.value)}
              />
            </div>
          </div>

          <div className="admin-modal__field">
            <label htmlFor="product-stock">Stock *</label>
            <input
              id="product-stock"
              required
              type="number"
              min="0"
              value={form.stock}
              onChange={(e) => updateField('stock', e.target.value)}
              aria-invalid={!!formErrors.stock}
            />
            {formErrors.stock && (
              <span className="admin-modal__error">{formErrors.stock}</span>
            )}
          </div>

          <div className="admin-modal__field">
            <label htmlFor="product-rating">Initial Rating</label>
            <input
              id="product-rating"
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={form.rating}
              onChange={(e) => updateField('rating', e.target.value)}
              aria-invalid={!!formErrors.rating}
            />
            {formErrors.rating && (
              <span className="admin-modal__error">{formErrors.rating}</span>
            )}
          </div>

          <div className="admin-modal__field">
            <label htmlFor="product-images">
              Images {mode === 'add' ? '*' : '(up to 5)'}
            </label>
            <input
              id="product-images"
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              aria-invalid={!!formErrors.images}
            />
            {formErrors.images && (
              <span className="admin-modal__error">{formErrors.images}</span>
            )}
            <small className="admin-modal__hint">
              {5 - imageFiles.length - form.images.length} more image(s) allowed
            </small>

            {/* Preview existing images */}
            {form.images.length > 0 && (
              <div className="admin-modal__image-preview">
                {form.images.map((img, idx) => (
                  <div key={idx} className="admin-modal__image-thumb">
                    <img
                      src={
                        typeof img === 'string' ? img : URL.createObjectURL(img)
                      }
                      alt={`Product ${idx + 1}`}
                    />
                    <button
                      type="button"
                      className="admin-modal__image-remove"
                      onClick={() =>
                        typeof img === 'string'
                          ? removeExistingImage(idx)
                          : removeImage(imageFiles.findIndex((f) => f === img))
                      }
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Preview new images */}
            {imageFiles.length > 0 && (
              <div className="admin-modal__image-preview">
                {imageFiles.map((file, idx) => (
                  <div key={`new-${idx}`} className="admin-modal__image-thumb">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`New ${idx + 1}`}
                    />
                    <button
                      type="button"
                      className="admin-modal__image-remove"
                      onClick={() => removeImage(idx)}
                    >
                      ✕
                    </button>
                    <span className="admin-modal__image-label">New</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="admin-modal__actions">
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save'}
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
  const fetchProducts = useFetchProducts()
  const createProductFn = useCreateProduct()
  const updateProductFn = useUpdateProduct()
  const deleteProductFn = useDeleteProduct()
  const [modalMode, setModalMode] = useState(null)
  const [editProductId, setEditProductId] = useState(null)
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    productId: null,
    productName: '',
  })

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const openEdit = useCallback((product) => {
    setModalMode('edit')
    setEditProductId(product._id)
  }, [])

  const closeModal = useCallback(() => {
    setModalMode(null)
    setEditProductId(null)
  }, [])

  const handleSave = async (payload, isMultipart) => {
    let result
    if (modalMode === 'add') {
      result = await dispatch(createProductFn(payload))
    } else {
      const updatePayload = isMultipart
        ? { id: editProductId, formData: payload }
        : { id: editProductId, ...payload }
      result = await dispatch(updateProductFn(updatePayload))
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
      fetchProducts()
    } else {
      dispatch(
        addToast({
          title: 'Failed',
          message: result.payload ?? 'Could not save product.',
          type: 'error',
        })
      )
    }
  }

  const handleDelete = useCallback((product) => {
    setDeleteModal({
      open: true,
      productId: product._id,
      productName: product.title ?? product.name,
    })
  }, [])

  const confirmDelete = useCallback(async () => {
    const result = await dispatch(deleteProductFn(deleteModal.productId))
    setDeleteModal({ open: false, productId: null, productName: '' })
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
          message: result.payload ?? 'Could not delete product.',
          type: 'error',
        })
      )
    }
  }, [dispatch, deleteProductFn, deleteModal.productId])

  if (status === 'loading' && !products.length)
    return <LoadingSpinner label="Loading products..." fullScreen />

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h1>Manage Products</h1>
        <Link to="/admin/products/add" className="btn btn--primary">
          Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <EmptyState
          title="No products"
          description="Add your first product."
          action={
            <Link to="/admin/products/add" className="btn btn--primary">
              Add Product
            </Link>
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
                      src={
                        product.images?.[0] ??
                        product.image ??
                        'https://placehold.co/40x40'
                      }
                      alt=""
                      className="admin-table__img"
                      loading="lazy"
                      width="40"
                      height="40"
                    />
                  </td>
                  <td>{product.title ?? product.name}</td>
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
                      onClick={() => handleDelete(product)}
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

      <ConfirmationModal
        isOpen={deleteModal.open}
        onClose={() =>
          setDeleteModal({ open: false, productId: null, productName: '' })
        }
        onConfirm={confirmDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteModal.productName}"? This action cannot be undone.`}
        confirmText="Delete Product"
        cancelText="Cancel"
        variant="danger"
        isLoading={mutationStatus === 'loading'}
      />
    </div>
  )
}
