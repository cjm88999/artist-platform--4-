import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, deleteDoc } from 'firebase/firestore';
import { db, storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import '../../styles/Reels.css';

function Reels({ profile }) {
  const [reels, setReels] = useState([]);
  const [newReel, setNewReel] = useState(null);

  useEffect(() => {
    const fetchReels = async () => {
      const q = query(collection(db, 'reels'), where('userId', '==', profile.userId));
      const querySnapshot = await getDocs(q);
      const reelsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReels(reelsData);
    };

    fetchReels();
  }, [profile.userId]);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setNewReel(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (newReel) {
      const storageRef = ref(storage, `reels/${profile.userId}/${newReel.name}`);
      await uploadBytes(storageRef, newReel);
      const fileUrl = await getDownloadURL(storageRef);

      await addDoc(collection(db, 'reels'), {
        userId: profile.userId,
        fileUrl,
        createdAt: new Date()
      });

      setReels([...reels, { fileUrl, createdAt: new Date() }]);
      setNewReel(null);
    }
  };

  const handleDelete = async (id, fileUrl) => {
    await deleteDoc(doc(db, 'reels', id));
    const fileRef = ref(storage, fileUrl);
    await deleteObject(fileRef);
    setReels(reels.filter(item => item.id !== id));
  };

  return (
    <div className="grid-section">
      <h2>Reels</h2>
      <div className="grid">
        {reels.map(reel => (
          <div className="grid-item" key={reel.id}>
            <video src={reel.fileUrl} controls></video>
            <button onClick={() => handleDelete(reel.id, reel.fileUrl)}>Delete</button>
          </div>
        ))}
      </div>
      <div className="upload-section">
        <label htmlFor="reelUpload" className="upload-label">Choose File</label>
        <input type="file" id="reelUpload" className="upload-input" onChange={handleFileChange} />
        <button onClick={handleUpload} className="profile-button">Upload Reel</button>
      </div>
    </div>
  );
}

export default Reels;
