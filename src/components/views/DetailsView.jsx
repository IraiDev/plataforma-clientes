import React from 'react'
import Form from '../ui/form/Form'

function DetailsView({ data = {}, from }) {
  return (
    <div className="container mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-5 md:p-10 my-10 overflow-y-auto">
        {Object.keys(data).length > 0 &&
          <Form from={from} data={data} onClick={() => { }} />
        }
      </div>
    </div>
  )
}

export default DetailsView
