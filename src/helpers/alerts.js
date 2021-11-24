import Swal from 'sweetalert2'

const customClass = {
  cancelButton: 'focus:outline-none transition duration-500 capitalize py-2 px-4 font-semibold shadow-md rounded-full bg-red-400 hover:bg-red-500 text-white',
  confirmButton: 'focus:outline-none transition duration-500 capitalize py-2 px-4 font-semibold shadow-md rounded-full bg-blue-400 hover:bg-blue-500 text-white mr-2',
}

const showClass = {
  popup: 'animate__animated animate__bounce animate__faster',
  backdrop: 'swal2-backdrop-show',
  icon: 'swal2-icon-show'
}

const hideClass = {
  popup: 'animate__animated animate__fadeOutUp animate__faster',
  backdrop: 'swal2-backdrop-hide',
  icon: 'swal2-icon-hide'
}

export const showAlert = ({
  title = 'titulo',
  icon = 'fa-exclamation-circle',
  html = 'contenido',
  width = '24rem',
  showCancelButton = false,
  showConfirmButton = true,
  confirmButtonText = 'Aceptar',
  cancelButtonText = 'cancelar',
  timer = undefined,
  action = () => { return false }
}) => {

  switch (icon) {
    case 'warn':
      icon = 'fa-exclamation-circle text-yellow-500'
      break
    case 'info':
      icon = 'fa-exclamation-circle text-blue-500'
      break
    case 'error':
      icon = 'fa-exclamation-circle text-red-500'
      break
    case 'question':
      icon = 'fa-question-circle text-blue-500'
      break
    default:
      icon = 'fa-exclamation-circle text-blue-500'
      break
  }

  Swal.fire({
    hideClass,
    showClass,
    customClass,
    buttonsStyling: false,
    width,
    title: `<p class="text-xl capitalize">${title} <i class="fas ${icon}"></i></p>`,
    html: `<div class="text-base">${html}</div>`,
    showConfirmButton,
    showCancelButton,
    confirmButtonText,
    cancelButtonText,
    timer
  }).then((result) => {
    if (result.isConfirmed) action()
  })
}