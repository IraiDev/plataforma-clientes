import React, { useState } from 'react'
import Alert from '../alert/Alert'

function LiNotes(props) {

  const [alert, setAlert] = useState(false)

  return (
    <>
      <li
        {...props}
        className="cursor-pointer text-sm py-1.5 px-3 rounded-md border-2 border-transparent mt-2 transition duration-300 bg-white shadow-sm hover:border-blue-500 hover:text-blue-700"
        onClick={() => setAlert(true)} />
      <Alert
        show={alert}
        showCancelButton={false}
        showIcon={false}
        title={props.children}
        content={props.resp}
        onAction={() => setAlert(false)} />
    </>
  )
}

export default LiNotes
