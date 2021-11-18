import React from 'react'
import TextArea from '../input/TextArea'
import Table from '../table/Table'
import THead from '../table/THead'
import { v4 as uuidv4 } from 'uuid'
import Column from '../table/Column'
import TBody from '../table/TBody'
import Button from '../button/Button'

const columnEvents = [
  { id: uuidv4(), title: '#', subTitle: null },
  { id: uuidv4(), title: 'fecha', subTitle: null },
  { id: uuidv4(), title: 'actividad', subTitle: 'proyecto' },
  { id: uuidv4(), title: 'emisor', subTitle: null },
  { id: uuidv4(), title: 'receptor', subTitle: null },
  { id: uuidv4(), title: 'contenido', subTitle: null }
]

const columnRows = [
  { id: 1111, date: '22-12-2021', id_act: 20211, user_e: 'IGNACIO', user_r: 'IGNACIO', desc: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Magnam amet facere exercitationem autem. Rerum aliquam officia eaque provident sequi quibusdam deserunt iusto, eum nisi iure dolorem recusandae nobis exercitationem facilis.' },
  { id: 2222, date: '22-12-2021', id_act: 20212, user_e: 'IGNACIO', user_r: 'IGNACIO', desc: 'Lorem ipsum dolor sit, amet consectetur adipisicing eum nisi iure dolorem recusandae nobis exercitationem facilis.' },
  { id: 3333, date: '22-12-2021', id_act: 20213, user_e: 'IGNACIO', user_r: 'IGNACIO', desc: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Magnam amet facere exercitationem autem. Rerum aliquam officia eaque provident sequi quibusdam deserunt iusto, eum nisi iure dolorem recusandae nobis exercitationem facilis.' },
  { id: 4444, date: '22-12-2021', id_act: 20214, user_e: 'IGNACIO', user_r: 'IGNACIO', desc: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Magnam amet facere exercitationem autem. Rerum aliquam officia eaque provident sequi quibusdam deserunt iusto, eum nisi iure dolorem recusandae nobis exercitationem facilis.' },
  { id: 5555, date: '22-12-2021', id_act: 20215, user_e: 'IGNACIO', user_r: 'IGNACIO', desc: 'Lorem ipsum dolor sit, amet consectetur adipisicing eum nisi iure dolorem recusandae nobis exercitationem facilis.' },
  { id: 6666, date: '22-12-2021', id_act: 20217, user_e: 'IGNACIO', user_r: 'IGNACIO', desc: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Magnam amet facere exercitationem autem. Rerum aliquam officia eaque provident sequi quibusdam deserunt iusto, eum nisi iure dolorem recusandae nobis exercitationem facilis.' },
]

function Form({ onClick }) {
  return (
    <div className="w-full mb-5">
      <div className="text-2xl capitalize">
        <h1 className="font-semibold inline">Ticket:</h1>
        <h1 className="inline ml-2">990</h1>
        <h1 className="font-semibold inline">; actividad:</h1>
        <h1 className="inline ml-2">20990, nombre actividad</h1>
        <br />
        <h1 className="font-semibold inline">Empresa:</h1>
        <h1 className="inline ml-2">CUR2, Usuario</h1>
      </div>
      <div className="border-b border-t border-gray-300 py-5 my-5">
        <h5 className="capitalize text-lg font-semibolds mb-2">mensaje ticket</h5>
        <p className="font-light">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Magnam amet facere exercitationem autem. Rerum aliquam officia eaque provident sequi quibusdam deserunt iusto, eum nisi iure dolorem recusandae nobis exercitationem facilis.</p>
      </div>
      <div className="h-80">
        <Table position margin >
          <THead width="min-w-table-md">
            {
              columnEvents.map((item, index) => (
                <Column
                  key={item.id}
                  className={`bg-gray-600 text-white text-center p-4
                  ${index === 5 ? 'col-span-7' : 'col-span-1'}
                  ${index === 0 ? 'rounded-l-md' : index === 5 && 'rounded-r-md'}
                  `}
                  value={item.title} />
              ))
            }
          </THead>
          {
            columnRows.map(item => (
              <TBody key={item.id} width="min-w-table-md" isModal={false}>
                {
                  Object.values(item).map((item, index) => (
                    <Column
                      key={item.id_act}
                      className={`bg-white text-center p-4 text-xs text-gray-600
                        ${index === 5 ? 'col-span-7 text-justify' : 'col-span-1 text-center'}
                        ${index === 0 ? 'rounded-l-md font-semibold' : index === 5 && 'rounded-r-md'}
                      `}
                      value={item} />
                  ))
                }
              </TBody>
            ))
          }
        </Table>
      </div>
      <TextArea field="Descripcion evento" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-10 items-center">
        <div className="text-sm bg-gray-100 rounded-lg p-2 w-full max-h-40 overflow-y-auto">
          <p className="capitalize">archivo seleccionado (max 5MB):</p>
          <p className="font-semibold">no hay archivo seleccionado</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            className="bg-yellow-500 hover:bg-yellow-400 text-white rounded-full w-full"
            shadow
            name="guardar pendiente" />
          <Button
            className="bg-green-500 hover:bg-green-400 text-white rounded-full w-full"
            shadow
            name="guardar OK" />
          <label
            className="capitalize text-center cursor-pointer bg-blue-500 hover:bg-blue-400 text-white transition duration-500 rounded-full py-2 px-4 font-semibold shadow-md w-full"
            htmlFor="inputFile">
            <input className="hidden" type="file" id="inputFile" />
            Subir archivo
          </label>
          <Button
            className="text-red-500 border border-red-400 hover:bg-red-400 w-full hover:text-white rounded-full"
            shadow
            name="cancelar"
            onClick={onClick} />
        </div>
      </div>
    </div>
  )
}

export default Form
