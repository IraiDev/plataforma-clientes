import React from 'react'
import TBody from './TBody'
import THead from './THead'

let arrayTest = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]

function Table({ isMultiLine }) {
  return (
    <div className="mx-5 xl:mx-16 2xl:mx-30 mt-10 h-5/6 fixed top-20 left-0 right-0 bottom-0 overflow-auto">
      <THead />
      <div className="h-full">
        {
          arrayTest.map(item => (
            <TBody key={item} numero={item} isMultiLine={isMultiLine} />
          ))
        }
      </div>
    </div>
  )
}

export default Table
