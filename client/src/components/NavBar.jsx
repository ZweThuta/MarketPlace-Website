import { Link, useRouteLoaderData } from "react-router-dom";
import logo from "../logo/LuxeSphere_Logo.png";
import { useAuth } from "../util/AuthContext";
import { UserCircleIcon } from "@heroicons/react/24/solid";
const NavBar = () => {
  const {authToken} = useAuth();
  return (
    <nav className="flex items-center justify-between py-1 bg-richChocolate">
      <Link to={"/"}>
        <div className="flex items-center gap-1">
          <img src={logo} alt="LuxeSphere Logo" width={60} className="ml-2" />
          <div>
          <h1 className="text-xl text-ivoryWhite font-semibold uppercase antialiased tracking-widest">LuxeSphere</h1>
          <p className="text-gray-100 text-xs font-light tracking-wide">Online Market Place</p>
          </div>         
        </div>
      </Link>
      {authToken ? (
        <>
        <div className="flex items-center mr-4">
          <Link to={"/profile"}>
            <div className="flex items-center gap-1 mr-4 p-1 rounded-md  text-ivoryWhite cursor-pointer">
              <UserCircleIcon color="white" width={30} />
              <p className="text-white pr-2 hover:text-gray-200 font-semibold ">
                Profile
              </p>
            </div>
          </Link>
          <Link
              to="/logout"
              className="text-white font-semibold hover:text-gray-200"
              aria-label="Logout"
            >
              Logout
            </Link>
            </div>
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
