import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useCart } from '../context/CartContext';
import '../styles/ArtListing.css';

function ArtListing() {
  const [shopItems, setShopItems] = useState([]);
  const { addToCart } = useCart();
  const history = useHistory();

  useEffect(() => {
    const fetchShopItems = async () => {
      const querySnapshot = await getDocs(collection(db, 'shops'));
      const itemsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setShopItems(itemsData);
    };

    fetchShopItems();
  }, []);

  const handleItemClick = (id) => {
    history.push(`/art-details/${id}`);
  };

  return (
    <div className="art-listing">
      <h1>All Shop Items</h1>
      <div className="shop-items-grid">
        {shopItems.map(item => (
          <div className="shop-item-card" key={item.id}>
            <img
              src={item.fileUrl}
              alt={item.title}
              className="shop-item-image"
              onClick={() => handleItemClick(item.id)}
            />
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <p>${item.price}</p>
            <button onClick={() => addToCart(item)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ArtListing;
