import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import '../../styles/Services.css';

function Services({ profile }) {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({ title: '', description: '', price: '' });

  useEffect(() => {
    const fetchServices = async () => {
      const q = query(collection(db, 'services'), where('userId', '==', profile.userId));
      const querySnapshot = await getDocs(q);
      const servicesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setServices(servicesData);
    };

    fetchServices();
  }, [profile.userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewService({ ...newService, [name]: value });
  };

  const handleUpload = async () => {
    await addDoc(collection(db, 'services'), {
      ...newService,
      userId: profile.userId,
      createdAt: new Date()
    });

    setServices([...services, { ...newService, createdAt: new Date() }]);
    setNewService({ title: '', description: '', price: '' });
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'services', id));
    setServices(services.filter(service => service.id !== id));
  };

  return (
    <div className="grid-section">
      <h2>Services</h2>
      <div className="grid">
        {services.map(service => (
          <div className="grid-item" key={service.id}>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
            <p>${service.price}</p>
            <button onClick={() => handleDelete(service.id)}>Delete</button>
          </div>
        ))}
      </div>
      <div className="upload-section">
        <input type="text" name="title" placeholder="Title" value={newService.title} onChange={handleChange} />
        <textarea name="description" placeholder="Description" value={newService.description} onChange={handleChange}></textarea>
        <input type="text" name="price" placeholder="Price" value={newService.price} onChange={handleChange} />
        <button onClick={handleUpload} className="profile-button">Add Service</button>
      </div>
    </div>
  );
}

export default Services;
