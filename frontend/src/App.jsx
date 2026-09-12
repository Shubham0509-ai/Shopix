import { useState } from 'react'
import { Outlet } from 'react-router'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <Outlet />
    </div>
  )
}

export default App
