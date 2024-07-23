import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

function Notifications({ isVisible, onClose }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const querySnapshot = await getDocs(collection(db, 'notifications'));
      const notificationsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNotifications(notificationsData);
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!document.querySelector('.notifications-popup').contains(event.target)) {
        onClose();
      }
    };

    const handleScroll = () => {
      onClose();
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('scroll', handleScroll);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('scroll', handleScroll);
    };
  }, [isVisible, onClose]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="popup notifications-popup">
      <h2>Notifications</h2>
      <div className="notifications">
        {notifications.map(notification => (
          <div className="notification" key={notification.id}>
            <h3>{notification.title}</h3>
            <p>{notification.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notifications;
