import axios from "axios";
import { useRef, useState, useEffect } from "react";

const AddProducts = () => {
  const formRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [userId, setUserId] = useState("");
  const [productName, setProductName] = useState("");
  const [errors, setErrors] = useState({});

  const clearForm = () => {
    if (formRef.current) {
      formRef.current.reset();
      setImagePreview(null);
    }
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setProductName((values) => ({ ...values, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!productName.productNameme) {
      newErrors.productName = "Product name is required";
    }
    else if (productName.productName.length < 3) {
      newErrors.productName = "Name must be at least 3 characters long";
    }
    if (!productName.description) {
      newErrors.description = "Description is required";
    }
    if (!productName.price) {
      newErrors.price = "Price is required";
    } else if (productName.price < 0) {
      newErrors.price = "Price must be a positive number";
    }
    if (!productName.category) {
      newErrors.category = "Category is required";
    } 
    if (!productName.quantity) {
      newErrors.quantity = "Stock quantity is required";
    } else if (productName.quantity <= 0) {
      newErrors.quantity = "Stock quantity must has at least one.";
    }
    if (!productName.image) {
      newErrors.image = "Image is required";
    } 
    return newErrors;
  };

  useEffect(() => {
    getUserId();
  }, []);

  const getUserId = async () => {
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
        setUserId(response.data.data.id);
      } else {
        console.error("Failed to fetch user ID:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching user ID:", error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("productName", productName.productName);
    formData.append("description", productName.description);
    formData.append("price", productName.price);
    formData.append("category", productName.category);
    formData.append("quantity", productName.quantity);
    formData.append("image", imagePreview);

    axios
      .post(import.meta.env.VITE_ADD_PRODUCT_URL, formData)
      .then(function (response) {
        if (response.data.status === 0) {
          setErrors({ message: response.data.message });
        } else {
          clearForm();
        }
      })
      .catch(function (error) {
        console.error("There was an error while adding product:", error.message);
      });
  };

  return (
    <>
      <section className="flex flex-col md:flex-row w-full h-auto p-8">
        <div className="w-full md:w-1/2 p-6">
          {/* Image Preview Area */}
          <div className="h-full flex items-center justify-center border border-gray-300 rounded-lg">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="h-full w-full object-cover rounded-lg"
              />
            ) : (
              <p className="text-gray-800 text-sm">Image Preview Area</p>
            )}
          </div>
        </div>

        <div className="w-full md:w-1/2 p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl text-richChocolate font-bold mb-6">
            Add Products
          </h1>
          <form
            name="addProductForm"
            method="POST"
            className="space-y-4"
            ref={formRef}
            onSubmit={handleSubmit}
          >
            <div>
              <input
                name="userId"
                type="text"
                value={userId}
                readOnly
                hidden
                required
                className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-gray-800 text-sm mb-2 block">
                Product Name
              </label>
              <input
                name="productName"
                type="text"
                onChange={handleChange}
                
                className={`text-gray-800 bg-white border ${
                  errors.productName ? "border-red-500" : "border-gray-300"
                } w-full text-sm px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter product name"
              />
              {errors.productName && (
                <p className="text-red-500 text-xs mt-4">
                  {errors.productName}
                </p>
              )}
            </div>

            <div>
              <label className="text-gray-800 text-sm mb-2 block">
                Description
              </label>
              <textarea
                name="description"
                onChange={handleChange}
                
                className={`text-gray-800 bg-white border ${
                  errors.description ? "border-red-500" : "border-gray-300"
                } w-full text-sm px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter description"
                rows="4"
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-4">
                  {errors.description}
                </p>
              )}
            </div>

            <div>
              <label className="text-gray-800 text-sm mb-2 block">Price</label>
              <input
                name="price"
                type="number"
                onChange={handleChange}
                min="0"
                
                className={`text-gray-800 bg-white border ${
                  errors.price ? "border-red-500" : "border-gray-300"
                } w-full text-sm px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter price"
              />
              {errors.price && (
                <p className="text-red-500 text-xs mt-4">
                  {errors.price}
                </p>
              )} </div>

            <div>
              <label className="text-gray-800 text-sm mb-2 block">
                Category
              </label>
              <select
                name="category"
                onChange={handleChange}
                
                className={`text-gray-800 bg-white border ${
                  errors.category ? "border-red-500" : "border-gray-300"
                } w-full text-sm px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option>Select Category</option>
                {/* Add more options */}
              </select>
              {errors.category && (
                <p className="text-red-500 text-xs mt-4">
                  {errors.category}
                </p>
              )}
            </div>

            <div>
              <label className="text-gray-800 text-sm mb-2 block">
                Stock Quantity
              </label>
              <input
                name="quantity"
                type="number"
                onChange={handleChange}
                
                className={`text-gray-800 bg-white border ${
                  errors.quantity ? "border-red-500" : "border-gray-300"
                } w-full text-sm px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                min="0"
                placeholder="Enter stock quantity"
              />
              {errors.quantity && (
                <p className="text-red-500 text-xs mt-4">
                  {errors.quantity}
                </p>
              )}
            </div>

            <div>
              <label className="text-gray-800 text-sm mb-2 block">Image</label>
              <input
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className={`text-gray-800 bg-white border ${
                  errors.image ? "border-red-500" : "border-gray-300"
                } w-full text-sm px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.image && (
                <p className="text-red-500 text-xs mt-4">
                  {errors.image}
                </p>
              )}
            </div>

            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <button
                type="submit"
                className="w-full md:w-auto py-3 px-10 tracking-wider text-sm rounded-md text-white bg-richChocolate800 hover:bg-richChocolate900 focus:outline-none"
              >
                Add to Sell
              </button>
              <button
                type="button"
                onClick={clearForm}
                className="w-full md:w-auto py-3 px-10 tracking-wider text-sm rounded-md text-white bg-gray-400 hover:bg-gray-600 focus:outline-none"
              >
                Clear
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default AddProducts;