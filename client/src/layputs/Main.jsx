import NavBar from '../components/NavBar'
import { Outlet } from 'react-router-dom'
const Main = () => {
  return (
    <>
        <NavBar/>
        <Outlet/>
    </>
  )
}

export default Main;
