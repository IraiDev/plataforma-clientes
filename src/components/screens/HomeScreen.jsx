import React, { useState } from 'react'
import NavBar from '../ui/navbar/NavBar'
import Table from '../ui/table/Table'

function HomeScreen() {

  const [multiLine, setMultiline] = useState(true)

  return (
    <div className="bg-gray-100 h-screen w-full">
      <NavBar onMultiLine={() => setMultiline(!multiLine)} isMultiLine={multiLine} />
      <div className="relative">
        <Table isMultiLine={multiLine} />
      </div>
    </div>
  )
}

export default HomeScreen
