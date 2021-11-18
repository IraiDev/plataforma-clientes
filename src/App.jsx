import React, { useContext, useEffect, useState } from 'react'
import HomeScreen from './components/screens/HomeScreen'
import LoginScreen from './components/screens/LoginScreen'
import Alert from './components/ui/alert/Alert'
import Loading from './components/ui/loading/Loading'
import { Ticket } from './context/Ticket'


function App() {
  const { login, validateSession, user } = useContext(Ticket)
  const [isLogin, setIsLogin] = useState(false)
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState(false)

  const handleLogin = async (pin, reset) => {
    setLoading(true)
    const loginState = await login({ pin })
    if (loginState) { setIsLogin(true) }
    else { setAlert(true) }
    setLoading(false)
    reset()
  }

  useEffect(() => {
    if (localStorage.getItem('ticketToken') !== null) {
      const reNew = async () => {
        setLoading(true)
        const reNewState = await validateSession()
        setIsLogin(reNewState)
        setLoading(false)
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
      <Alert
        show={alert}
        showCancelButton={false}
        icon={user.icon}
        title={user.title}
        content={user.content}
        onAction={() => setAlert(false)} />
    </>
  )
}

export default App
