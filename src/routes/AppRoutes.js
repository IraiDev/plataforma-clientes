import { Routes, Route } from 'react-router-dom'
import PublicRoute from './PublicRoute'
import PrivateRoute from './PrivateRoute'
import LoginScreen from '../components/screens/LoginScreen'
import DashRoutes from './DashRoutes'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={
        <PublicRoute>
          <LoginScreen />
        </PublicRoute>
      } />

      <Route path="/*" element={
        <PrivateRoute>
          <DashRoutes />
        </PrivateRoute>
      } />
    </Routes>
  )
}

export default AppRoutes
