import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

function UploadForms({ section, profile }) {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      const q = query(collection(db, section.toLowerCase()), where('userId', '==', profile.userId));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setItems(data);
    };

    fetchItems();
  }, [section, profile.userId]);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setNewItem(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (newItem) {
      const storageRef = ref(storage, `${section.toLowerCase()}/${profile.userId}/${newItem.name}`);
      await uploadBytes(storageRef, newItem);
      const fileUrl = await getDownloadURL(storageRef);

      await addDoc(collection(db, section.toLowerCase()), {
        userId: profile.userId,
        fileUrl,
        createdAt: new Date()
      });

      // Fetch updated items after upload
      const q = query(collection(db, section.toLowerCase()), where('userId', '==', profile.userId));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setItems(data);
    }
  };

  return (
    <div className="upload-section">
      <h2>{section}</h2>
      <div className="grid">
        {items.length > 0 ? (
          items.map(item => (
            <div key={item.id} className="grid-item">
              {item.fileUrl ? (
                item.fileUrl.endsWith('.mp4') ? (
                  <video src={item.fileUrl} controls />
                ) : (
                  <img src={item.fileUrl} alt={section} />
                )
              ) : (
                <p>No media available</p>
              )}
            </div>
          ))
        ) : (
          <p>No items to display</p>
        )}
      </div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default UploadForms;
