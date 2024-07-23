import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { collection, query, where, getDocs, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useHistory } from 'react-router-dom';
import '../styles/Messages.css';

function Messages({ isVisible, onClose }) {
  const [chats, setChats] = useState([]);
  const [users, setUsers] = useState({});
  const [unreadChats, setUnreadChats] = useState({});
  const auth = getAuth();
  const user = auth.currentUser;
  const history = useHistory();

  useEffect(() => {
    const fetchChats = async () => {
      if (user) {
        const q = query(collection(db, 'chats'), where('participants', 'array-contains', user.uid));
        const chatSnapshot = await getDocs(q);
        const chatsData = chatSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setChats(chatsData);

        const userIds = chatsData.flatMap(chat => chat.participants);
        const uniqueUserIds = [...new Set(userIds)];
        const usersData = {};
        for (const userId of uniqueUserIds) {
          const userDoc = await getDoc(doc(db, 'users', userId));
          if (userDoc.exists()) {
            usersData[userId] = userDoc.data().displayName;
          }
        }
        setUsers(usersData);
      }
    };

    fetchChats();
  }, [user]);

  useEffect(() => {
    const fetchUnreadMessages = async () => {
      if (user) {
        const unreadData = {};
        const q = query(collection(db, 'chats'), where('participants', 'array-contains', user.uid));
        const chatSnapshot = await getDocs(q);
        for (const chatDoc of chatSnapshot.docs) {
          const messagesRef = collection(db, 'chats', chatDoc.id, 'messages');
          const messagesSnapshot = await getDocs(query(messagesRef, where('isRead', '==', false), where('recipientId', '==', user.uid)));
          if (!messagesSnapshot.empty) {
            unreadData[chatDoc.id] = messagesSnapshot.size;
          }
        }
        setUnreadChats(unreadData);
      }
    };

    fetchUnreadMessages();
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!document.querySelector('.messages-popup').contains(event.target)) {
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
    <div className="popup messages-popup">
      <h2>Messages</h2>
      <div className="messages">
        {chats.map(chat => (
          <div className="message" key={chat.id} onClick={() => history.push(`/chat?recipient=${chat.participants.find(p => p !== user.uid)}`)}>
            <h3>{users[chat.participants.find(p => p !== user.uid)]}</h3>
            {unreadChats[chat.id] && <span className="unread-bubble">{unreadChats[chat.id]}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Messages;
