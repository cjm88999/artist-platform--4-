import React, { useState } from 'react';
import { getAuth } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import '../styles/UploadForm.css';

function UploadForm() {
  const [step, setStep] = useState(1);
  const [type, setType] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    date: '',
    time: '',
    file: null,
  });

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSelectType = (selectedType) => {
    setType(selectedType);
    handleNext();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFormData({ ...formData, file: e.target.files[0] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    const user = auth.currentUser;

    if (user && formData.file) {
      const storageRef = ref(storage, `uploads/${user.uid}/${formData.file.name}`);
      await uploadBytes(storageRef, formData.file);
      const fileUrl = await getDownloadURL(storageRef);

      const newData = {
        userId: user.uid,
        title: formData.title,
        description: formData.description,
        price: formData.price ? parseFloat(formData.price) : 0,
        date: formData.date || null,
        time: formData.time || null,
        fileUrl: fileUrl,
        type: type,
        createdAt: new Date()
      };

      try {
        const collectionRef = collection(db, type === 'shop' ? 'shops' : type === 'event' ? 'events' : type === 'portfolio' ? 'portfolios' : 'services');
        await addDoc(collectionRef, newData);
        alert('Upload successful!');
        setStep(1);
        setType('');
        setFormData({
          title: '',
          description: '',
          price: '',
          date: '',
          time: '',
          file: null,
        });
      } catch (error) {
        console.error('Error uploading document: ', error);
      }
    } else {
      alert('Please fill in all required fields and upload a file.');
    }
  };

  return (
    <div className="page upload-form">
      <div className="progress-bar">
        <div className={`progress-step ${step >= 1 ? 'completed' : ''}`}>1</div>
        <div className={`progress-step ${step >= 2 ? 'completed' : ''}`}>2</div>
      </div>
      {step === 1 && (
        <div className="step-one animated-step">
          <h1>Select Upload Type</h1>
          <div className="type-buttons">
            <button onClick={() => handleSelectType('shop')}>Shop Item</button>
            <button onClick={() => handleSelectType('event')}>Event</button>
            <button onClick={() => handleSelectType('portfolio')}>Portfolio Item</button>
            <button onClick={() => handleSelectType('service')}>Service</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="step-two animated-step">
          {type === 'shop' && (
            <div className="shop-form">
              <h1>Upload Shop Item</h1>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="title"
                  placeholder="Title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
                <textarea
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                ></textarea>
                <input
                  type="text"
                  name="price"
                  placeholder="Price"
                  value={formData.price}
                  onChange={handleChange}
                />
                <input type="file" onChange={handleFileChange} required />
                <button type="submit">Upload</button>
              </form>
            </div>
          )}

          {type === 'event' && (
            <div className="event-form">
              <h1>Upload Event</h1>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="title"
                  placeholder="Event Name"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
                <textarea
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                ></textarea>
                <input
                  type="date"
                  name="date"
                  placeholder="Date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
                <input
                  type="time"
                  name="time"
                  placeholder="Time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
                <input type="file" onChange={handleFileChange} required />
                <button type="submit">Upload</button>
              </form>
            </div>
          )}

          {type === 'portfolio' && (
            <div className="portfolio-form">
              <h1>Upload Portfolio Item</h1>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="title"
                  placeholder="Title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
                <textarea
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                ></textarea>
                <input type="file" onChange={handleFileChange} required />
                <button type="submit">Upload</button>
              </form>
            </div>
          )}

          {type === 'service' && (
            <div className="service-form">
              <h1>Upload Service</h1>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="title"
                  placeholder="Service Name"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
                <textarea
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                ></textarea>
                <input
                  type="text"
                  name="price"
                  placeholder="Price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
                <button type="submit">Upload</button>
              </form>
            </div>
          )}

          <button onClick={handleBack}>Back</button>
        </div>
      )}
    </div>
  );
}

export default UploadForm;
