import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

function Reviews() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const querySnapshot = await getDocs(collection(db, 'reviews'));
      const reviewsData = querySnapshot.docs.map(doc => doc.data());
      setReviews(reviewsData);
    };

    fetchReviews();
  }, []);

  return (
    <div className="page reviews-page">
      <h1>Reviews</h1>
      <div className="reviews">
        {reviews.map(review => (
          <div className="review" key={review.id}>
            <h2>{review.title}</h2>
            <p>{review.content}</p>
            <p>Rating: {review.rating}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Reviews;
