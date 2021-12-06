import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { Ticket } from '../context/Ticket'

const PrivateRoute = ({ children }) => {

  const { user } = useContext(Ticket)
  // const { pathname, search } = useLocation()

  // window.localStorage.setItem('lastPath-ticket', pathname + search)

  return user.ok ? children : <Navigate to="/login" />
}

export default PrivateRoute
