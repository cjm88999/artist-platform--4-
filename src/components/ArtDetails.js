import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useCart } from '../context/CartContext';
import '../styles/ArtDetails.css';

function ArtDetails() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchItem = async () => {
      const docRef = doc(db, 'shops', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setItem(docSnap.data());
      } else {
        console.log('No such document!');
      }
    };

    fetchItem();
  }, [id]);

  if (!item) {
    return <div>Loading...</div>;
  }

  return (
    <div className="art-details">
      <img src={item.fileUrl} alt={item.title} className="art-details-image" />
      <h1>{item.title}</h1>
      <p>{item.description}</p>
      <p>${item.price}</p>
      <button onClick={() => addToCart(item)}>Add to Cart</button>
    </div>
  );
}

export default ArtDetails;
