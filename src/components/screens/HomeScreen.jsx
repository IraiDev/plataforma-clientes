import React, { useContext, useEffect, useState } from 'react'
import { Ui } from '../../context/Ui'
import NavBar from '../ui/navbar/NavBar'
import Loading from '../ui/loading/Loading'
import ListView from '../views/ListView'



function HomeScreen() {
  const { loading } = useContext(Ui)
  const [multiLine, setMultiline] = useState(true)

  useEffect(() => {
  }, [])

  return (
    <>
      <div className="bg-gray-100 h-screen w-full">
        <NavBar onMultiLine={() => setMultiline(!multiLine)} isMultiLine={multiLine} />
        <ListView multiLine={multiLine} />
      </div>

      <Loading show={loading} />
    </>
  )
}

export default HomeScreen
