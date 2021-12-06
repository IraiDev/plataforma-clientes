import React, { useContext, useState } from 'react'
import { Ui } from '../../context/Ui'
import NavBar from '../ui/navbar/NavBar'
import Loading from '../ui/loading/Loading'
import ListView from '../views/ListView'

export const HomeScreen = () => {
  const { loading } = useContext(Ui)
  const [multiLine, setMultiline] = useState(true)

  return (
    <>
      <div className="h-screen w-full">
        <NavBar onMultiLine={() => setMultiline(!multiLine)} isMultiLine={multiLine} />
        <ListView multiLine={multiLine} />
      </div>

      <Loading show={loading} />
    </>
  )
}
