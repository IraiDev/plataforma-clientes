import { useContext } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { Ticket } from '../context/Ticket'

const AdminRoutes = ({ children }) => {

   const { user } = useContext(Ticket)
   const { pathname, search } = useLocation()

   window.localStorage.setItem('lastPath-ticket', pathname + search)

   return user.isAdmin ? children : <Navigate to='/' />
}

export default AdminRoutes
