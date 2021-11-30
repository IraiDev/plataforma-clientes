import React from 'react'

function LiNotes(props) {

  return (
    <>
      <li
        {...props}
        className="cursor-pointer text-sm py-1.5 px-3 rounded-md border-2 border-transparent mt-2 transition duration-300 bg-white shadow-sm hover:border-blue-500 hover:text-blue-700"
      />
    </>
  )
}

export default LiNotes
