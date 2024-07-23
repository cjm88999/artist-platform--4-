import React from 'react';

function CartItem({ item, removeItem }) {
  return (
    <div className="cart-item">
      <img src={item.imageUrl} alt={item.title} />
      <div>
        <h2>{item.title}</h2>
        <p>${item.price}</p>
        <button onClick={() => removeItem(item.id)}>Remove</button>
      </div>
    </div>
  );
}

export default CartItem;
