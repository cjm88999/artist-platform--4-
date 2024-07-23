import React from 'react';
import { useCart } from '../context/CartContext';
import '../styles/CartPopUp.css';

function CartPopUp({ isVisible, onClose }) {
  const { cartItems, removeFromCart } = useCart();

  if (!isVisible) {
    return null;
  }

  return (
    <div className="cart-popup">
      <h2>Cart</h2>
      {cartItems.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        <div className="cart-items">
          {cartItems.map(item => (
            <div className="cart-item" key={item.id}>
              <img src={item.fileUrl} alt={item.title} />
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <p>${item.price}</p>
              <button onClick={() => removeFromCart(item.id)}>Remove</button>
            </div>
          ))}
        </div>
      )}
      <button onClick={onClose}>Close</button>
    </div>
  );
}

export default CartPopUp;
