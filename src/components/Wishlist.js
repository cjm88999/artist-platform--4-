import React, { useContext } from 'react';
import { WishlistContext } from '../context/WishlistContext';
import WishlistItem from './WishlistItem';

function Wishlist() {
  const { wishlistItems, removeItem } = useContext(WishlistContext);

  return (
    <div className="page wishlist-page">
      <h1>Your Wishlist</h1>
      {wishlistItems.length > 0 ? (
        <div className="wishlist-items">
          {wishlistItems.map(item => (
            <WishlistItem key={item.id} item={item} removeItem={removeItem} />
          ))}
        </div>
      ) : (
        <p>Your wishlist is empty</p>
      )}
    </div>
  );
}

export default Wishlist;
