import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { collection, query, where, addDoc, getDocs, onSnapshot, orderBy, serverTimestamp, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import '../styles/ChatPage.css';

function ChatPage() {
  const auth = getAuth();
  const user = auth.currentUser;
  const searchParams = new URLSearchParams(window.location.search);
  const recipientId = searchParams.get('recipient');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatId, setChatId] = useState(null);
  const [recipientName, setRecipientName] = useState('');
  const [senderName, setSenderName] = useState('');

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setSenderName(userDoc.data().displayName);
        }

        const recipientDoc = await getDoc(doc(db, 'users', recipientId));
        if (recipientDoc.exists()) {
          setRecipientName(recipientDoc.data().displayName);
        }
      }
    };

    const createOrLoadChat = async () => {
      if (user && recipientId) {
        const q = query(
          collection(db, 'chats'),
          where('participants', 'array-contains', user.uid)
        );
        const chatSnapshot = await getDocs(q);
        let chatFound = false;
        
        chatSnapshot.forEach(doc => {
          if (doc.data().participants.includes(recipientId)) {
            setChatId(doc.id);
            chatFound = true;
          }
        });

        if (!chatFound) {
          const chatDoc = await addDoc(collection(db, 'chats'), {
            participants: [user.uid, recipientId],
            createdAt: serverTimestamp(),
          });
          setChatId(chatDoc.id);
        }
      }
    };

    fetchUserDetails();
    createOrLoadChat();
  }, [user, recipientId]);

  useEffect(() => {
    if (chatId) {
      const messagesRef = query(
        collection(db, 'chats', chatId, 'messages'),
        orderBy('createdAt')
      );

      const unsubscribe = onSnapshot(messagesRef, (snapshot) => {
        const messagesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMessages(messagesData);

        // Mark messages as read
        snapshot.docs.forEach(doc => {
          if (doc.data().recipientId === user.uid && !doc.data().isRead) {
            updateDoc(doc.ref, { isRead: true });
          }
        });
      });

      return () => unsubscribe();
    }
  }, [chatId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() && chatId) {
      await addDoc(collection(db, 'chats', chatId, 'messages'), {
        text: newMessage,
        senderId: user.uid,
        recipientId: recipientId,
        createdAt: serverTimestamp(),
        isRead: false,
      });
      setNewMessage('');
    }
  };

  return (
    <div className="chat-page">
      <h1 className="chat-header">Chat with {recipientName}</h1>
      <div className="messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.senderId === user.uid ? 'sent' : 'received'}`}>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="message-form">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default ChatPage;
