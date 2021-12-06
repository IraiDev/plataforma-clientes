import { useContext } from 'react'
import { Navigate } from 'react-router-dom';
import { Ticket } from '../context/Ticket'

const PublicRoute = ({ children }) => {

  const { user } = useContext(Ticket)

  const lastPath = localStorage.getItem('lastPath-ticket') || '/'

  return user.ok ? <Navigate to={lastPath} /> : children
}

export default PublicRoute
