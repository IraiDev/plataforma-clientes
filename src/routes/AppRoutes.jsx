import { Routes, Route } from 'react-router-dom'
import HomeScreen from '../components/screens/HomeScreen'
import LoginScreen from '../components/screens/LoginScreen'
import DetailsView from '../components/views/DetailsView'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" >
        <LoginScreen />
      </Route>
      <Route path="/email/:id" >
        <DetailsView />
      </Route>
      <Route path="/in/:id" >
        <DetailsView />
      </Route>
      <Route path="/" >
        <HomeScreen />
      </Route>
    </Routes>
  )
}

export default AppRoutes
