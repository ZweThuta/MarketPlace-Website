import { useRef } from "react";

const AddProducts = () => {
  const formRef = useRef(null); 

  const clearForm = () => {
    if (formRef.current) {
      formRef.current.reset(); 
    }
  };

  return (
    <>
      <section className="flex flex-col md:flex-row w-full h-auto p-8">
        <div className="w-full md:w-1/2 p-6">
          {/* Placeholder for Image */}
          <div className="h-full flex items-center justify-center border border-gray-300 rounded-lg">
            <p className="text-gray-800 text-sm">Image Preview Area</p>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl text-richChocolate font-bold mb-6">Add Products</h1>
          <form
            name="addProductForm"
            method="POST"
            className="space-y-4"
            ref={formRef} 
          >
            <div>
              <label className="text-gray-800 text-sm mb-2 block">
                Product Name
              </label>
              <input
                name="productName"
                type="text"
                required
                className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter product name"
              />
            </div>

            <div>
              <label className="text-gray-800 text-sm mb-2 block">
                Description
              </label>
              <textarea
                name="description"
                required
                className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter description"
                rows="4"
              />
            </div>

            <div>
              <label className="text-gray-800 text-sm mb-2 block">Price</label>
              <input
                name="price"
                type="number"
                required
                className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter price"
              />
            </div>

            <div>
              <label className="text-gray-800 text-sm mb-2 block">
                Category
              </label>
              <select
                name="category"
                required
                className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled selected>
                Select Category
                </option>
                {/* Add more options */}
              </select>
            </div>

            <div>
              <label className="text-gray-800 text-sm mb-2 block">
                Stock Quantity
              </label>
              <input
                name="quantity"
                type="number"
                required
                className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                placeholder="Enter stock quantity"
              />
            </div>

            <div>
              <label className="text-gray-800 text-sm mb-2 block">Image</label>
              <input
                name="image"
                type="file"
                required
                className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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