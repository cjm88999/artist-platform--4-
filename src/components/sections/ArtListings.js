import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import '../styles/ArtListings.css';

function ArtListings() {
  const [shopItems, setShopItems] = useState([]);

  useEffect(() => {
    const fetchShopItems = async () => {
      const querySnapshot = await getDocs(collection(db, 'shopItems'));
      const itemsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setShopItems(itemsData);
    };

    fetchShopItems();
  }, []);

  return (
    <div className="art-listings">
      <h1>All Shop Items</h1>
      <div className="shop-items-grid">
        {shopItems.map(item => (
          <div className="shop-item-card" key={item.id}>
            <img src={item.imageUrl} alt={item.title} />
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <p>${item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ArtListings;
