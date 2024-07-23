import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import '../../styles/Experience.css';

function Experience({ profile }) {
  const [experience, setExperience] = useState([]);
  const [newExperience, setNewExperience] = useState({ title: '', company: '', description: '' });

  useEffect(() => {
    const fetchExperience = async () => {
      const q = query(collection(db, 'experience'), where('userId', '==', profile.userId));
      const querySnapshot = await getDocs(q);
      const experienceData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setExperience(experienceData);
    };

    fetchExperience();
  }, [profile.userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewExperience({ ...newExperience, [name]: value });
  };

  const handleAdd = async () => {
    if (newExperience.title && newExperience.company) {
      await addDoc(collection(db, 'experience'), {
        userId: profile.userId,
        ...newExperience,
        createdAt: new Date()
      });

      setExperience([...experience, { ...newExperience, createdAt: new Date() }]);
      setNewExperience({ title: '', company: '', description: '' });
    }
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'experience', id));
    setExperience(experience.filter(item => item.id !== id));
  };

  return (
    <div className="grid-section">
      <h2>Experience</h2>
      <div className="grid">
        {experience.map(item => (
          <div className="grid-item" key={item.id}>
            <h3>{item.title}</h3>
            <p>{item.company}</p>
            <p>{item.description}</p>
            <button onClick={() => handleDelete(item.id)}>Delete</button>
          </div>
        ))}
      </div>
      <div className="upload-section">
        <input type="text" name="title" placeholder="Title" value={newExperience.title} onChange={handleChange} />
        <input type="text" name="company" placeholder="Company" value={newExperience.company} onChange={handleChange} />
        <textarea name="description" placeholder="Description" value={newExperience.description} onChange={handleChange} />
        <button onClick={handleAdd} className="profile-button">Add Experience</button>
      </div>
    </div>
  );
}

export default Experience;
