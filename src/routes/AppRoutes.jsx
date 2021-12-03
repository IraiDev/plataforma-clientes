import { Switch, Route } from 'react-router-dom'
import HomeScreen from '../components/screens/HomeScreen'
import LoginScreen from '../components/screens/LoginScreen'
import DetailsView from '../components/views/DetailsView'

function AppRoutes() {
  return (
    <Switch>
      <Route exact path="/login" >
        <LoginScreen />
      </Route>
      <Route exact path="/email/:id" >
        <DetailsView />
      </Route>
      <Route exact path="/in/:id" >
        <DetailsView />
      </Route>
      <Route exact path="/" >
        <HomeScreen />
      </Route>
    </Switch>
  )
}

export default AppRoutes
