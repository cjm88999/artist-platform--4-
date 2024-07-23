import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import '../../styles/Music.css';

function Music({ userId }) {
  const [musicItems, setMusicItems] = useState([]);

  useEffect(() => {
    const fetchMusicItems = async () => {
      if (userId) {
        const q = query(collection(db, 'music'), where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        const itemsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMusicItems(itemsData);
      }
    };

    fetchMusicItems();
  }, [userId]);

  return (
    <div className="music">
      <h2>Your Music</h2>
      <div className="music-grid">
        {musicItems.map(item => (
          <div className="music-item" key={item.id}>
            <audio controls src={item.fileUrl}></audio>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Music;
