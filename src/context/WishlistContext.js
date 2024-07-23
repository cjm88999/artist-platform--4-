import React, { createContext, useState } from 'react';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);

  const addItem = (item) => {
    setWishlistItems([...wishlistItems, item]);
  };

  const removeItem = (id) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== id));
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, addItem, removeItem }}>
      {children}
    </WishlistContext.Provider>
  );
};
