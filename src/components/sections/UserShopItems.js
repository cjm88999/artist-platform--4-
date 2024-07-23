import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import '../../styles/UserShopItems.css';

function UserShopItems({ userId }) {
  const [shopItems, setShopItems] = useState([]);

  useEffect(() => {
    const fetchShopItems = async () => {
      if (userId) {
        const q = query(collection(db, 'shopItems'), where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        const itemsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setShopItems(itemsData);
      }
    };

    fetchShopItems();
  }, [userId]);

  return (
    <div className="user-shop-items">
      <h2>Your Shop Items</h2>
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

export default UserShopItems;
