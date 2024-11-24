import { Link } from "react-router-dom";
import logo from "../logo/cat.png";
import { UserCircleIcon } from "@heroicons/react/24/solid";
const NavBar = () => {
  return (
    <nav className="flex items-center justify-between py-3 bg-slate-800">
      <Link to={"/"}>
        <div className="flex items-center gap-2">
          <img src={logo} alt="Market Place.io Logo" className="w-11 ml-2" />
          <h1 className="text-xl text-white font-semibold">Market Place.io</h1>
        </div>
      </Link>
      {localStorage.getItem("authToken") ? (
        <>
          <Link to={"/profile"}>
            <div className="flex items-center gap-1 mr-4 p-1 rounded-md  text-white bg-gray-800 hover:bg-gray-700 focus:outline-none cursor-pointer">
              <UserCircleIcon color="white" width={30} />
              <p className="text-white pr-2 hover:text-gray-200 font-semibold ">
                Profile
              </p>
            </div>
          </Link>
        </>
      ) : (
        <>
          {" "}
          <div className="flex gap-5 mr-5">
            <Link
              to="/login"
              className="text-white font-semibold hover:text-gray-200"
              aria-label="Login"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-white font-semibold hover:text-gray-200"
              aria-label="Register"
            >
              Register
            </Link>
          </div>
        </>
      )}
    </nav>
  );
};

export default NavBar;
