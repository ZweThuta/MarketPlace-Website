import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

const AverageRating = ({ productId, isHomepage}) => {
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    fetchAverageRating();
  }, [productId]);

  const fetchAverageRating = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REVIEW_URL}?productId=${productId}&average=true`
      );
      setAverageRating(response.data.data.averageRating || 0);
    } catch (error) {
      console.error("Error fetching average rating:", error);
    }
  };

  return (
    <div>
      <p className="text-lg">
        {[1, 2, 3, 4, 5].map((star) => (
          <FontAwesomeIcon
            key={star}
            icon={faStar}
            className={
              !isHomepage
                ? `text-2xl ${
                    star <= Math.round(averageRating)
                      ? "text-yellow-500"
                      : "text-gray-300"
                  }`
                : `text-lg ${
                    star <= Math.round(averageRating)
                      ? "text-yellow-500"
                      : "text-gray-300"
                  }`
            }
          />
        ))}
        {
          !isHomepage && <span className="ml-3 text-lg text-gray-500 font-medium">({averageRating.toFixed(1)}) Based on customer reviews</span>
        }
      </p>
    </div>
  );
};

export default AverageRating;
