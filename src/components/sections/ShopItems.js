import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db, storage } from '../../firebase';
import { ref, deleteObject } from 'firebase/storage';
import '../../styles/ShopItems.css';

function ShopItems({ profile }) {
  const [shopItems, setShopItems] = useState([]);

  useEffect(() => {
    const fetchShopItems = async () => {
      if (profile && profile.id) {
        const q = query(collection(db, 'shops'), where('userId', '==', profile.id));
        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setShopItems(items);
      }
    };

    fetchShopItems();
  }, [profile]);

  const handleDeleteShopItem = async (id, imageUrl) => {
    if (profile && profile.id) {
      const docRef = doc(db, 'shops', id);
      await deleteDoc(docRef);
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
      setShopItems(shopItems.filter(item => item.id !== id));
    }
  };

  return (
    <div className="shop-items">
      <h2>Shop Items</h2>
      <div className="grid">
        {shopItems.map(item => (
          <div className="grid-item" key={item.id}>
            <img src={item.fileUrl} alt={item.title} />
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <p>${item.price}</p>
            <button onClick={() => handleDeleteShopItem(item.id, item.fileUrl)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ShopItems;
