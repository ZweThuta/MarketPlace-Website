import { useEffect, useRef, useState } from "react";
import { XCircleIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProfileEdit = ({ isOpen, onClose }) => {
  const formRef = useRef(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    userId: "",
    address: "",
    city: "",
    phno: "",
    note: "",
    profileImage: null,
    banner:null,
  });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    if (isOpen) {
      getUser();
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, profileImage: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleBannerChange = (e) =>{
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, banner: file }));
      setBanner(URL.createObjectURL(file));
    }
  }

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Username is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Invalid email format";
    }
    if (formData.phno && !/^\d{10,15}$/.test(formData.phno)) {
      errors.phno = "Phone number must be 10-15 digits";
    }
    return errors;
  };

  const handleSave = async (e) => {
    e.preventDefault();  
  
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  
    const payload = new FormData();
    payload.append("id",formData.id);
    payload.append("name", formData.name);
    payload.append("email", formData.email);
    payload.append("address", formData.address);
    payload.append("city", formData.city);
    payload.append("phno", formData.phno);
    payload.append("note", formData.note);
    if (formData.profileImage) {
      payload.append("profile", formData.profileImage);
    }
    if(formData.banner){
      payload.append("banner",formData.banner);
    }
    
  
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(import.meta.env.VITE_USER_EDIT_URL, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.data.status === 0) {
        setErrors({ message: response.data.message });
      } else {
        console.log("User updated successfully:", response.data);
        onClose();  
        navigate("/userProduct");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };
  
  

  const handleClear = () => {
    formRef.current.reset();
    setFormData({
      userId: id,
      name: name,
      email: email,
      address: "",
      city: "",
      phno: "",
      note: "",
      profileImage: null,
      banner:null,
    });
    setBanner(null);
    setImagePreview(null);
    setErrors({});
  };

  const getUser = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No token found, user may not be logged in.");
        return;
      }
      const response = await axios.get(import.meta.env.VITE_LOGIN_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.status === 1 && response.data.data) {
        const data = response.data.data;
        setFormData({
          name: data.name || "",
          email: data.email || "",
          userId: data.id || "",
          address: data.address || "",
          city: data.city || "",
          phno: data.phno || "",
          note: data.note || "",
          profileImage: null,
          banner:null
        });
        setName(data.name);
        setEmail(data.email);
        setId(data.id);
      } else {
        console.error("Failed to fetch", response.data.message);
        navigate("/userProduct")
      }
    } catch (error) {
      console.error("Error fetching", error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg relative max-h-[90%] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition"
        >
          <XCircleIcon className="w-8 h-8" />
        </button>

        {/* Header */}
        <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
          Edit Your Profile Here!
        </h2>

        {/* Profile Image */}
        <div className="flex flex-col items-center mb-4">
          <div className="relative w-24 h-24 rounded-full overflow-hidden shadow-md border-2 border-gray-300">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Profile Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full text-sm text-center flex items-center justify-center bg-gray-200 text-gray-500">
                 Your profile
              </div>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-2 text-sm text-gray-600 cursor-pointer"
          />
        </div>

         {/* Profile Image */}
         <div className="flex flex-col items-center mb-4">
          <div className="relative w-full h-24 overflow-hidden shadow-md border-2 border-gray-300">
            {banner ? (
              <img
                src={banner}
                alt="Banner Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full text-sm text-center flex items-center justify-center bg-gray-200 text-gray-500">
                 Your banner
              </div>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleBannerChange}
            className="mt-2 text-sm text-gray-600 cursor-pointer"
          />
        </div>

        {/* Form Fields */}
        <form ref={formRef} onSubmit={handleSave} className="space-y-3">
          <input
            type="text"
            name="userId"
            value={formData.userId}
            readOnly
            hidden
            className="w-full border border-gray-300 rounded-md p-2 text-sm"
          />
          {[
            { label: "Username", name: "name" },
            { label: "Email", name: "email" },
            { label: "Phone Number", name: "phno" },
            { label: "Address", name: "address" },
            { label: "City", name: "city" },
          ].map(({ label, name }) => (
            <div key={name}>
              <label className="block text-gray-700 font-medium text-sm">
                {label}
              </label>
              <input
                type={name === "email" ? "email" : "text"}
                name={name}
                value={formData[name]}
                onChange={handleInputChange}
                className={`w-full border rounded-md p-2 text-sm ${
                  errors[name] ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors[name] && (
                <p className="text-red-500 text-xs mt-1">{errors[name]}</p>
              )}
            </div>
          ))}

          {/* About Me */}
          <div>
            <label className="block text-gray-700 font-medium text-sm">
              About Me
            </label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm"
              rows="3"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end mt-4 gap-3">
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition text-sm"
            >
              Clear
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEdit;
