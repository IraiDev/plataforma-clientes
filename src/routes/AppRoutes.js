import { useEffect } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import PublicRoute from './PublicRoute'
import PrivateRoute from './PrivateRoute'
import LoginScreen from '../components/screens/LoginScreen'
import DashRoutes from './DashRoutes'

const AppRoutes = () => {

  const { pathname } = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    !pathname.includes('/') && navigate('/')
    // eslint-disable-next-line
  }, [pathname])

  return (
    <Routes>
      <Route path='/login' element={
        <PublicRoute>
          <LoginScreen />
        </PublicRoute>
      } />

      <Route path='/*' element={
        <PrivateRoute>
          <DashRoutes />
        </PrivateRoute>
      } />
    </Routes>
  )
}

export default AppRoutes
