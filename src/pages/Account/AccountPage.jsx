import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  useAppDispatch,
  useCurrentUser,
  useIsAuthenticated,
  useIsAdmin,
} from '../../hooks/customHooks'
import { logout } from '../../features/auth/authSlice'
import { addToast } from '../../features/ui/uiSlice'
import './AccountPage.css'

// Amazon-style icon mapping for account sections
const sectionIcons = {
  orders: '📦',
  list: '📝',
  recommendations: '⭐',
  apps: '📱',
  music: '🎵',
  video: '🎬',
  photos: '📷',
  devices: '💻',
  payment: '💳',
  address: '📍',
  prime: '👑',
  membership: '🎁',
  security: '🔒',
  privacy: '🔐',
  communication: '📧',
  preferences: '⚙️',
  business: '💼',
  seller: '🏪',
  customerService: '🎧',
  feedback: '💬',
}

function AccountSectionCard({ icon, title, items }) {
  return (
    <div className="account-dashboard-card">
      <div className="account-dashboard-card__icon">{icon}</div>
      <h3 className="account-dashboard-card__title">{title}</h3>
      <ul className="account-dashboard-card__list">
        {items.map((item, index) => (
          <li key={index} className="account-dashboard-card__item">
            {item.to ? (
              <Link to={item.to} className="account-dashboard-card__link">
                {item.label}
                <span className="account-dashboard-card__arrow">›</span>
              </Link>
            ) : item.action ? (
              <button
                className="account-dashboard-card__link account-dashboard-card__link--button"
                onClick={item.action}
              >
                {item.label}
                <span className="account-dashboard-card__arrow">›</span>
              </button>
            ) : (
              <span className="account-dashboard-card__text">{item.label}</span>
            )}
            {item.description && (
              <p className="account-dashboard-card__desc">{item.description}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

function LoginPageRedirect() {
  return (
    <div className="account-page-wrapper">
      <div className="account-login-required">
        <div className="account-login-required__box">
          <h2 className="account-login-required__title">
            Your Account requires sign-in
          </h2>
          <p className="account-login-required__text">
            Sign in to access your orders, recommendations, payment methods, and
            personalized settings.
          </p>
          <div className="account-login-required__actions">
            <Link to="/login" className="account-login-required__btn">
              Sign in
            </Link>
            <Link
              to="/register"
              className="account-login-required__btn-secondary"
            >
              Create your Amazon account
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AccountPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const user = useCurrentUser()
  const isAuthenticated = useIsAuthenticated()
  const isAdmin = useIsAdmin()
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  })

  const handleLogout = () => {
    dispatch(logout())
    dispatch(
      addToast({
        title: 'Signed out',
        message: 'You have been signed out successfully.',
        type: 'success',
      })
    )
    navigate('/')
  }

  const handleProfileSubmit = (e) => {
    e.preventDefault()
    dispatch(
      addToast({
        title: 'Profile updated',
        message: 'Your profile information has been saved.',
        type: 'success',
      })
    )
    setShowEditProfile(false)
  }

  if (!isAuthenticated) {
    return <LoginPageRedirect />
  }

  const userName = user?.name || 'Amazon Customer'
  const userEmail = user?.email || 'your-email@example.com'

  return (
    <div className="account-page-wrapper">
      {/* Breadcrumb */}
      <div className="account-breadcrumb">
        <div className="account-breadcrumb__inner">
          <Link to="/" className="account-breadcrumb__link">
            Home
          </Link>
          <span className="account-breadcrumb__separator">›</span>
          <span className="account-breadcrumb__current">Your Account</span>
        </div>
      </div>

      <div className="account-container">
        {/* Page Title */}
        <div className="account-page-header">
          <h1 className="account-page-header__title">Your Account</h1>
          <div className="account-page-header__user">
            <span className="account-page-header__name">{userName}</span>
            <span className="account-page-header__email">{userEmail}</span>
          </div>
        </div>

        {/* Edit Profile Modal */}
        {showEditProfile && (
          <div className="account-edit-modal-backdrop">
            <div className="account-edit-modal">
              <div className="account-edit-modal__header">
                <h2 className="account-edit-modal__title">Edit Your Profile</h2>
                <button
                  className="account-edit-modal__close"
                  onClick={() => setShowEditProfile(false)}
                >
                  ✕
                </button>
              </div>
              <form
                onSubmit={handleProfileSubmit}
                className="account-edit-modal__form"
              >
                <div className="account-edit-modal__field">
                  <label className="account-edit-modal__label">Name</label>
                  <input
                    type="text"
                    className="account-edit-modal__input"
                    value={profileForm.name}
                    onChange={(e) =>
                      setProfileForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="account-edit-modal__field">
                  <label className="account-edit-modal__label">Email</label>
                  <input
                    type="email"
                    className="account-edit-modal__input"
                    value={profileForm.email}
                    onChange={(e) =>
                      setProfileForm((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="account-edit-modal__field">
                  <label className="account-edit-modal__label">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    className="account-edit-modal__input"
                    value={profileForm.phone}
                    onChange={(e) =>
                      setProfileForm((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="account-edit-modal__actions">
                  <button
                    type="button"
                    className="account-edit-modal__cancel"
                    onClick={() => setShowEditProfile(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="account-edit-modal__save">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Account Dashboard Grid - Amazon Style */}
        <div className="account-dashboard-grid">
          {/* Row 1: Orders & Lists */}
          <AccountSectionCard
            icon={sectionIcons.orders}
            title="Orders"
            items={[
              {
                label: 'Your Orders',
                description: 'Track, return, or cancel items',
                to: '/orders',
              },
              {
                label: 'Your Returns',
                description: 'View and manage your returns',
                to: '/returns',
              },
              {
                label: 'Buy Again',
                description: 'Reorder items from your history',
                to: '/orders',
              },
            ]}
          />

          <AccountSectionCard
            icon={sectionIcons.list}
            title="Lists & Registries"
            items={[
              {
                label: 'Create a List',
                description: 'Make lists to organize items',
                to: '/lists',
              },
              {
                label: 'Find a List or Registry',
                description: 'Search for wish lists',
                to: '/lists',
              },
            ]}
          />

          {/* Row 2: Recommendations & Digital Services */}
          <AccountSectionCard
            icon={sectionIcons.recommendations}
            title="Recommendations"
            items={[
              {
                label: 'Your Recommendations',
                description: 'Personalized picks for you',
                to: '/products',
              },
              {
                label: 'Your Browsing History',
                description: 'View recently viewed items',
                to: '/products',
              },
            ]}
          />

          <AccountSectionCard
            icon={sectionIcons.apps}
            title="Apps & More"
            items={[
              {
                label: 'Amazon Appstore',
                description: 'Download the Amazon app',
                to: '/products',
              },
              {
                label: 'Amazon Music',
                description: 'Stream millions of songs',
                to: '/products',
              },
              {
                label: 'Amazon Video',
                description: 'Watch movies & TV shows',
                to: '/products',
              },
            ]}
          />

          {/* Row 3: Payment & Addresses */}
          <AccountSectionCard
            icon={sectionIcons.payment}
            title="Payments"
            items={[
              {
                label: 'Your Payments',
                description: 'Manage payment methods',
                to: '/account/payments',
              },
              {
                label: 'Amazon Business Amex',
                description: 'Manage your card account',
                to: '/account/payments',
              },
              {
                label: 'Shop With Points',
                description: 'Use rewards points at checkout',
                to: '/account/payments',
              },
            ]}
          />

          <AccountSectionCard
            icon={sectionIcons.address}
            title="Addresses"
            items={[
              {
                label: 'Your Addresses',
                description: 'Edit or add new addresses',
                to: '/account/addresses',
              },
              {
                label: 'Saved Addresses',
                description: 'Manage delivery locations',
                to: '/account/addresses',
              },
            ]}
          />

          {/* Row 4: Prime & Memberships */}
          <AccountSectionCard
            icon={sectionIcons.prime}
            title="Memberships & Subscriptions"
            items={[
              {
                label: 'Amazon Prime',
                description: 'Free delivery, videos & more',
                to: '/prime',
              },
              {
                label: 'Your Memberships',
                description: 'Manage subscriptions',
                to: '/account/memberships',
              },
              {
                label: 'Subscribe & Save',
                description: 'Automatic deliveries on your schedule',
                to: '/account/subscribe',
              },
            ]}
          />

          <AccountSectionCard
            icon={sectionIcons.devices}
            title="Digital Services & Device Support"
            items={[
              {
                label: 'Manage Your Content and Devices',
                description: 'Organize Kindle, Alexa & more',
                to: '/account/devices',
              },
              {
                label: 'Register Your Amazon Device',
                description: 'Add a new device to your account',
                to: '/account/devices',
              },
            ]}
          />

          {/* Row 5: Account Settings */}
          <AccountSectionCard
            icon={sectionIcons.security}
            title="Account Settings"
            items={[
              {
                label: 'Login & Security',
                description: 'Edit name, email, password',
                action: () => setShowEditProfile(true),
              },
              {
                label: 'Your Password',
                description: 'Update your password',
                to: '/account/security',
              },
              {
                label: 'Two-Step Verification',
                description: 'Add extra security',
                to: '/account/security',
              },
            ]}
          />

          <AccountSectionCard
            icon={sectionIcons.preferences}
            title="Communication & Preferences"
            items={[
              {
                label: 'Communication Preferences',
                description: 'Email & notification settings',
                to: '/account/preferences',
              },
              {
                label: 'Your Preferences',
                description: 'Language & accessibility',
                to: '/account/preferences',
              },
              {
                label: 'Archived Orders',
                description: 'View archived orders',
                to: '/orders',
              },
            ]}
          />

          {/* Row 6: For Business & Customer Service */}
          {isAdmin && (
            <AccountSectionCard
              icon={sectionIcons.business}
              title="For Business & Seller"
              items={[
                {
                  label: 'Amazon Business',
                  description: 'Business pricing & bulk orders',
                  to: '/admin/products',
                },
                {
                  label: 'Manage Users (Admin)',
                  description: 'Admin user management',
                  to: '/admin/users',
                },
                {
                  label: 'Manage Products (Admin)',
                  description: 'Admin product catalog',
                  to: '/admin/products',
                },
              ]}
            />
          )}

          <AccountSectionCard
            icon={sectionIcons.customerService}
            title="Customer Service"
            items={[
              {
                label: 'Help',
                description: 'Browse help topics',
                to: '/help',
              },
              {
                label: 'Contact Us',
                description: 'Get support from Amazon',
                to: '/help',
              },
              {
                label: 'Submit Feedback',
                description: 'Share your experience',
                to: '/help',
              },
            ]}
          />

          {/* Sign Out Card */}
          <div className="account-signout-card">
            <h3 className="account-signout-card__title">
              Sign out & secure your account
            </h3>
            <button
              className="account-signout-card__btn"
              onClick={handleLogout}
            >
              Sign Out
            </button>
            <p className="account-signout-card__text">
              We recommend signing out when you're done, especially on shared
              devices.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
