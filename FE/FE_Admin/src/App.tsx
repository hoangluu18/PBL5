import { Outlet } from 'react-router-dom'
import NavBar from './pages/layouts/navbar'

function App() {

  return (
    <>
      <NavBar />
      <Outlet />
    </>
  )
}

export default App
