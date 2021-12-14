import { Route, Routes } from 'react-router-dom'
import { HomeScreen } from '../components/screens/HomeScreen'
import UserMaintainer from '../components/screens/UserMaintainer'
import DetailsView from '../components/views/DetailsView'

const DashRoutes = () => {
  return (
    <Routes>
      <Route path="mantenedor-usuarios" element={<UserMaintainer />} />
      <Route path="sys" element={<HomeScreen showNewTicket={true} />} />
      <Route path="email/:id" element={<DetailsView from="EX" />} />
      <Route path="in/:id" element={<DetailsView from="IN" />} />
      <Route path="/" element={<HomeScreen />} />
    </Routes>
  )
}

export default DashRoutes
