import { useEffect, useState } from 'react'
import {
  useAppDispatch,
  useProducts,
  useProductStatus,
  useProductMutationStatus,
  useIsAdmin,
  useFetchCart,
} from '../../hooks/customHooks'
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../../features/products/productSlice'
import { addToast } from '../../features/ui/uiSlice'
import LoadingSpinner from '../../components/UI/LoadingSpinner'
import EmptyState from '../../components/UI/EmptyState'
import Modal from '../../components/UI/Modal'
import { formatCurrency } from '../../utils/helpers'

const CATEGORIES = [
  'Electronics',
  'Computers',
  'Gaming',
  'Office Products',
  'Clothing',
  'Home & Kitchen',
  'Books',
  'Toys',
  'Sports',
  'Beauty',
]

const emptyProduct = {
  name: '',
  description: '',
  price: '',
  category: 'Electronics',
  stock: '',
}

export default function AdminProductsPage() {
  const dispatch = useAppDispatch()
  const products = useProducts()
  const status = useProductStatus()
  const mutationStatus = useProductMutationStatus()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState(emptyProduct)
  const [images, setImages] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  const openCreateModal = () => {
    setEditingProduct(null)
    setFormData(emptyProduct)
    setImages([])
    setImagePreviews([])
    setModalOpen(true)
  }

  const openEditModal = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name || product.title || '',
      description: product.description || '',
      price: product.price || '',
      category: product.category || 'Electronics',
      stock: product.stock ?? '',
    })
    setImages([])
    setImagePreviews(product.image ? [product.image] : [])
    setModalOpen(true)
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5)
    setImages(files)
    const previews = files.map((file) => URL.createObjectURL(file))
    setImagePreviews(previews.length ? previews : imagePreviews)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const form = new FormData()
    form.append('name', formData.name)
    form.append('description', formData.description)
    form.append('price', Number(formData.price))
    form.append('category', formData.category)
    form.append('stock', Number(formData.stock))
    images.forEach((img) => form.append('images', img))

    let result
    if (editingProduct) {
      result = await dispatch(
        updateProduct({ id: editingProduct._id, formData: form })
      )
    } else {
      result = await dispatch(createProduct(form))
    }

    if (
      createProduct.fulfilled.match(result) ||
      updateProduct.fulfilled.match(result)
    ) {
      dispatch(
        addToast({
          title: editingProduct ? 'Product updated' : 'Product created',
          message: `${formData.name} has been ${editingProduct ? 'updated' : 'created'} successfully.`,
          type: 'success',
        })
      )
      setModalOpen(false)
      dispatch(fetchProducts())
    } else {
      dispatch(
        addToast({
          title: 'Operation failed',
          message: result.payload || 'Something went wrong.',
          type: 'error',
        })
      )
    }
  }

  const handleDelete = async () => {
    if (!deleteConfirm) return
    const result = await dispatch(deleteProduct(deleteConfirm))
    if (deleteProduct.fulfilled.match(result)) {
      dispatch(
        addToast({
          title: 'Product deleted',
          message: 'The product has been deleted.',
          type: 'success',
        })
      )
      dispatch(fetchProducts())
    } else {
      dispatch(
        addToast({
          title: 'Delete failed',
          message: result.payload || 'Unable to delete product.',
          type: 'error',
        })
      )
    }
    setDeleteConfirm(null)
  }

  if (status === 'loading' && !products.length) {
    return <LoadingSpinner label="Loading products..." />
  }

  return (
    <div className="admin-products-page">
      <div className="admin-page-container">
        <div className="admin-page-header">
          <h1>Manage Products</h1>
          <button
            type="button"
            className="admin-add-btn"
            onClick={openCreateModal}
            disabled={mutationStatus === 'loading'}
          >
            + Add New Product
          </button>
        </div>

        {products.length === 0 ? (
          <EmptyState
            title="No products found"
            description="Start by adding your first product."
            action={
              <button className="btn-primary" onClick={openCreateModal}>
                Add Product
              </button>
            }
          />
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <img
                        src={product.image || '/placeholder-product.png'}
                        alt={product.name || product.title}
                        className="admin-table__thumb"
                      />
                    </td>
                    <td>{product.name || product.title}</td>
                    <td>{product.category}</td>
                    <td>{formatCurrency(product.price)}</td>
                    <td>{product.stock ?? 'N/A'}</td>
                    <td>
                      {'★'.repeat(Math.round(product.rating || 0))}
                      {'☆'.repeat(5 - Math.round(product.rating || 0))}
                      <span className="admin-table__rating-count">
                        ({product.reviewsCount || 0})
                      </span>
                    </td>
                    <td className="admin-table__actions">
                      <button
                        type="button"
                        className="admin-table__btn admin-table__btn--edit"
                        onClick={() => openEditModal(product)}
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        type="button"
                        className="admin-table__btn admin-table__btn--delete"
                        onClick={() => setDeleteConfirm(product._id)}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        open={modalOpen}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="admin-form">
          <label className="admin-form__field">
            <span>Name</span>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />
          </label>

          <label className="admin-form__field">
            <span>Description</span>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              rows="3"
            />
          </label>

          <label className="admin-form__field">
            <span>Price</span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, price: e.target.value }))
              }
              required
            />
          </label>

          <label className="admin-form__field">
            <span>Category</span>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, category: e.target.value }))
              }
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </label>

          <label className="admin-form__field">
            <span>Stock</span>
            <input
              type="number"
              min="0"
              value={formData.stock}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, stock: e.target.value }))
              }
              required
            />
          </label>

          <label className="admin-form__field">
            <span>Images (up to 5)</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />
            {imagePreviews.length > 0 && (
              <div className="admin-form__previews">
                {imagePreviews.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`Preview ${i}`}
                    className="admin-form__preview"
                  />
                ))}
              </div>
            )}
          </label>

          <div className="admin-form__actions">
            <button
              type="button"
              className="admin-form__cancel"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="admin-form__submit"
              disabled={mutationStatus === 'loading'}
            >
              {mutationStatus === 'loading'
                ? 'Saving...'
                : editingProduct
                  ? 'Update Product'
                  : 'Create Product'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={!!deleteConfirm}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
        onClose={() => setDeleteConfirm(null)}
      >
        <div className="admin-form__actions">
          <button
            type="button"
            className="admin-form__cancel"
            onClick={() => setDeleteConfirm(null)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="admin-form__submit admin-form__submit--danger"
            onClick={handleDelete}
            disabled={mutationStatus === 'loading'}
          >
            {mutationStatus === 'loading' ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </Modal>
    </div>
  )
}
