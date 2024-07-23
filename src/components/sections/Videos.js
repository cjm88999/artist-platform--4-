import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, deleteDoc } from 'firebase/firestore';
import { db, storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import '../../styles/Videos.css';

function Videos({ profile }) {
  const [videos, setVideos] = useState([]);
  const [newVideo, setNewVideo] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      const q = query(collection(db, 'videos'), where('userId', '==', profile.userId));
      const querySnapshot = await getDocs(q);
      const videosData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setVideos(videosData);
    };

    fetchVideos();
  }, [profile.userId]);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setNewVideo(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (newVideo) {
      const storageRef = ref(storage, `videos/${profile.userId}/${newVideo.name}`);
      await uploadBytes(storageRef, newVideo);
      const fileUrl = await getDownloadURL(storageRef);

      await addDoc(collection(db, 'videos'), {
        userId: profile.userId,
        fileUrl,
        createdAt: new Date()
      });

      setVideos([...videos, { fileUrl, createdAt: new Date() }]);
      setNewVideo(null);
    }
  };

  const handleDelete = async (id, fileUrl) => {
    await deleteDoc(doc(db, 'videos', id));
    const fileRef = ref(storage, fileUrl);
    await deleteObject(fileRef);
    setVideos(videos.filter(item => item.id !== id));
  };

  return (
    <div className="grid-section">
      <h2>Videos</h2>
      <div className="grid">
        {videos.map(video => (
          <div className="grid-item" key={video.id}>
            <video src={video.fileUrl} controls></video>
            <button onClick={() => handleDelete(video.id, video.fileUrl)}>Delete</button>
          </div>
        ))}
      </div>
      <div className="upload-section">
        <label htmlFor="videoUpload" className="upload-label">Choose File</label>
        <input type="file" id="videoUpload" className="upload-input" onChange={handleFileChange} />
        <button onClick={handleUpload} className="profile-button">Upload Video</button>
      </div>
    </div>
  );
}

export default Videos;
