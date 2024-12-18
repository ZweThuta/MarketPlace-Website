import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ReviewsForm = ({ product }) => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [review, setReview] = useState({ comment: "" });
  const { id: productId, userId: ownerId } = product;
  const [reviewerId, setReviewerId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchUser();
    fetchReviews();
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found.");

      const userResponse = await axios.get(import.meta.env.VITE_LOGIN_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (userResponse.data?.data?.id) {
        setReviewerId(userResponse.data.data.id);
      } else {
        throw new Error("Failed to fetch user ID.");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REVIEW_URL}?productId=${productId}`
      );
      if (response.data?.status === 1) {
        setReviews(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const clearHandler = () => {
    setReview({ comment: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReview((prev) => ({ ...prev, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!review.comment.trim()) {
      newErrors.comment = "Comment is required.";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        productId,
        ownerId,
        userId: reviewerId,
        comment: review.comment,
      };

      const response = await axios.post(
        import.meta.env.VITE_REVIEW_URL,
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data?.status === 1) {
        setReview({ comment: "" });
        fetchReviews();
      } else {
        throw new Error(response.data?.message || "Failed to submit review.");
      }
    } catch (error) {
      console.error("Error submitting review:", error.message);
      setErrors({ comment: "An error occurred while submitting your review." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-md max-w-lg mx-auto mt-4 bg-white">
      <h1 className="text-center text-xl font-semibold mb-4">Review Area</h1>

      {/* Review Form */}
      {localStorage.getItem("authToken") && (
        <form
          name="reviewForm"
          method="POST"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="mb-4">
            <label
              htmlFor="comment"
              className="block m-2 text-sm font-medium text-gray-700"
            >
              What's on your mind?
            </label>
            <textarea
              id="comment"
              name="comment"
              placeholder="Leave a comment here..."
              value={review.comment}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              rows="4"
            ></textarea>
            {errors.comment && (
              <p className="text-red-500 text-xs mt-1">{errors.comment}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 px-4 text-white rounded-lg font-semibold transition ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
          <button
            type="button"
            onClick={clearHandler}
            className="w-full py-2 px-4 mt-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
          >
            Clear
          </button>
        </form>
      )}

      {/* Review List */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Customer Reviews</h2>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div
              key={review.date + review.comment}
              className="border-b py-2 mb-2"
            >
              <p className="text-gray-700 font-semibold">{review.name}</p>
              <p className="text-gray-500 text-sm">{review.email}</p>
              <p className="text-gray-800 mt-1">{review.comment}</p>
              <p className="text-gray-400 text-xs">{review.date}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No reviews for this product yet.</p>
        )}
      </div>
    </div>
  );
};

export default ReviewsForm;
