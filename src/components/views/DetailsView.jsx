import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Ticket } from '../../context/Ticket'
import { Alert } from '../../helpers/alerts'
import Form from '../ui/form/Form'
import NavBar from '../ui/navbar/NavBar'

function DetailsView({ from }) {

  const { id } = useParams()
  const { getTicketDetails } = useContext(Ticket)
  const [detailData, setDetailData] = useState({})

  const getDetail = async () => {
    const resp = await getTicketDetails(id)
    const { ok, data } = resp
    if (ok) {

      setDetailData(data)
    }
    else {
      Alert({
        icon: 'error',
        title: 'Error',
        content: 'Error al obtener los datos del ticket',
        showCancelButton: false,
      })
    }
  }

  useEffect(() => {
    getDetail()
    // eslint-disable-next-line
  }, [])

  return (
    <>
      <NavBar hiddenOption={true} showGoTo={true} />
      <div className="container mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-5 md:p-10 my-10 overflow-custom">
          {Object.keys(detailData).length > 0 &&
            <Form from={from} data={detailData} onClick={() => { }} />
          }
        </div>
      </div>
    </>
  )
}

export default DetailsView
