import React, { useState } from 'react'
import NavBar from '../ui/navbar/NavBar'
import Column from '../ui/table/Column'
import Table from '../ui/table/Table'
import TBody from '../ui/table/TBody'
import THead from '../ui/table/THead'
import { v4 as uuidv4 } from 'uuid'

let arrayTest = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
const columnTickets = [
  { id: uuidv4(), title: 'Numero', subTitle: null },
  { id: uuidv4(), title: 'fecha', subTitle: null },
  { id: uuidv4(), title: 'empresa', subTitle: 'proyecto' },
  { id: uuidv4(), title: 'solicita', subTitle: null },
  { id: uuidv4(), title: 'titulo', subTitle: null },
  { id: uuidv4(), title: 'descripcion', subTitle: null },
  { id: uuidv4(), title: 'estado', subTitle: null },
  { id: uuidv4(), title: 'prioridad', subTitle: 'cliente' },
]

function HomeScreen() {

  const [multiLine, setMultiline] = useState(true)

  return (
    <div className="bg-gray-100 h-screen w-full">
      <NavBar onMultiLine={() => setMultiline(!multiLine)} isMultiLine={multiLine} />
      <div className="relative">
        <Table>
          <THead>
            {
              columnTickets.map((item, index) => (
                <Column
                  key={item.id}
                  className={`text-white text-center w-full
                  ${item.subTitle === null ? 'p-5' : 'p-2'}
                  ${index % 2 === 0 ? 'bg-gray-600' : 'bg-gray-700'}
                  ${index === 0 ? 'rounded-l-lg' : index + 1 === columnTickets.length ? 'rounded-r-lg' : ''}
                  ${item.title === 'descripcion' ? 'col-span-4' : item.title === 'titulo' ? 'col-span-2' : 'col-span-1'}
                  `}
                  value={item.title}
                  secValue={item.subTitle !== null ? item.subTitle : ''}
                  isSecValue={item.subTitle !== null} />
              ))
            }
          </THead>
          {
            arrayTest.map(item => (
              <TBody key={item} numero={item} isMultiLine={multiLine} />
            ))
          }
        </Table>
      </div>
    </div>
  )
}

export default HomeScreen
