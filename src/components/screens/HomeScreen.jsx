import React, { useContext, useEffect, useState } from 'react'
import { Ui } from '../../context/Ui'
import { Ticket } from '../../context/Ticket'
import NavBar from '../ui/navbar/NavBar'
import Loading from '../ui/loading/Loading'
import ListView from '../views/ListView'
import { findParam } from '../../helpers/helpers'
import DetailsView from '../views/DetailsView'

function HomeScreen() {
  const { loading } = useContext(Ui)
  const { getTicketDetails, ticketDetail } = useContext(Ticket)
  const [multiLine, setMultiline] = useState(true)
  const [view, setView] = useState({ ok: true, from: null })
  // const [data, setData] = useState({})

  // const getData = async (id) => {
  //   const resp = await getTicketDetails(id)
  //   setData(resp)
  // }

  useEffect(() => {
    const base_url = window.location.search.substring(1)
    const { url, param } = findParam(base_url, '=')

    if (param === 'email') {
      const { param: id } = findParam(url, '=')
      // console.log('id ticket: ', id)
      getTicketDetails(id)
      setView({ ok: false, from: 'EX' })
    }

    if (param === 'IN') {
      const { param: id, url: url_act } = findParam(url, '=')
      // console.log('resto url: ', url_act)
      // console.log('ticket id: ', id)
      getTicketDetails(id)
      setView({ ok: false, from: 'IN' })
    }
  }, [])

  return (
    <>
      <div className="h-screen w-full">
        <NavBar onMultiLine={() => setMultiline(!multiLine)} isMultiLine={multiLine} />
        {view.ok ? <ListView multiLine={multiLine} /> : <DetailsView from={view.from} data={ticketDetail} />}
      </div>

      <Loading show={loading} />
    </>
  )
}

export default HomeScreen
