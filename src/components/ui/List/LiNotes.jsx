import React from 'react'
import { Alert } from '../../../helpers/alerts'

function LiNotes(props) {

  const handleShowResp = () => {

    Alert({
      title: props.children,
      content: props.resp,
      showCancelButton: false
    })

  }

  return (
    <>
      <li
        {...props}
        onClick={handleShowResp}
        className="cursor-pointer text-sm py-1.5 px-3 rounded-md border-2 border-transparent mt-2 transition duration-300 bg-white shadow-sm hover:border-blue-500 hover:text-blue-700"
      />
    </>
  )
}

export default LiNotes
