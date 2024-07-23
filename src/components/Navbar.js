import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import cartIcon from '../icons/cart-icon.png';
import messageIcon from '../icons/message-icon.png';
import notificationIcon from '../icons/notification-icon.png';
import plusIcon from '../icons/plus-icon.png';
import shopIcon from '../icons/shop-icon.png';
import cohortIcon from '../icons/cohort-icon.png';
import '../styles/NavBar.css';

function Navbar({ user }) {
  const [profileImage, setProfileImage] = useState('../assets/profile_icon.png'); // Default profile icon
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const fetchProfileImage = async () => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          if (userData.photoURL) {
            setProfileImage(userData.photoURL);
          }
        }
      }
    };

    fetchProfileImage();
  }, [user]);

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth);
  };

  return (
    <div className="navbar">
      <Link to="/search">
        <img src={cohortIcon} alt="Cohort" className="icon" />
      </Link>
      {user && (
        <Link to="/upload">
          <img src={plusIcon} alt="Upload" className="icon" />
        </Link>
      )}
      <Link to="/art-listing">
        <img src={shopIcon} alt="Shop" className="icon" />
      </Link>
      <div className="profile-container">
        <Link to="/user-profile">
          <img
            src={profileImage}
            alt="Profile"
            className={`profile-image ${imageLoaded ? '' : 'loading'}`}
            onLoad={() => setImageLoaded(true)}
          />
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
