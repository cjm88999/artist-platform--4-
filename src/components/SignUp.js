import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import '../styles/SignUp.css';

function SignUp() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    profession: '',
    city: '',
    state: '',
    profileImage: null,
  });
  const history = useHistory();

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFormData({ ...formData, profileImage: e.target.files[0] });
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      let imageUrl = '';

      if (formData.profileImage) {
        const storageRef = ref(storage, `profileImages/${user.uid}`);
        await uploadBytes(storageRef, formData.profileImage);
        imageUrl = await getDownloadURL(storageRef);
      }

      await setDoc(doc(db, 'users', user.uid), {
        email: formData.email,
        name: formData.name,
        profession: formData.profession,
        city: formData.city,
        state: formData.state,
        profileImage: imageUrl,
      });

      localStorage.setItem('user', JSON.stringify(user));
      history.push('/');
    } catch (error) {
      console.error("Error signing up: ", error);
      alert("Failed to sign up. Please try again.");
    }
  };

  return (
    <div className="page signup-page">
      <h1>Sign Up</h1>
      <div className="progress-bar">
        <div className="progress" style={{ width: `${(step / 3) * 100}%` }}></div>
      </div>
      <form onSubmit={handleSignUp}>
        {step === 1 && (
          <div className="step">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button type="button" onClick={handleNext}>Next</button>
          </div>
        )}

        {step === 2 && (
          <div className="step">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="profession"
              placeholder="Profession"
              value={formData.profession}
              onChange={handleChange}
              required
            />
            <button type="button" onClick={handleBack}>Back</button>
            <button type="button" onClick={handleNext}>Next</button>
          </div>
        )}

        {step === 3 && (
          <div className="step">
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              value={formData.state}
              onChange={handleChange}
              required
            />
            <label htmlFor="profileImage">Profile Image</label>
            <input
              type="file"
              id="profileImage"
              name="profileImage"
              onChange={handleFileChange}
            />
            <button type="button" onClick={handleBack}>Back</button>
            <button type="submit">Sign Up</button>
          </div>
        )}
      </form>
    </div>
  );
}

export default SignUp;
