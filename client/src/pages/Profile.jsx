import { PlusCircleIcon } from "@heroicons/react/24/solid";
import logo from "../logo/cat.png";
import { Link } from "react-router-dom";

const ButtonLink = ({ to, children }) => (
  <Link
    to={to}
    className="rounded-md bg-richChocolate800 py-2 px-4 border border-transparent text-center text-sm text-ivoryWhite transition-all shadow-md hover:shadow-lg focus:bg-richChocolate900 focus:shadow-none active:bg-richChocolate900 hover:bg-richChocolate900 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
  >
    {children}
  </Link>
);

const Profile = () => {
  return (
    <section className="mt-4">
      <div className="text-center h-auto mb-10">
        <div className="flex flex-col items-center">
          <div className="w-60 h-60 border-4 border-richChocolate900 rounded-full overflow-hidden flex items-center justify-center">
            <img src={logo} alt="profile" className="w-full h-full object-cover" />
          </div>
          <p className="mt-2 text-lg font-semibold">Meow Meow</p>
        </div>
      </div>

      <div className="flex gap-10 items-center justify-center m-10">
        <ButtonLink to="/addProduct">Add new product</ButtonLink>
        <ButtonLink to="/userProduct">View Products</ButtonLink>
        <ButtonLink to="/noti">Notification</ButtonLink>
      </div>
    </section>
  );
};

export default Profile;