import React from 'react';
import { useCart } from '../context/CartContext';
import '../styles/Checkout.css';

function Checkout() {
  const { cartItems, removeFromCart } = useCart();

  const handleCheckout = () => {
    alert('Checkout successful!');
  };

  return (
    <div className="checkout">
      <h1>Checkout</h1>
      {cartItems.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        <div className="checkout-items">
          {cartItems.map(item => (
            <div className="checkout-item" key={item.id}>
              <img src={item.fileUrl} alt={item.title} />
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <p>${item.price}</p>
              <button onClick={() => removeFromCart(item.id)}>Remove</button>
            </div>
          ))}
        </div>
      )}
      {cartItems.length > 0 && (
        <button onClick={handleCheckout}>Proceed to Checkout</button>
      )}
    </div>
  );
}

export default Checkout;
