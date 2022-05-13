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
import { Alert } from '../../helpers/alerts'
import { Ui } from '../../context/Ui'
import { Pagination } from '@mui/material'

const formatArray = (array, hashValue, hashLabel) => {

  const format = array.map(item => {
    return {
      label: item[hashLabel],
      value: item[hashValue]
    }
  })

  return format

}

const HomeTable = ({ openModal, openForm, multiLine, idRow }) => {

  const { user, getProjects, getUsers, getStates, deleteTicket, getTicketList } = useContext(Ticket)
  const { toggleLoading, refreshTickets } = useContext(Ui)

  const [tickets, setTickets] = useState([])
  const [page, setPage] = useState(1)
  const [offset, setOffset] = useState(0)
  const [total, setTotal] = useState(0)
  const [order, setOrder] = useState({ name: '', value: '' })

  const [{ id, titulo, desc }, handleChange, reset] = useForm({
    id: '',
    titulo: '',
    desc: '',
  })

  const [select, setSelect] = useState({
    proyectos: [],
    solita: [],
    estados: [],
    limite: { label: '10', value: 10 },
  })

  const [options, setOptions] = useState({
    proyectos: [],
    solita: [],
    estados: [],
  })

  const getData = async (reset = false) => {

    toggleLoading(true)

    const filters = {
      id_ticket: !reset ? id : '',
      emisores: ['T'],
      estados: ['T'],
      proyectos: ['T'],
      proyectos_tabla: !reset ? select.proyectos.map(item => item.value) : [],
      estados_tabla: !reset ? select.estados.map(item => item.value) : [],
      solicita_tabla: !reset ? select.solita.map(item => item.value) : [],
      titulo: !reset ? titulo : '',
      descripcion: !reset ? desc : '',
      orden_id_ticket: !reset ? order.name === 'id' ? order.value : '' : '',
      orden_fecha: !reset ? order.name === 'fecha' ? order.value : '' : '',
      offset: !reset ? offset : 0,
      limit: !reset ? select.limite.value : 10,
    }

    const data = await getTicketList({ rut_usuario: user.rut, ...filters })
    toggleLoading(false)
    setTickets(data.res)
    setTotal(data.total_ticket)
  }

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
      proyectos: [],
      solita: [],
      estados: [],
      limite: { label: '10', value: 10 },
    })
    setOrder({ name: '', value: '' })
    getData(true)
  }

  const handleFilter = () => {
    setPage(1)
    setOffset(0)
    getData()
  }

  const handleDelete = (id) => {

    Alert({
      icon: 'warn',
      title: 'Eliminar',
      content: `¿Está seguro de eliminar el ticket: <b>${id}</b>?`,
      confirmText: 'Si, Eliminar',
      cancelText: 'No, Cancelar',
      action: () => {
        deleteTicket(id)
        toggleLoading(true)
      }
    })

  }

  const handleChangePage = (e, value) => {
    setOffset(((value - 1) * select.limite.value) % total)
    setPage(value)
  }

  const handleOrder = (name, param) => {
    setOrder({ name, value: param })
  }

  useEffect(() => {
    formatFilters()
  }, [select.proyectos])

  useEffect(() => {
    getData()
    // eslint-disable-next-line
  }, [page, select.limite, total, refreshTickets, order])


  return (
    <div className='px-2 lg:px-5 text-xs md:text-base'>

      <Table width='w-table'>

        <THead>

          <tr className='text-sm font-semibold text-center capitalize bg-gray-700'>
            <Th width='w-10'>
              <Button
                className='rounded-lg bg-blue-500 hover:bg-blue-600 text-white'
                type='icon'
                icon='fas fa-eraser'
                onClick={handleReset}
              />
            </Th>
            <Th width='w-28' className='bg-gray-600'>
              <Input
                isFilter
                placeholder=''
                name='id'
                value={id}
                onChange={handleChange}
              />
            </Th>
            <Th width='w-24'></Th>
            <Th width='w-40' className='bg-gray-600'>
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
            <Th width='w-28'>
              <Button
                className='rounded-full bg-blue-500 hover:bg-blue-600 text-white'
                type='iconText'
                name='filtrar'
                icon='fas fa-filter'
                onClick={handleFilter}
              />
            </Th>
          </tr>

          <tr className='text-sm font-semibold text-center capitalize text-white bg-gray-700'>
            <Th>#</Th>
            <Th className='bg-gray-600'>
              <div className='flex justify-between items-center'>
                <Button
                  className={`hover:bg-gray-800 rounded-full 
                    flex justify-center items-center
                    ${order.name === 'id' && order.value === 'asc' ? 'text-red-500' : 'text-white'}
                    `}
                  type='icon'
                  icon='fas fa-chevron-up fa-xs'
                  size='h-6 w-6'
                  onClick={() => handleOrder('id', 'asc')}
                />
                ID
                <Button
                  className={`hover:bg-gray-800 rounded-full 
                    flex justify-center items-center
                    ${order.name === 'id' && order.value === 'desc' ? 'text-red-500' : 'text-white'}
                    `}
                  type='icon'
                  icon='fas fa-chevron-down fa-xs'
                  size='h-6 w-6'
                  onClick={() => handleOrder('id', 'desc')}
                />
              </div>
            </Th>
            <Th>
              <div className='flex justify-between items-center'>
                <Button
                  className={`hover:bg-gray-800 rounded-full 
                    flex justify-center items-center
                    ${order.name === 'fecha' && order.value === 'asc' ? 'text-red-500' : 'text-white'}
                    `}
                  type='icon'
                  icon='fas fa-chevron-up fa-xs'
                  size='h-6 w-6'
                  onClick={() => handleOrder('fecha', 'asc')}
                />

                Fecha

                <Button
                  className={`hover:bg-gray-800 rounded-full 
                    flex justify-center items-center
                    ${order.name === 'fecha' && order.value === 'desc' ? 'text-red-500' : 'text-white'}
                    `}
                  type='icon'
                  icon='fas fa-chevron-down fa-xs'
                  size='h-6 w-6'
                  onClick={() => handleOrder('fecha', 'desc')}
                />
              </div>
            </Th>
            <Th className='bg-gray-600'>
              <div className='flex justify-center gap-2 items-center'>
                proyecto
                <span className='block text-gray-300'>(empresa)</span>
              </div>
            </Th>
            <Th>solicita</Th>
            <Th className='bg-gray-600'> titulo </Th>
            <Th>descripcion</Th>
            <Th className='bg-gray-600'> estado </Th>
            <Th>Acciones</Th>
            {/* <Th width='w-20'>
                  prioridad
                  <span className='block text-gray-300 font-normal'>
                    (cliente)
                  </span>
                </Th> */}
          </tr>

        </THead>

        <TBody>
          {tickets.length > 0 &&
            tickets.map((ticket, i) => (
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
                      className='hover:bg-blue-50 text-gray-700 hover:text-blue-500 rounded-md'
                      type='icon'
                      icon='fas fa-file-medical'
                      onClick={() => openModal(ticket)}
                    />

                    <Button
                      disabled={ticket.desc_estado !== 'En Fila'}
                      className='hover:bg-blue-50 text-red-500 hover:text-red-600 rounded-md'
                      type='icon'
                      icon='fas fa-trash'
                      onClick={() => handleDelete(ticket.id_ticket)}
                    />
                  </Td>

                  : <Td></Td>
                }
                {/* <Td>{ticket.prio_cl}</Td> */}
              </tr>
            ))}
        </TBody>

      </Table>

      <footer className='fixed left-0 w-full bottom-0 h-12 bg-white shadow border-t flex justify-center items-center px-5'>

        <div className='flex gap-5 items-center'>
          <Pagination
            // siblingCount={size.width < 480 ? 0 : 1}
            // boundaryCount={size.width < 480 ? 0 : 1}
            size='small'
            count={Math.ceil(Number(total) / Number(select.limite.value))}
            color='primary'
            onChange={handleChangePage}
            page={page}
          />

          <ComboBox
            isNormalOptions
            name='limite'
            value={select.limite}
            onChange={handleChangeSelect}
            options={[
              { value: 10, label: '10' },
              { value: 25, label: '25' },
              { value: 50, label: '50' },
              { value: total, label: 'Todos' },
            ]}
          />

        </div>

      </footer>

    </div>
  )
}

export default HomeTable