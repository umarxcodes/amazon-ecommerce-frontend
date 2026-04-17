/* ===== ADMIN ADD PRODUCT PAGE ===== */
/* Admin-only page to create new products with image upload */
/* Posts product data to backend API */
/* Admin Route — requires admin role */

import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../hooks'
import { createProduct } from '../../features/products/productSlice'
import { addToast } from '../../features/ui/uiSlice'
import Button from '../../components/shared/Button'
import ConfirmationModal from '../../components/shared/ConfirmationModal'
import './AdminAddProductPage.css'

export default function AdminAddProductPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    rating: '',
  })
  const [images, setImages] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [cancelModal, setCancelModal] = useState(false)

  const updateField = useCallback((key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }, [])

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    setImages(files)

    // Generate previews
    const previews = files.map((file) => URL.createObjectURL(file))
    setImagePreviews(previews)
  }

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index)
    const newPreviews = imagePreviews.filter((_, i) => i !== index)
    setImages(newImages)
    setImagePreviews(newPreviews)
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Product name is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (!formData.price || Number(formData.price) <= 0) newErrors.price = 'Valid price is required'
    if (!formData.category.trim()) newErrors.category = 'Category is required'
    if (!formData.stock || Number(formData.stock) < 0) newErrors.stock = 'Valid stock quantity is required'
    if (
      formData.rating !== '' &&
      (Number.isNaN(Number(formData.rating)) ||
        Number(formData.rating) < 0 ||
        Number(formData.rating) > 5)
    ) {
      newErrors.rating = 'Rating must be between 0 and 5'
    }
    if (images.length === 0) newErrors.images = 'At least one image is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)

    // Create FormData for multipart upload
    const data = new FormData()
    data.append('name', formData.name)
    data.append('description', formData.description)
    data.append('price', Number(formData.price))
    data.append('category', formData.category)
    data.append('stock', Number(formData.stock))
    if (formData.rating !== '') {
      data.append('rating', Number(formData.rating))
    }

    // Append images
    images.forEach((image) => {
      data.append('image', image)
    })

    const result = await dispatch(createProduct(data))

    if (createProduct.fulfilled.match(result)) {
      dispatch(
        addToast({
          title: 'Product created',
          message: `"${formData.name}" has been added to the catalog.`,
          type: 'success',
        })
      )
      navigate('/admin/products')
    } else {
      dispatch(
        addToast({
          title: 'Failed',
          message: result.payload ?? 'Could not create product.',
          type: 'error',
        })
      )
    }

    setIsSubmitting(false)
  }

  const handleCancel = () => {
    const hasData = Object.values(formData).some((v) => v.trim() !== '') || images.length > 0
    if (hasData) {
      setCancelModal(true)
    } else {
      navigate('/admin/products')
    }
  }

  return (
    <div className="admin-add-product-page">
      <div className="admin-add-product-page__header">
        <h1 className="admin-add-product-page__title">Add New Product</h1>
        <Button variant="ghost" onClick={() => navigate('/admin/products')}>
          ← Back to Products
        </Button>
      </div>

      <form className="admin-add-product-form" onSubmit={handleSubmit} noValidate>
        {/* Basic Information Section */}
        <div className="admin-add-product-form__section">
          <h2 className="admin-add-product-form__section-title">Basic Information</h2>

          <div className="admin-add-product-form__field">
            <label htmlFor="product-name">Product Name *</label>
            <input
              id="product-name"
              type="text"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="e.g., Wireless Bluetooth Headphones"
              aria-invalid={!!errors.name}
            />
            {errors.name && <span className="admin-add-product-form__error">{errors.name}</span>}
          </div>

          <div className="admin-add-product-form__field">
            <label htmlFor="product-description">Description *</label>
            <textarea
              id="product-description"
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Enter detailed product description..."
              rows={5}
              aria-invalid={!!errors.description}
            />
            {errors.description && <span className="admin-add-product-form__error">{errors.description}</span>}
          </div>

          <div className="admin-add-product-form__row">
            <div className="admin-add-product-form__field">
              <label htmlFor="product-price">Price ($) *</label>
              <input
                id="product-price"
                type="number"
                value={formData.price}
                onChange={(e) => updateField('price', e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                aria-invalid={!!errors.price}
              />
              {errors.price && <span className="admin-add-product-form__error">{errors.price}</span>}
            </div>

            <div className="admin-add-product-form__field">
              <label htmlFor="product-stock">Stock Quantity *</label>
              <input
                id="product-stock"
                type="number"
                value={formData.stock}
                onChange={(e) => updateField('stock', e.target.value)}
                placeholder="0"
                min="0"
                aria-invalid={!!errors.stock}
              />
              {errors.stock && <span className="admin-add-product-form__error">{errors.stock}</span>}
            </div>
          </div>

          <div className="admin-add-product-form__field">
            <label htmlFor="product-category">Category *</label>
            <input
              id="product-category"
              type="text"
              value={formData.category}
              onChange={(e) => updateField('category', e.target.value)}
              placeholder="e.g., Electronics, Clothing, Home & Kitchen"
              aria-invalid={!!errors.category}
            />
            {errors.category && <span className="admin-add-product-form__error">{errors.category}</span>}
          </div>

          <div className="admin-add-product-form__field">
            <label htmlFor="product-rating">Initial Rating</label>
            <input
              id="product-rating"
              type="number"
              value={formData.rating}
              onChange={(e) => updateField('rating', e.target.value)}
              placeholder="0.0"
              min="0"
              max="5"
              step="0.1"
              aria-invalid={!!errors.rating}
            />
            <p className="admin-add-product-form__field-hint">
              Optional. Set a starting rating from 0 to 5.
            </p>
            {errors.rating && <span className="admin-add-product-form__error">{errors.rating}</span>}
          </div>
        </div>

        {/* Images Section */}
        <div className="admin-add-product-form__section">
          <h2 className="admin-add-product-form__section-title">Product Images</h2>

          <div className="admin-add-product-form__field">
            <label htmlFor="product-images">Upload Images *</label>
            <input
              id="product-images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              aria-invalid={!!errors.images}
            />
            <p className="admin-add-product-form__field-hint">
              Upload multiple images (JPG, PNG, WebP). First image will be the main product image.
            </p>
            {errors.images && <span className="admin-add-product-form__error">{errors.images}</span>}
          </div>

          {imagePreviews.length > 0 && (
            <div className="admin-add-product-form__previews">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="admin-add-product-form__preview">
                  <img src={preview} alt={`Preview ${index + 1}`} />
                  <button
                    type="button"
                    className="admin-add-product-form__preview-remove"
                    onClick={() => removeImage(index)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="admin-add-product-form__actions">
          <Button variant="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating Product...' : 'Create Product'}
          </Button>
          <Button variant="ghost" type="button" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </form>

      <ConfirmationModal
        isOpen={cancelModal}
        onClose={() => setCancelModal(false)}
        onConfirm={() => navigate('/admin/products')}
        title="Discard Changes?"
        message="Are you sure you want to cancel? All unsaved changes will be lost."
        confirmText="Discard"
        cancelText="Continue Editing"
        variant="warning"
      />
    </div>
  )
}
