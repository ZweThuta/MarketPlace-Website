import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import { Outlet } from "react-router-dom";
import ScrollToTop from "../util/ScrollToTop ";
import ChatBot from "../components/ChatBot";
const Main = () => {
  return (
    <>
      <ScrollToTop />
      <NavBar />
      <Outlet />
      <Footer />
      <ChatBot />
    </>
  );
};

export default Main;
