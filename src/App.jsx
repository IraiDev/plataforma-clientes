import React, { useState } from 'react'
import HomeScreen from './components/screens/HomeScreen'
import LoginScreen from './components/screens/LoginScreen'

function App() {

  const [isLogin, setIsLogin] = useState(true)

  const handleLogin = (e) => {
    e.preventDefault()
    setIsLogin(true)
  }

  if (isLogin) return <HomeScreen />
  return <LoginScreen onLogin={handleLogin} />
}

export default App
