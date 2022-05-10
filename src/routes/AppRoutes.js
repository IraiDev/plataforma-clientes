import { useContext, useEffect } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import PublicRoute from './PublicRoute'
import PrivateRoute from './PrivateRoute'
import LoginScreen from '../components/screens/LoginScreen'
import DashRoutes from './DashRoutes'
import { Ticket } from '../context/Ticket'

const AppRoutes = () => {

  const { getFilters } = useContext(Ticket)
  const { pathname } = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    !pathname.includes('/') && navigate('/')
    // eslint-disable-next-line
  }, [pathname])

  useEffect(() => {
    getFilters()
  }, [])

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
