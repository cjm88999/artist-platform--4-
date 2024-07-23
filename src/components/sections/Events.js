import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import '../../styles/Events.css';

function Events({ profile }) {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: '', description: '', date: '' });

  useEffect(() => {
    const fetchEvents = async () => {
      const q = query(collection(db, 'events'), where('userId', '==', profile.userId));
      const querySnapshot = await getDocs(q);
      const eventsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEvents(eventsData);
    };

    fetchEvents();
  }, [profile.userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  const handleUpload = async () => {
    await addDoc(collection(db, 'events'), {
      ...newEvent,
      userId: profile.userId,
      createdAt: new Date()
    });

    setEvents([...events, { ...newEvent, createdAt: new Date() }]);
    setNewEvent({ title: '', description: '', date: '' });
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'events', id));
    setEvents(events.filter(event => event.id !== id));
  };

  return (
    <div className="grid-section">
      <h2>Events</h2>
      <div className="grid">
        {events.map(event => (
          <div className="grid-item" key={event.id}>
            <h3>{event.title}</h3>
            <p>{event.description}</p>
            <p>{event.date}</p>
            <button onClick={() => handleDelete(event.id)}>Delete</button>
          </div>
        ))}
      </div>
      <div className="upload-section">
        <input type="text" name="title" placeholder="Title" value={newEvent.title} onChange={handleChange} />
        <textarea name="description" placeholder="Description" value={newEvent.description} onChange={handleChange}></textarea>
        <input type="date" name="date" placeholder="Date" value={newEvent.date} onChange={handleChange} />
        <button onClick={handleUpload} className="profile-button">Add Event</button>
      </div>
    </div>
  );
}

export default Events;
