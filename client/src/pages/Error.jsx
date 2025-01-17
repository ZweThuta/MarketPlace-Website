import { Link, useNavigate } from "react-router-dom";
import ErrorIcon from "../logo/404Error.gif";
const Error = () => {
  const navigate = useNavigate();
  return (
    <>
      <div class="lg:px-24 lg:py-24 md:py-20 md:px-44 px-4 py-24 items-center flex justify-center flex-col-reverse lg:flex-row md:gap-28 gap-16 bg-customWhite2">
        <div class="xl:pt-24 w-full xl:w-1/2 relative pb-12 lg:pb-0">
          <div class="relative">
            <div class="absolute">
              <div class="flex flex-col justify-between">
                <h1 class="my-2 text-gray-800 font-bold text-2xl">
                  Looks like you've found the doorway to the great nothing
                </h1>
                <p class="my-2 text-gray-800">
                  Sorry about that! Please visit our hompage to get where you
                  need to go.
                </p>
                <div className="flex flex-row space-x-10">
                  <Link
                    to="/logout"
                    onClick={() => {
                      navigate("/");
                    }}
                  >
                    <button class="sm:w-full lg:w-auto my-2 border uppercase rounded md py-4 px-8 text-center  text-ivoryWhite bg-neroBlack950 hover:bg-transparent hover:border-2 hover:border-neroBlack950 hover:text-neroBlack950 focus:outline-none">
                      Take me there!
                    </button>
                  </Link>
                </div>
              </div>
            </div>
            <div>
              <img src="https://i.ibb.co/G9DC8S0/404-2.png" />
            </div>
          </div>
        </div>
        <div>
          <img src={ErrorIcon} alt="404Error" />
        </div>
      </div>
    </>
  );
};

export default Error;
