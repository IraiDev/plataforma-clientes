import { Route, Routes } from 'react-router-dom'
import Error404 from '../components/screens/Error404'
import UserMaintainer from '../components/screens/UserMaintainer'
import DetailsView from '../components/views/DetailsView'

const DashAdminRoutes = () => {

   return (
      <Routes>
         <Route path='mantenedor-usuarios' element={<UserMaintainer />} />
         <Route path='in/:id' element={<DetailsView from='IN' />} />
         <Route path='*' element={<Error404 />} />
      </Routes>
   )
}

export default DashAdminRoutes
