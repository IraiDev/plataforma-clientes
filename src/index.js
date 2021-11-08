import React from 'react'
import ReactDOM from 'react-dom'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'
import reportWebVitals from './reportWebVitals'
import App from './App'
import './assets/css/index.css';
import TicketProvider from './context/Ticket'

ReactDOM.render(
  <TicketProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </TicketProvider>,
  document.getElementById('root')
)
serviceWorkerRegistration.unregister()
reportWebVitals()
