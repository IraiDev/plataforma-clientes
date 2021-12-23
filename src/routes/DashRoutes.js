import { Route, Routes } from 'react-router-dom'
import { HomeScreen } from '../components/screens/HomeScreen'
import DetailsView from '../components/views/DetailsView'
import AdminRoutes from './AdminRoutes'
import DashAdminRoutes from './DashAdminRoutes'

const DashRoutes = () => {
  return (
    <Routes>
      <Route path='/*' element={
        <AdminRoutes>
          <DashAdminRoutes />
        </AdminRoutes>
      } />
      <Route path='sys' element={<HomeScreen showNewTicket={true} />} />
      <Route path='email/:id' element={<DetailsView from='EX' />} />
      <Route path='/' element={<HomeScreen />} />
    </Routes>
  )
}

export default DashRoutes
