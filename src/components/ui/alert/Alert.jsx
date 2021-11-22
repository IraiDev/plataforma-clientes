import React from 'react'
import ReactDOM from 'react-dom'
import Button from '../button/Button'

const portal = document.getElementById('alert-root')

let iconShow

const Alert = ({
  children,
  show,
  onAction,
  onCancel,
  isBlur = false,
  showCancelButton = true,
  showConfirmButton = true,
  showButton = true,
  showIcon = true,
  html = false,
  title = 'titulo',
  icon = 'info',
  content = 'Voluptas cumque magnam unde numquam tempora omnis amet aliquid praesentium.'
}) => {

  const onBlur = () => {
    if (isBlur) {
      onCancel()
    }
  }

  switch (icon) {
    case 'warning':
      iconShow = 'fa-exclamation-circle text-yellow-400'
      break
    case 'quest':
      iconShow = 'fa-question-circle text-blue-400'
      break
    case 'error':
      iconShow = 'fa-exclamation-circle text-red-400'
      break
    case 'info':
      iconShow = 'fa-info-circle text-blue-400'
      break
    default:
      iconShow = 'fa-info-circle text-blue-400'
      break
  }

  if (show) {
    return ReactDOM.createPortal(
      <div className="fixed top-0 bottom-0 left-0 right-0 z-50 flex items-center justify-center">
        <div
          onClick={onBlur}
          className="fixed top-0 bottom-0 left-0 right-0 z-auto bg-black bg-opacity-25" />
        <div className={`relative bg-white rounded-md shadow-xl h-auto w-96 p-5 text-center grid gap-8 animate__animated animate__bounce animate__faster`}>
          <div>
            <h1 className={`inline mr-2 text-2xl font-semibold ${showIcon && 'capitalize'}`}>{title}</h1>
            {showIcon && <i className={`fas ${iconShow} fa-2x`}></i>}
          </div>
          {html ?
            children
            : <p className="text-gray-600">{content}</p>
          }
          {showButton &&
            <div className="flex items-center justify-center gap-4">
              {showConfirmButton &&
                <Button
                  name="aceptar"
                  className="bg-blue-400 hover:bg-blue-500 text-white rounded-full"
                  shadow
                  onClick={onAction} />}
              {showCancelButton &&
                <Button
                  name="cancelar"
                  className="bg-red-400 hover:bg-red-500 text-white rounded-full"
                  shadow
                  onClick={onCancel} />}
            </div>
          }
        </div>
      </div>, portal)
  }

  return null
}

export default Alert
