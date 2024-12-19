import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import {
  UserCircleIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import moment from "moment";

const ReviewsForm = ({ product, productIds }) => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [review, setReview] = useState({ comment: "", rating: 0 });
  const { id: productId, userId: ownerId } = product;
  const [reviewerId, setReviewerId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setReviews([]); 
    fetchUser();
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
    fetchReviews();
  }, [productId]);

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

  const clearHandler = () => {
    setReview({ comment: "" });
  };

  const handleRating = (selectedRating) => {
    setReview((prev) => ({ ...prev, rating: selectedRating }));
    setErrors((prevErrors) => ({ ...prevErrors, rating: "" }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReview((prev) => ({ ...prev, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!review.comment.trim()) newErrors.comment = "Comment is required.";
    if (review.rating === 0) newErrors.rating = "Please select a rating.";
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
        rating: review.rating,
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
        navigate(0);
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
    <>
      <div className="p-4 border rounded-lg shadow-md max-w-[95%] mx-auto mt-4 bg-white">
        <h1 className="text-center text-2xl font-semibold capitalize tracking-wide mb-6">
          Customer Reviews & Rating
        </h1>

        {/* Review Form */}
        {localStorage.getItem("authToken") && (
          <>
            <form
              name="reviewForm"
              method="POST"
              onSubmit={handleSubmit}
              noValidate
            >
              {/* Star Rating Section */}
              <div className="mb-6">
                <label className="block text-1xl tracking-wide capitalize font-medium mb-2 ml-2">
                  Add Your Rating*
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FontAwesomeIcon
                      key={star}
                      icon={faStar}
                      onClick={() => handleRating(star)}
                      className={`cursor-pointer text-3xl ${
                        star <= review.rating
                          ? "text-yellow-500"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                {errors.rating && (
                  <p className="text-red-500 text-sm ml-1 mt-5">
                    {errors.rating}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="comment"
                  className="block m-2 text-1xl font-medium text-gray-700"
                >
                  What's on your mind?
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  placeholder="Leave a comment here..."
                  value={review.comment}
                  onChange={handleChange}
                  className="w-full px-3 py-2 mt-1 text-sm border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                  rows="5"
                ></textarea>
                {errors.comment && (
                  <p className="text-red-500 text-xs mt-1">{errors.comment}</p>
                )}
              </div>

              <div className="gap-5 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`py-2 px-20 text-white rounded-lg font-semibold transition ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-richChocolate700 hover:bg-richChocolate900"
                  }`}
                >
                  {isSubmitting ? "Submitting..." : "Post"}
                </button>
                <button
                  type="button"
                  onClick={clearHandler}
                  className="py-2 px-6 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
                >
                  Clear
                </button>
              </div>
            </form>
            <hr className="mt-5 border-t-2 border-grey" />
          </>
        )}

        {/* Review List */}
        <div className="mt-6 p-5 bg-gray-50 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold tracking-wider mb-6 border-b-2 border-gray-300 pb-2">
            Customer Reviews
          </h2>
          {reviews.length > 0 ? (
            <>
              {reviews.slice(0, showAll ? reviews.length : 3).map((review) => (
                <div
                  key={review.date + review.comment}
                  className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200"
                >
                  <div className="flex items-start gap-4">
                    {review.profile ? (
                      <img
                        src={`${import.meta.env.VITE_IMAGES_URL}/${
                          review.profile
                        }`}
                        alt={`${review.name}'s profile`}
                        className="w-16 h-16 rounded-full object-cover border-2 border-richChocolate900"
                      />
                    ) : (
                      <UserCircleIcon className="w-16 h-16 rounded-full object-cover border-2 border-richChocolate900" />
                    )}

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-800 text-lg font-semibold capitalize">
                            {review.name}
                          </p>
                          <p className="text-gray-500 text-xs">
                            {review.email}
                          </p>
                        </div>
                        <div className="flex items-center">
                          {Array.from({ length: 5 }, (_, index) => (
                            <svg
                              key={index}
                              xmlns="http://www.w3.org/2000/svg"
                              fill={index < review.rating ? "gold" : "none"}
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className={`w-6 h-6 ${
                                index < review.rating
                                  ? "text-yellow-500"
                                  : "text-gray-300"
                              }`}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 3.375l2.5 6.856h7.25L16.125 15l2.5 6.869L12 18.018l-6.625 3.851L7.875 15 .375 10.231h7.25L12 3.375z"
                              />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <p className="mt-3 text-gray-700 leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 text-right">
                    <p className="text-gray-400 text-sm">
                      {moment(review.date).fromNow()}
                    </p>
                  </div>
                </div>
              ))}
              <div className="text-center">
                {reviews.length > 3 && (
                  <button
                    onClick={() => setShowAll(!showAll)}
                    className="py-2 px-6 bg-blue-500 text-sm  text-white rounded-lg hover:bg-blue-600"
                  >
                    {showAll ? (
                      <>
                        <div className="flex gap-2">
                          <span>Show Less</span>
                          <EyeSlashIcon className="w-5 h-5" />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex gap-2">
                          <span>Show More</span>
                          <EyeIcon className="w-5 h-5" />
                        </div>
                      </>
                    )}
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 bg-gray-100 rounded-lg">
              <p className="text-gray-600 text-sm">
                No reviews for this product yet.
              </p>
              <p className="text-gray-400 text-xs mt-1">
                Be the first to write a review!
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ReviewsForm;
