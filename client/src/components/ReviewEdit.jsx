import React from 'react'

const ReviewEdit = ({ isOpen, onClose}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-lg w-11/12 sm:w-1/2 md:w-1/3">
      <h2 className="text-xl font-semibold tracking-wide mb-4">Hey there!</h2>
      <div className="flex justify-end gap-4">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          No
        </button>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Yes
        </button>
      </div>
    </div>
  </div>
  )
}

export default ReviewEdit