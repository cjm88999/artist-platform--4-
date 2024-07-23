import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import SignUp from './components/SignUp';
import Login from './components/Login';
import ArtistProfile from './components/ArtistProfile';
import ChatPage from './components/ChatPage';
import ArtListing from './components/ArtListing';
import ArtDetails from './components/ArtDetails';
import UploadArt from './components/UploadForm';
import UserProfile from './components/UserProfile';
import EditProfile from './components/EditProfile';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Wishlist from './components/Wishlist';
import Reviews from './components/Reviews';
import Messages from './components/Messages';
import Notifications from './components/Notifications';
import Search from './components/Search';
import Category from './components/Category';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { NotificationProvider } from './context/NotificationContext';
import cartIcon from './icons/cart-icon.png';
import messageIcon from './icons/message-icon.png';
import notificationIcon from './icons/notification-icon.png';
import CartPopup from './components/CartPopUp'; // Ensure this matches the actual filename

function App() {
  const [user, setUser] = useState(null);
  const [showMessages, setShowMessages] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const messagesPopup = document.querySelector('.messages-popup');
      const notificationsPopup = document.querySelector('.notifications-popup');
      const cartPopup = document.querySelector('.cart-popup');

      if (messagesPopup && !messagesPopup.contains(event.target)) {
        setShowMessages(false);
      }
      if (notificationsPopup && !notificationsPopup.contains(event.target)) {
        setShowNotifications(false);
      }
      if (cartPopup && !cartPopup.contains(event.target)) {
        setShowCart(false);
      }
    };

    const handleScroll = () => {
      setShowMessages(false);
      setShowNotifications(false);
      setShowCart(false);
    };

    if (showMessages || showNotifications || showCart) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('scroll', handleScroll);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('scroll', handleScroll);
    };
  }, [showMessages, showNotifications, showCart]);

  return (
    <NotificationProvider>
      <WishlistProvider>
        <CartProvider>
          <Router>
            <Navbar user={user} />
            <Switch>
              <Route exact path="/">
                {user ? <Redirect to="/user-profile" /> : <LandingPage />}
              </Route>
              <Route path="/signup">
                {user ? <Redirect to="/" /> : <SignUp />}
              </Route>
              <Route path="/login">
                {user ? <Redirect to="/" /> : <Login />}
              </Route>
              <Route path="/profile/:id" component={ArtistProfile} />
              <Route path="/art/:id" component={ArtDetails} />
              <Route path="/upload" component={UploadArt} />
              <Route path="/art-listing" component={ArtListing} />
              <Route path="/checkout" component={Checkout} />
              <Route path="/cart" component={CartPopup} />
              <Route path="/user-profile" component={UserProfile} />
              <Route path="/edit-profile" component={EditProfile} />
              <Route path="/wishlist" component={Wishlist} />
              <Route path="/reviews" component={Reviews} />
              <Route path="/messages" component={Messages} />
              <Route path="/notifications" component={Notifications} />
              <Route path="/artist-profile/:id" component={ArtistProfile} />
              <Route path="/chat" component={ChatPage} />
              <Route path="/search" component={Search} />
              <Route path="/category/:category" component={Category} />
            </Switch>
            <Footer />
            <div className="icons">
              <div className="icon" onClick={() => setShowCart(!showCart)}>
                <img src={cartIcon} alt="Cart" />
              </div>
              <div className="icon" onClick={() => setShowMessages(!showMessages)}>
                <img src={messageIcon} alt="Messages" />
              </div>
              <div className="icon" onClick={() => setShowNotifications(!showNotifications)}>
                <img src={notificationIcon} alt="Notifications" />
              </div>
            </div>
            {showCart && <Cart isVisible={showCart} onClose={() => setShowCart(false)} />}
            {showMessages && <Messages isVisible={showMessages} onClose={() => setShowMessages(false)} />}
            {showNotifications && <Notifications isVisible={showNotifications} onClose={() => setShowNotifications(false)} />}
          </Router>
        </CartProvider>
      </WishlistProvider>
    </NotificationProvider>
  );
}

export default App;
