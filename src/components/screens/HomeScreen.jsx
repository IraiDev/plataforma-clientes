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
  const { getTicketDetails } = useContext(Ticket)
  const [multiLine, setMultiline] = useState(true)
  const [view, setView] = useState(true)
  const [data, setData] = useState({})

  const getData = async (id) => {
    const resp = await getTicketDetails(id)
    setData(resp)
  }

  useEffect(() => {
    const base_url = window.location.search.substring(1)
    const { url, param } = findParam(base_url, '=')

    if (param === 'email') {
      const { param: id } = findParam(url, '=')
      console.log('id ticket: ', id)
      getData(id)
      setView(false)
    }

    if (param === 'IN') {
      const { param: id, url: url_act } = findParam(url, '=')
      console.log('ticket id: ', id)
      getData(id)
      console.log('resto url: ', url_act)
      setView(false)
    }
  }, [])

  return (
    <>
      <div className="h-screen w-full">
        <NavBar onMultiLine={() => setMultiline(!multiLine)} isMultiLine={multiLine} />
        {view ? <ListView multiLine={multiLine} /> : <DetailsView data={data} />}
      </div>

      <Loading show={loading} />
    </>
  )
}

export default HomeScreen
