import Footer from '../components/Footer';
import NavBar from '../components/NavBar'
import { Outlet } from 'react-router-dom'
import ScrollToTop from '../util/ScrollToTop ';
const Main = () => {
  return (
    <>
    <ScrollToTop/>
        <NavBar/>
        <Outlet/>
        <Footer/>
    </>
  )
}

export default Main;
