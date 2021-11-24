import React, { useContext, useEffect, useState } from 'react'
import HomeScreen from './components/screens/HomeScreen'
import LoginScreen from './components/screens/LoginScreen'
import Loading from './components/ui/loading/Loading'
import { Ticket } from './context/Ticket'
import { Ui } from './context/Ui'

function App() {
  const { login, validateSession } = useContext(Ticket)
  const { toggleLoading, loading } = useContext(Ui)
  const [isLogin, setIsLogin] = useState(false)

  const handleLogin = async (pin, reset) => {
    toggleLoading(true)
    const loginState = await login({ pin })
    if (loginState) { setIsLogin(true) }
    reset()
  }

  useEffect(() => {
    // const url = window.location.search.substring(1)
    // const from = findParam(url, '=')
    // if (from.param === 'SIS') return
    if (localStorage.getItem('ticketToken') !== null) {
      const reNew = async () => {
        toggleLoading(true)
        const reNewState = await validateSession()
        setIsLogin(reNewState)
      }
      reNew()
    }
  }, [])

  return (
    <>
      {
        isLogin ? <HomeScreen /> : <LoginScreen onLogin={handleLogin} />
      }
      <Loading show={loading} />
    </>
  )
}

export default App
