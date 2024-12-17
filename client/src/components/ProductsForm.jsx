import axios from "axios";
import { useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ProductsForm = ({ isAddProduct }) => {
  const formRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [secondImagePreview, setSecondImagePreview] = useState(null);
  const [thirdImagePreview, setThirdImagePreview] = useState(null);
  const [fourthImagePreview, setFourthImagePreview] = useState(null);
  const [selectedImages, setSelectedImages] = useState({});
  const [userId, setUserId] = useState("");
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [quality, setQuality] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const navigation = useNavigate();
  const isSubmitting = navigation.state === "submitting";
  const { productId } = useParams();

  useEffect(() => {
    getUserId();

    if (!isAddProduct) {
      fetchProduct();
    }
  }, [isAddProduct]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_USER_PRODUCT_DETAILS,
        {
          params: { productId },
        }
      );

      if (response.data.status === 1) {
        const data = response.data.data;

        setProductName(data.productName);
        setDescription(data.description);
        setQuality(data.quality);
        setPrice(data.price);
        setCategory(data.category);
        setQuantity(data.quantity);
        setImagePreview(`${import.meta.env.VITE_IMAGES_URL}/${data.image}`);

        setSecondImagePreview(
          `${import.meta.env.VITE_IMAGES_URL}/${data.secondImage}`
        );
        setThirdImagePreview(
          `${import.meta.env.VITE_IMAGES_URL}/${data.thirdImage}`
        );
        setFourthImagePreview(
          `${import.meta.env.VITE_IMAGES_URL}/${data.fourthImage}`
        );
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const clearForm = () => {
    if (formRef.current) {
      formRef.current.reset();
      setImagePreview(null);
      setSecondImagePreview(null);
      setThirdImagePreview(null);
      setFourthImagePreview(null);
      setSelectedImages({});
      setProductName("");
      setDescription("");
      setQuality("");
      setPrice("");
      setCategory("");
      setQuantity("");
      setErrors({});
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "productName") {
      setProductName(value);
    } else if (name === "description") {
      setDescription(value);
    } else if (name === "quality") {
      setQuality(value);
    } else if (name === "price") {
      setPrice(value);
    } else if (name === "category") {
      setCategory(value);
    } else if (name === "quantity") {
      setQuantity(value);
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleImageChange = (event, setPreview, key) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setSelectedImages((prev) => ({ ...prev, [key]: file }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!productName) {
      newErrors.productName = "Product name is required";
    } else if (productName.length < 3) {
      newErrors.productName = "Name must be at least 3 characters long";
    }
    if (!description) {
      newErrors.description = "Description is required";
    }
    if (!quality) {
      newErrors.quality = "Quality is required";
    }
    if (!price) {
      newErrors.price = "Price is required";
    } else if (price <= 0) {
      newErrors.price = "Price must be a positive number";
    } 
    if (!category) {
      newErrors.category = "Category is required";
    }
    if (!quantity) {
      newErrors.quantity = "Stock quantity is required";
    } else if (quantity <= 0) {
      newErrors.quantity = "Stock quantity must be at least one.";
    }
    if (!imagePreview) newErrors.image = "Cover image is required";
    if (!secondImagePreview) newErrors.secondImage = "Second image is required";
    if (!thirdImagePreview) newErrors.thirdImage = "Third image is required";
    if (!fourthImagePreview) newErrors.fourthImage = "Fourth image is required";

    return newErrors;
  };

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
    if (!isAddProduct) {
      formData.append("productId", productId);
    }
    formData.append("userId", userId);
    formData.append("productName", productName);
    formData.append("description", description);
    formData.append("quality", quality);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("quantity", quantity);
    formData.append("image", selectedImages.image ? selectedImages.image : "");
    formData.append(
      "secondImage",
      selectedImages.secondImage ? selectedImages.secondImage : ""
    );
    formData.append(
      "thirdImage",
      selectedImages.thirdImage ? selectedImages.thirdImage : ""
    );
    formData.append(
      "fourthImage",
      selectedImages.fourthImage ? selectedImages.fourthImage : ""
    );

    const request = isAddProduct
      ? axios.post(import.meta.env.VITE_ADD_PRODUCT_URL, formData)
      : axios.post(import.meta.env.VITE_USER_PRODUCT_DETAILS, formData);

    request
      .then((response) => {
        if (response.data.status === 0) {
          setErrors({ message: response.data.message });
        } else {
          clearForm();
          navigate("/userProduct");
        }
      })
      .catch((error) => {
        console.error(
          "There was an error while processing the request:",
          error.message
        );
      });
  };

  return (
    <>
      <section className="flex flex-col md:flex-row w-full h-auto p-8">
        {/* Image Preview Area */}
        <div className="w-full md:w-1/2 p-5">
          <div>
            <h1 className="text-xl text-center text-richChocolate font-bold mb-6 uppercase tracking-wide">
              Product Images
            </h1>
          </div>
          <div className="h-1/2 flex items-center justify-center border border-gray-300 rounded-lg mb-4">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="h-full w-full object-cover rounded-lg"
              />
            ) : (
              <p className="text-gray-500 text-sm">Image Preview Area</p>
            )}
          </div>

          <div className="flex flex-row gap-2 h-1/3">
            <div className="h-full w-1/3 flex items-center justify-center border border-gray-300 rounded-lg mb-4">
              {secondImagePreview ? (
                <img
                  src={secondImagePreview}
                  alt="Preview"
                  className="h-full w-full object-cover rounded-lg"
                />
              ) : (
                <p className="text-gray-500 text-sm">Image Preview Area</p>
              )}
            </div>
            <div className="h-full w-1/3 flex items-center justify-center border border-gray-300 rounded-lg mb-4">
              {thirdImagePreview ? (
                <img
                  src={thirdImagePreview}
                  alt="Preview"
                  className="h-full w-full object-cover rounded-lg"
                />
              ) : (
                <p className="text-gray-500 text-sm">Image Preview Area</p>
              )}
            </div>
            <div className="h-full w-1/3 flex items-center justify-center border border-gray-300 rounded-lg mb-4">
              {fourthImagePreview ? (
                <img
                  src={fourthImagePreview}
                  alt="Preview"
                  className="h-full w-full object-cover rounded-lg"
                />
              ) : (
                <p className="text-gray-500 text-sm">Image Preview Area</p>
              )}
            </div>
          </div>
        </div>
        {/* preview image  */}

        <div className="w-full md:w-1/2 p-6 rounded-lg shadow-lg max-h-fit">
          {isAddProduct ? (
            <>
              <h1 className="text-2xl text-richChocolate font-bold mb-6 uppercase tracking-wide">
                What you want to sell?
              </h1>
            </>
          ) : (
            <h1 className="text-2xl text-richChocolate font-bold mb-6 uppercase tracking-wide">
              You can edit your product here!
            </h1>
          )}
          <form
            name="addProductForm"
            encType="multipart/form-data"
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
              <input
                name="productId"
                type="text"
                value={productId}
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
                value={productName}
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
                value={description}
                rows="4"
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-4">
                  {errors.description}
                </p>
              )}
            </div>

            <div>
              <label className="text-gray-800 text-sm mb-2 block">
                Quality
              </label>
              <input
                name="quality"
                type="text"
                onChange={handleChange}
                className={`text-gray-800 bg-white border ${
                  errors.productName ? "border-red-500" : "border-gray-300"
                } w-full text-sm px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Brand new or second"
                value={quality}
              />
              {errors.quality && (
                <p className="text-red-500 text-xs mt-4">{errors.quality}</p>
              )}
            </div>

            <div>
              <label className="text-gray-800 text-sm mb-2 block">Price</label>
              <input
                name="price"
                type="number"
                step="any"
                onChange={handleChange}
                min="0"
                className={`text-gray-800 bg-white border ${
                  errors.price ? "border-red-500" : "border-gray-300"
                } w-full text-sm px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter price"
                value={price}
              />
              {errors.price && (
                <p className="text-red-500 text-xs mt-4">{errors.price}</p>
              )}
            </div>

            <div>
              <label className="text-gray-800 text-sm mb-2 block">
                Category
              </label>
              <select
                name="category"
                onChange={handleChange}
                value={category}
                className={`text-gray-800 bg-white border ${
                  errors.category ? "border-red-500" : "border-gray-300"
                } w-full text-sm px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                {isAddProduct ? (
                  <>
                    <option>Select Category</option>
                    <option>Fashion</option>
                    <option>Electornic</option>
                    <option>Game</option>
                    <option>Shoe</option>
                    <option>Lipstick</option>
                    <option>Home & Kitchen</option>

                  </>
                ) : (
                  <>
                    <option>Fashion</option>
                    <option>Electornic</option>
                    <option>Game</option>
                    <option>Shoe</option>
                    <option>Lipstick</option>
                    <option>Home & Kitchen</option>


                  </>
                )}

                {/* Add more options */}
              </select>
              {errors.category && (
                <p className="text-red-500 text-xs mt-4">{errors.category}</p>
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
                value={quantity}
                className={`text-gray-800 bg-white border ${
                  errors.quantity ? "border-red-500" : "border-gray-300"
                } w-full text-sm px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                min="0"
                placeholder="Enter stock quantity"
              />
              {errors.quantity && (
                <p className="text-red-500 text-xs mt-4">{errors.quantity}</p>
              )}
            </div>

            {/* Image upload */}
            <label className="text-gray-500 text-xs mb-2 block">
              This image will appear as a cover.
            </label>
            <div className="flex flex-col items-center">
              <label
                htmlFor="file-upload"
                className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition duration-200 ease-in-out 
        ${
          errors.image
            ? "border-red-600"
            : "border-gray-300 hover:border-blue-500"
        }`}
              >
                <span className="text-richChocolate text-md font-light">
                  {imagePreview ? (
                    <p className="text-blue-600 font-medium tracking-wide text-sm">
                      Image Selected
                    </p>
                  ) : !errors.image ? (
                    " Add your image here!"
                  ) : (
                    <p className="text-red-500 text-xs">{errors.image}</p>
                  )}
                </span>
                <input
                  id="file-upload"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleImageChange(e, setImagePreview, "image")
                  }
                  className="hidden" // Hide the default input
                />
              </label>
            </div>
            {/* Image upload */}

            <label className="text-gray-500 text-xs mb-2 block">
              These images will appear as a gallery.
            </label>

            <div className="flex flex-row gap-3">
              <label
                htmlFor="file-upload-2"
                className={`flex flex-col items-center justify-center w-1/3 h-32 border-2 border-dashed rounded-lg cursor-pointer transition duration-200 ease-in-out 
        ${
          errors.image
            ? "border-red-600"
            : "border-gray-300 hover:border-blue-500"
        }`}
              >
                <span className="text-richChocolate text-xs text-center font-light">
                  {secondImagePreview ? (
                    <p className="text-blue-600 font-medium tracking-wide text-sm">
                      Image Selected
                    </p>
                  ) : !errors.secondImage ? (
                    " Add additional image here!"
                  ) : (
                    <p className="text-red-500 text-xs">{errors.secondImage}</p>
                  )}
                </span>
                <input
                  id="file-upload-2"
                  name="secondImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleImageChange(e, setSecondImagePreview, "secondImage")
                  }
                  className="hidden" // Hide the default input
                />
              </label>

              <label
                htmlFor="file-upload-3"
                className={`flex flex-col items-center justify-center w-1/3 h-32 border-2 border-dashed rounded-lg cursor-pointer transition duration-200 ease-in-out 
        ${
          errors.image
            ? "border-red-600"
            : "border-gray-300 hover:border-blue-500"
        }`}
              >
                <span className="text-richChocolate text-xs text-center font-light">
                  {thirdImagePreview ? (
                    <p className="text-blue-600 font-medium tracking-wide text-sm">
                      Image Selected
                    </p>
                  ) : !errors.thirdImage ? (
                    " Add additional image here!"
                  ) : (
                    <p className="text-red-500 text-xs">{errors.thirdImage}</p>
                  )}
                </span>
                <input
                  id="file-upload-3"
                  name="thirdImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleImageChange(e, setThirdImagePreview, "thirdImage")
                  }
                  className="hidden" // Hide the default input
                />
              </label>

              <label
                htmlFor="file-upload-4"
                className={`flex flex-col items-center justify-center w-1/3 h-32 border-2 border-dashed rounded-lg cursor-pointer transition duration-200 ease-in-out 
        ${
          errors.image
            ? "border-red-600"
            : "border-gray-300 hover:border-blue-500"
        }`}
              >
                <span className="text-richChocolate text-xs text-center font-light">
                  {fourthImagePreview ? (
                    <p className="text-blue-600 font-medium tracking-wide text-sm">
                      Image Selected
                    </p>
                  ) : !errors.fourthImage ? (
                    " Add additional image here!"
                  ) : (
                    <p className="text-red-500 text-xs">{errors.fourthImage}</p>
                  )}
                </span>
                <input
                  id="file-upload-4"
                  name="fourthImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleImageChange(e, setFourthImagePreview, "fourthImage")
                  }
                  className="hidden" // Hide the default input
                />
              </label>
            </div>

            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto py-3 px-10 tracking-wider text-sm rounded-md text-white bg-richChocolate800 hover:bg-richChocolate900 focus:outline-none"
              >
                {isSubmitting
                  ? "Submiting"
                  : isAddProduct
                  ? "Add to sell"
                  : "Update product"}
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

export default ProductsForm;
