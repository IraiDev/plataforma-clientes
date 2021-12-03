import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'
import reportWebVitals from './reportWebVitals'
import App from './App'
import './assets/css/index.css';
import './assets/css/style.css';
import UiProvider from './context/Ui'
import TicketProvider from './context/Ticket'

ReactDOM.render(
  <BrowserRouter>
    <UiProvider>
      <TicketProvider>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </TicketProvider>
    </UiProvider>
  </BrowserRouter>,
  document.getElementById('root')
)
serviceWorkerRegistration.unregister()
reportWebVitals()
