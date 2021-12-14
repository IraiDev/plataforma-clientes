import { useContext } from 'react'
import { Navigate } from 'react-router-dom';
import { Ticket } from '../context/Ticket'

const PublicRoute = ({ children }) => {

  const { user } = useContext(Ticket)

  let lastPath = window.localStorage.getItem('lastPath-ticket') || '/'

  lastPath === '/login' && (lastPath = '/')

  return user.ok ? <Navigate to={lastPath} /> : children
}

export default PublicRoute
