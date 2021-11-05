import React from 'react'
import TextArea from '../input/TextArea'

function Form() {
  return (
    <div className="w-full">
      <div className="text-xl capitalize border-b pb-5 mb-5">
        <h1 className="font-semibold inline">Ticket:</h1>
        <h1 className="inline ml-2">990</h1>
        <h1 className="font-semibold inline">; actividad:</h1>
        <h1 className="inline ml-2">20990, nombre actividad</h1>
        <br />
        <h1 className="font-semibold inline">Empresa:</h1>
        <h1 className="inline ml-2">CUR2, Usuario</h1>
      </div>
      <div className="border-b pb-5 mb-5">
        <h5 className="capitalize text-lg font-semibolds mb-2">mensaje ticket</h5>
        {/* <TextArea /> */}
        <p className="font-light">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Magnam amet facere exercitationem autem. Rerum aliquam officia eaque provident sequi quibusdam deserunt iusto, eum nisi iure dolorem recusandae nobis exercitationem facilis.</p>
      </div>

    </div>
  )
}

export default Form
