import React from 'react'

const HRLabel = ({ content }) => {
   return (
      <div className='relative w-full border-t border-gray-500'>
         <label className='absolute -top-4 left-0 right-0 bg-white mx-auto px-4 w-max capitalize text-gray-500'>{content}</label>
      </div>
   )
}

export default HRLabel
