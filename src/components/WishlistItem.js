import React from 'react';

function WishlistItem({ item, removeItem }) {
  return (
    <div className="wishlist-item">
      <img src={item.imageUrl} alt={item.title} />
      <div>
        <h2>{item.title}</h2>
        <p>${item.price}</p>
        <button onClick={() => removeItem(item.id)}>Remove</button>
      </div>
    </div>
  );
}

export default WishlistItem;
