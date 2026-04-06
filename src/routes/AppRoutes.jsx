import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from '../layout/Layout'
import CartPage from '../pages/Cart/CartPage'
import HomePage from '../pages/Home/HomePage'
import LoginPage from '../pages/Login/Loginpage'
import NotFound from '../pages/NotFound/NotFound'
import RegistrationPage from '../pages/Registration/RegistrationPage'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="/CartPage" element={<CartPage />} />
      </Route>

      <Route path="/Login" element={<LoginPage />} />
      <Route path="/Registration" element={<RegistrationPage />} />

      <Route path="/login" element={<Navigate to="/Login" replace />} />
      <Route path="/register" element={<Navigate to="/Registration" replace />} />
      <Route path="/LoginPage" element={<Navigate to="/Login" replace />} />

      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  )
}
