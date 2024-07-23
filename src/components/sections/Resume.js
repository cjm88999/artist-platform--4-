import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, deleteDoc } from 'firebase/firestore';
import { db, storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import '../../styles/Resume.css';

function Resume({ profile }) {
  const [resume, setResume] = useState([]);
  const [newResume, setNewResume] = useState(null);

  useEffect(() => {
    const fetchResume = async () => {
      const q = query(collection(db, 'resume'), where('userId', '==', profile.userId));
      const querySnapshot = await getDocs(q);
      const resumeData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setResume(resumeData);
    };

    fetchResume();
  }, [profile.userId]);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setNewResume(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (newResume) {
      const storageRef = ref(storage, `resume/${profile.userId}/${newResume.name}`);
      await uploadBytes(storageRef, newResume);
      const fileUrl = await getDownloadURL(storageRef);

      await addDoc(collection(db, 'resume'), {
        userId: profile.userId,
        fileUrl,
        createdAt: new Date()
      });

      setResume([...resume, { fileUrl, createdAt: new Date() }]);
      setNewResume(null);
    }
  };

  const handleDelete = async (id, fileUrl) => {
    await deleteDoc(doc(db, 'resume', id));
    const fileRef = ref(storage, fileUrl);
    await deleteObject(fileRef);
    setResume(resume.filter(item => item.id !== id));
  };

  return (
    <div className="grid-section">
      <h2>Resume</h2>
      <div className="grid">
        {resume.map(item => (
          <div className="grid-item" key={item.id}>
            <a href={item.fileUrl} target="_blank" rel="noopener noreferrer">View Resume</a>
            <button onClick={() => handleDelete(item.id, item.fileUrl)}>Delete</button>
          </div>
        ))}
      </div>
      <div className="upload-section">
        <label htmlFor="resumeUpload" className="upload-label">Choose File</label>
        <input type="file" id="resumeUpload" className="upload-input" onChange={handleFileChange} />
        <button onClick={handleUpload} className="profile-button">Upload Resume</button>
      </div>
    </div>
  );
}

export default Resume;
