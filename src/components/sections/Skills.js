import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import '../../styles/Skills.css';

function Skills({ profile }) {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({ name: '', level: '' });

  useEffect(() => {
    const fetchSkills = async () => {
      const q = query(collection(db, 'skills'), where('userId', '==', profile.userId));
      const querySnapshot = await getDocs(q);
      const skillsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSkills(skillsData);
    };

    fetchSkills();
  }, [profile.userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSkill({ ...newSkill, [name]: value });
  };

  const handleAdd = async () => {
    if (newSkill.name && newSkill.level) {
      await addDoc(collection(db, 'skills'), {
        userId: profile.userId,
        ...newSkill,
        createdAt: new Date()
      });

      setSkills([...skills, { ...newSkill, createdAt: new Date() }]);
      setNewSkill({ name: '', level: '' });
    }
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'skills', id));
    setSkills(skills.filter(item => item.id !== id));
  };

  return (
    <div className="grid-section">
      <h2>Skills</h2>
      <div className="grid">
        {skills.map(skill => (
          <div className="grid-item" key={skill.id}>
            <h3>{skill.name}</h3>
            <p>{skill.level}</p>
            <button onClick={() => handleDelete(skill.id)}>Delete</button>
          </div>
        ))}
      </div>
      <div className="upload-section">
        <input type="text" name="name" placeholder="Skill Name" value={newSkill.name} onChange={handleChange} />
        <input type="text" name="level" placeholder="Skill Level" value={newSkill.level} onChange={handleChange} />
        <button onClick={handleAdd} className="profile-button">Add Skill</button>
      </div>
    </div>
  );
}

export default Skills;
