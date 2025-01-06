import axios from "axios";
import { useState } from "react";
import { useNavigate, Link, useNavigation } from "react-router-dom";
import { useAuth } from "../util/AuthContext";
import foto from "../logo/registerCat.gif";
import photo from "../logo/loginCat.gif";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Authform = ({ isLoginPage }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const [inputs, setInput] = useState({
    name: "",
    email: "",
    password: "",
    con_password: "",
    terms: "",
    role:"user",
  });
  const [errors, setErrors] = useState({});
  const isSubmitting = navigation.state === "submitting";

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInput((values) => ({ ...values, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!isLoginPage) {
      if (!inputs.name) {
        newErrors.name = "Name is required.";
      } else if (inputs.name.length < 3) {
        newErrors.name = "Name must be at least 3 characters long.";
      }
      if (!inputs.con_password) {
        newErrors.con_password = "Confirm Password is required.";
      } else if (inputs.con_password !== inputs.password) {
        newErrors.con_password = "Password does not match.";
      } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(inputs.password)) {
        newErrors.password =
          "Password must contain at least one special character.";
      }

      if (!inputs.terms) {
        newErrors.terms = "You must agree to the terms and conditions.";
      }
    }
    if (!inputs.email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(inputs.email)) {
      newErrors.email = "Email address is invalid.";
    }
    if (!inputs.password) {
      newErrors.password = "Password is required.";
    } else if (inputs.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const url = isLoginPage
      ? import.meta.env.VITE_LOGIN_URL
      : import.meta.env.VITE_REGISTER_URL;

    axios
      .post(url, inputs)
      .then(function (response) {
        if (response.data.status === 0) {
          setErrors({ email: response.data.message });
        } else {
          if (isLoginPage) {
            const token = response.data.data.token;
            const role = response.data.data.role;
            login(token, role);
            toast.success("Login successful!");
            navigate("/");
            window.location.reload();
          } else {
            toast.success("Registration successful! Please login.");
            navigate("/login");
          }
        }
      })
      .catch(function (error) {
        console.error(
          `There was an error during ${
            isLoginPage ? "login" : "registration"
          }!`,
          error
        );
      });
  };
  return (
    <>
      <section className="h-auto w-full py-24 bg-gray-100">
        <div>
          <div className="font-[sans-serif] bg-white max-w-4xl flex items-center mx-auto md:h-auto p-4 rounded-xl">
            <div className="grid md:grid-cols-3 items-center shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-xl overflow-hidden">
              {!isLoginPage ? (
                <>
                  <div className="flex flex-col justify-between gap-10">
                    <h1 className="text-xs text-gray-400 font-semibold uppercase p-5">
                      TrendHaven
                    </h1>
                    <img
                      src={photo}
                      alt="shopping"
                      className="w-full h-64 object-cover"
                    />
                    <div className="text-center">
                      <h4 className="text-lg font-semibold ">
                        Create Your Account
                      </h4>
                      <p className="text-[13px]  mt-3 leading-relaxed">
                        Welcome to our registration page! Get started by
                        creating your account.
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h1 className="text-xs text-gray-400 font-semibold uppercase p-5">
                      TrendHaven
                    </h1>
                    <img
                      src={foto}
                      alt="shopping"
                      className="w-full h-64 object-cover"
                    />
                    <div className="text-center p-6">
                      <h4 className="text-lg font-semibold ">
                        Hey, Welcome Back
                      </h4>
                      <p className="text-[13px] pt-1 leading-relaxed">
                        Login into your account and enjoy access to all
                        features.
                      </p>
                    </div>
                  </div>
                </>
              )}

              <form
                className="md:col-span-2 w-full py-6 px-6 sm:px-16"
                name="registrationForm"
                onSubmit={handleSubmit}
                method="POST"
              >
                <div className="mb-6">
                  <h3 className="text-gray-800 text-2xl font-bold">
                    {isLoginPage ? "Login Here!" : "Create Your Account"}
                  </h3>
                  {!isLoginPage ? (
                    <p className="text-xs pt-3 text-gray-400 font-semibold">
                      Please enter your details.
                    </p>
                  ) : (
                    ""
                  )}
                </div>

                <div className="space-y-6">
                  {!isLoginPage && (
                    <div>
                      <label className="text-gray-800 text-sm mb-2 block">
                        Username
                      </label>
                      <div className="relative flex items-center">
                        <input
                          name="name"
                          type="text"
                          onChange={handleChange}
                          className={`text-gray-800 bg-white border ${
                            errors.name ? "border-red-500" : "border-gray-300"
                          } w-full text-sm px-4 py-2.5 rounded-md outline-blue-500`}
                          placeholder="Enter username"
                        />
                      </div>
                      {errors.name && (
                        <p className="text-red-500 text-xs mt-4">
                          {errors.name}
                        </p>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="text -gray-800 text-sm mb-2 block">
                      Email Address
                    </label>
                    <div className="relative flex items-center">
                      <input
                        name="email"
                        type="email"
                        onChange={handleChange}
                        className={`text-gray-800 bg-white border ${
                          errors.email ? "border-red-500" : "border-gray-300"
                        } w-full text-sm px-4 py-2.5 rounded-md outline-blue-500`}
                        placeholder="Enter email"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-4">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-gray-800 text-sm mb-2 block">
                      Password
                    </label>
                    <div className="relative flex items-center">
                      <input
                        name="password"
                        type="password"
                        onChange={handleChange}
                        className={`text-gray-800 bg-white border ${
                          errors.password ? "border-red-500" : "border-gray-300"
                        } w-full text-sm px-4 py-2.5 rounded-md outline-blue-500`}
                        placeholder="Enter password"
                      />
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-xs mt-4">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {!isLoginPage && (
                    <div>
                      <label className="text-gray-800 text-sm mb-2 block">
                        Confirm Password
                      </label>
                      <div className="relative flex items-center">
                        <input
                          name="con_password"
                          type="password"
                          onChange={handleChange}
                          className={`text-gray-800 bg-white border ${
                            errors.con_password
                              ? "border-red-500"
                              : "border-gray-300"
                          } w-full text-sm px-4 py-2.5 rounded-md outline-blue-500`}
                          placeholder="Enter password again"
                        />
                      </div>
                      {errors.con_password && (
                        <p className="text-red-500 text-xs mt-4">
                          {errors.con_password}
                        </p>
                      )}
                    </div>
                  )}
                  {!isLoginPage && (
                    <div>
                      <label className="flex items-center text-gray-800 text-sm">
                        <input
                          type="checkbox"
                          name="terms"
                          onChange={handleChange}
                          className="mr-2"
                        />
                        I agree to the terms and conditions
                      </label>
                      {errors.terms && (
                        <p className="text-red-500 text-xs mt-4">
                          {errors.terms}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="!mt-12">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 tracking-widest uppercase text-sm rounded-md text-customWhite bg-neroBlack950 hover:bg-transparent hover:border-2 hover:text-neroBlack950 hover:border-neroBlack950  focus:outline-none"
                  >
                    {isSubmitting
                      ? "Submiting"
                      : isLoginPage
                      ? "Login"
                      : "Create an account"}
                  </button>
                </div>
                {isLoginPage ? (
                  <>
                    <p className="text-gray-800 text-sm mt-6 text-center">
                      Don't have an account?
                      <Link
                        to={"/register"}
                        className="text-blue-600 font-semibold hover:underline ml-1"
                      >
                        Register here
                      </Link>
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-gray-800 text-sm mt-6 text-center">
                      Already have an account?
                      <Link
                        to={"/login"}
                        className="text-blue-600 font-semibold hover:underline ml-1"
                      >
                        Login here
                      </Link>
                    </p>
                  </>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Authform;
