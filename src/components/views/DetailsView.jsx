import { useContext, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Ticket } from '../../context/Ticket'
import { Alert } from '../../helpers/alerts'
import Form from '../ui/form/Form'
import NavBar from '../ui/navbar/NavBar'

function DetailsView({ from }) {

  const { id } = useParams()
  const navigate = useNavigate()
  const { getTicketDetails, ticketDetail } = useContext(Ticket)

  const getDetail = async () => {
    const resp = await getTicketDetails(id)
    const { ok } = resp
    if (!ok) {
      navigate('/', { replace: true })
      Alert({
        icon: 'error',
        title: 'Atencion',
        content: 'El ticket apuntado no existe, se rediccionara a la pagina de inicio',
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
          {Object.keys(ticketDetail).length > 0 &&
            <Form from={from} data={ticketDetail} onClick={() => { }} />
          }
        </div>
      </div>
    </>
  )
}

export default DetailsView
