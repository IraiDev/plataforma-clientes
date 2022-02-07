import { useContext, useState } from 'react'
import { Ui } from '../../context/Ui'
import NavBar from '../ui/navbar/NavBar'
import Loading from '../ui/loading/Loading'
import ListView from '../views/ListView'

export const HomeScreen = ({ showNewTicket = false }) => {
  const { loading } = useContext(Ui)
  const [multiLine, setMultiline] = useState(true)

  return (
    <>
      <div className='h-screen w-full bg-gray-50 overflow-auto'>
        <NavBar
          onMultiLine={() => setMultiline(!multiLine)}
          isMultiLine={multiLine}
          showModalTicket={showNewTicket}
        />
        <ListView multiLine={multiLine} />
      </div>

      <Loading show={loading} />
    </>
  )
}
