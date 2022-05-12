import React, { useContext, useEffect, useState } from 'react'
import { Ticket } from '../../context/Ticket'
import Td from '../ui/table/Td'
import Th from '../ui/table/Th'
import THead from '../ui/table/THead'
import moment from 'moment'
import TBody from '../ui/table/TBody'
import Table from '../ui/table/Table'
import Button from '../ui/button/Button'
import Input from '../ui/input/Input'
import ComboBox from '../ui/ComboBox'
import { useForm } from '../../hooks/useForm'

const formatArray = (array, hashValue, hashLabel) => {

  const format = array.map(item => {
    return {
      label: item[hashLabel],
      value: item[hashValue]
    }
  })

  return format

}

const HomeTable = ({ openModal, openForm, data, multiLine, idRow }) => {

  const { user, getProjects, getUsers, getStates } = useContext(Ticket)

  const [{ id, titulo, desc }, handleChange, reset] = useForm({
    id: '',
    titulo: '',
    desc: '',
  })

  const [select, setSelect] = useState({
    proyectos: [],
    solita: [],
    estados: [],
  })

  const [options, setOptions] = useState({
    proyectos: [],
    solita: [],
    estados: [],
  })

  const formatFilters = async () => {

    const condition = select.proyectos.map(item => item.value)

    const params = { rut_usuario: user.rut, proyectos: condition }

    const pr = await getProjects()
    const us = await getUsers(params)
    const st = await getStates(params)

    setOptions({
      proyectos: formatArray(pr, 'id_proyecto', 'desc_proyecto'),
      solita: formatArray(us, 'rut', 'nombre'),
      estados: formatArray(st, 'id', 'est')
    })

  }

  const handleChangeSelect = (option, target) => {
    setSelect({
      ...select,
      [target.name]: option,
    })
  }

  const handleReset = () => {
    reset()
    setSelect({
      proyectos: { label: 'Ninguno', value: '' },
      solita: { label: 'Ninguno', value: '' },
      estados: { label: 'Ninguno', value: '' },
    })
  }

  const handleFilter = () => {
    console.log('filtros', select, id, titulo, desc)
  }

  useEffect(() => {
    formatFilters()
  }, [select.proyectos])


  return (
    <div className='px-2 lg:px-5 text-xs md:text-base'>

      <Table width='w-table'>

        <THead>

          {/* <tr className='text-sm font-semibold text-center capitalize bg-gray-700'>
            <Th width='w-10'>
              <Button
                className='rounded-lg bg-blue-500 hover:bg-blue-600 text-white'
                type='icon'
                icon='fas fa-eraser'
                onClick={handleReset}
              />
            </Th>
            <Th width='w-28' className='bg-gray-600'>
              <div className='flex justify-between items-center'>
                <Button
                  className='hover:bg-gray-800 text-white rounded-full flex justify-center items-center'
                  type='icon'
                  icon='fas fa-chevron-up fa-xs'
                  size='h-6 w-6'
                />

                <Input
                  isFilter
                  placeholder=''
                  width='w-16'
                  name='id'
                  value={id}
                  onChange={handleChange}
                />

                <Button
                  className='hover:bg-gray-800 text-white rounded-full flex justify-center items-center'
                  type='icon'
                  icon='fas fa-chevron-down fa-xs'
                  size='h-6 w-6'
                />
              </div>
            </Th>
            <Th width='w-20'>
              <div className='flex justify-between items-center'>
                <Button
                  className='hover:bg-gray-800 text-white rounded-full flex justify-center items-center'
                  type='icon'
                  icon='fas fa-chevron-up fa-xs'
                  size='h-6 w-6'
                />

                <Button
                  className='hover:bg-gray-800 text-white rounded-full flex justify-center items-center'
                  type='icon'
                  icon='fas fa-chevron-down fa-xs'
                  size='h-6 w-6'
                />
              </div>
            </Th>
            <Th width='w-36' className='bg-gray-600'>
              <ComboBox
                placeholder=''
                onChange={handleChangeSelect}
                value={select.proyectos}
                name='proyectos'
                options={options.proyectos}
                isMulti
              />
            </Th>
            <Th width='w-32'>
              <ComboBox
                placeholder=''
                onChange={handleChangeSelect}
                value={select.solita}
                name='solita'
                options={options.solita}
                isMulti
              />
            </Th>
            <Th width='w-60' className='bg-gray-600'>
              <Input
                isFilter
                placeholder=''
                name='titulo'
                value={titulo}
                onChange={handleChange}
              />
            </Th>
            <Th width='w-96'>
              <Input
                isFilter
                placeholder=''
                name='desc'
                value={desc}
                onChange={handleChange}
              />
            </Th>
            <Th width='w-32' className='bg-gray-600'>
              <ComboBox
                placeholder=''
                onChange={handleChangeSelect}
                value={select.estados}
                name='estados'
                options={options.estados}
                isMulti
              />
            </Th>
            {
              user.isAdmin ?
                <Th width='w-28'>
                  <Button
                    className='rounded-full bg-blue-500 hover:bg-blue-600 text-white'
                    type='iconText'
                    name='filtrar'
                    icon='fas fa-filter'
                    onClick={handleFilter}
                  />
                </Th>
                : null}
          </tr> */}

          <tr className='text-sm font-semibold text-center capitalize text-white bg-gray-700'>
            <Th>#</Th>
            <Th className='bg-gray-600'> ID </Th>
            <Th>fecha</Th>
            <Th className='bg-gray-600'>
              proyecto
              <span className='block text-gray-300'>(empresa)</span>
            </Th>
            <Th>solicita</Th>
            <Th className='bg-gray-600'> titulo </Th>
            <Th>descripcion</Th>
            <Th className='bg-gray-600'> estado </Th>
            {user.isAdmin ? <Th>Acciones</Th> : null}
            {/* <Th width='w-20'>
                  prioridad
                  <span className='block text-gray-300 font-normal'>
                    (cliente)
                  </span>
                </Th> */}
          </tr>

        </THead>

        <TBody>
          {data.length > 0 &&
            data.map((ticket, i) => (
              <tr
                onDoubleClick={() => openForm(ticket.id_ticket)}
                key={ticket.id_ticket}
                className={`
                  text-gray-700 text-sm border-b w-max
                  hover:bg-blue-100 transition duration-300 cursor-pointer
                  ${i % 2 === 0 ? 'bg-gray-100' : 'bg-white'}
                  ${idRow === ticket.id_ticket && 'bg-purple-100'}
                  ${!multiLine && 'align-text-top'}
                  `}
              >
                <Td>
                  <span className='px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-md'>
                    {i + 1}
                  </span>
                </Td>
                <Td className='font-semibold text-black'>
                  {ticket.id_ticket}
                </Td>
                <Td>
                  {moment(ticket.fecha_hora_tx).format('DD/MM/YYYY')}
                  <span className='block text-gray-400'>
                    {moment(ticket.fecha_hora_tx).format('HH:MM')}
                  </span>
                </Td>
                <Td>
                  {ticket.proyecto}
                  <span className='block text-gray-400'>
                    ({ticket.empresa})
                  </span>
                </Td>
                <Td className='uppercase'>{ticket.user_ticket}</Td>
                <Td
                  className='font-semibold text-black'
                  isMultiLine={multiLine}
                  width='max-w-title'
                  align='text-left'
                >
                  {ticket.titulo_ticket}
                </Td>
                <Td
                  width='max-w-desc'
                  isMultiLine={multiLine}
                  align='text-left'
                >
                  {ticket.desc_requerimiento}
                </Td>
                <Td
                  className={`
                    font-semibold ${ticket.tiene_pendientes ? 'text-red-600' : 'text-gray-700'
                    }
                    `}
                >
                  {ticket.desc_estado}
                </Td>
                {user.isAdmin ?
                  <Td>
                    <Button
                      disabled={ticket.desc_estado !== 'En Fila'}
                      className='bg-transparent hover:bg-blue-50 text-gray-700 hover:text-blue-500 rounded-md'
                      type='icon'
                      icon='fas fa-file-medical fa-lg'
                      onClick={() => openModal(ticket)}
                    />
                  </Td>
                  : null
                }
                {/* <Td>{ticket.prio_cl}</Td> */}
              </tr>
            ))}
        </TBody>

      </Table>

    </div>
  )
}

export default HomeTable