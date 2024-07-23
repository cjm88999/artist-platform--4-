import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { db, storage } from '../firebase';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Portfolio from './sections/Portfolio';
import ShopItems from './sections/ShopItems';
import Music from './sections/Music';
import ExternalLinks from './sections/ExternalLinks';
import dropdownIcon from '../icons/dropdown.png';
import '../styles/UserProfile.css';

function UserProfile() {
  const auth = getAuth();
  const user = auth.currentUser;
  const defaultImageUrl = 'https://via.placeholder.com/150';
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const availableSections = [
    'Portfolio', 'Events', 'Services', 'Resume', 'Reels', 'Videos', 'Experience', 'Skills', 'Shop Items', 'Music', 'External Links'
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setProfile({
            id: user.uid,
            ...userData,
            sections: userData.sections || []
          });
        } else {
          await setDoc(docRef, {
            id: user.uid,
            displayName: '',
            bio: '',
            location: '',
            profession: '',
            photoURL: user?.photoURL || defaultImageUrl,
            sections: []
          });
          setProfile({
            id: user.uid,
            displayName: '',
            bio: '',
            location: '',
            profession: '',
            photoURL: user?.photoURL || defaultImageUrl,
            sections: []
          });
        }
      }
    };

    fetchProfile();
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prevProfile => ({ ...prevProfile, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user && profile) {
      if (imageFile) {
        const storageRef = ref(storage, `profileImages/${user.uid}`);
        await uploadBytes(storageRef, imageFile);
        const imageUrl = await getDownloadURL(storageRef);
        profile.photoURL = imageUrl;
      }

      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, profile);
      setIsEditing(false);
      alert('Profile updated successfully!');
    }
  };

  const handleAddSection = (section) => {
    if (!profile.sections.includes(section)) {
      const updatedSections = [...profile.sections, section];
      setProfile({ ...profile, sections: updatedSections });
    }
  };

  const handleRemoveSection = (section) => {
    const updatedSections = profile.sections.filter(sec => sec !== section);
    setProfile({ ...profile, sections: updatedSections });
  };

  const handleSaveSections = async () => {
    if (user) {
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, { sections: profile.sections });
      alert('Sections updated successfully!');
    }
  };

  const renderSection = (section) => {
    switch (section) {
      case 'Portfolio':
        return <Portfolio profile={profile} />;
      case 'Shop Items':
        return <ShopItems profile={profile} />;
      case 'Music':
        return <Music profile={profile} />;
      case 'External Links':
        return <ExternalLinks profile={profile} />;
      default:
        return null;
    }
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-profile-page">
      <div className="profile-header">
        <img src={profile.photoURL || defaultImageUrl} alt="Profile" className="profile-image" />
        <div className="profile-info">
          <h1>{profile.displayName}</h1>
          <p>{profile.location}</p>
          <p>{profile.profession}</p>
          <p>{profile.bio}</p>
          <button onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
          {isEditing && (
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="displayName"
                placeholder="Display Name"
                value={profile.displayName}
                onChange={handleChange}
              />
              <textarea
                name="bio"
                placeholder="Bio"
                value={profile.bio}
                onChange={handleChange}
              />
              <input
                type="text"
                name="location"
                placeholder="Location"
                value={profile.location}
                onChange={handleChange}
              />
              <input
                type="text"
                name="profession"
                placeholder="Profession"
                value={profile.profession}
                onChange={handleChange}
              />
              <label htmlFor="upload" className="upload-label">Choose File</label>
              <input type="file" id="upload" className="upload-input" onChange={handleFileChange} />
              <button type="submit" className="profile-button">Save</button>
              <div className="manage-sections">
                <h2>Manage Sections</h2>
                {availableSections.map((section, index) => (
                  <div key={index} className="section-item">
                    <span>{section}</span>
                    {profile.sections.includes(section) ? (
                      <button onClick={() => handleRemoveSection(section)} className="remove-button">Remove</button>
                    ) : (
                      <button onClick={() => handleAddSection(section)} className="add-button">Add</button>
                    )}
                  </div>
                ))}
                <button onClick={handleSaveSections} className="profile-button">Save Sections</button>
              </div>
            </form>
          )}
        </div>
        <div className="dropdown-container" ref={dropdownRef}>
          <img
            src={dropdownIcon}
            alt="Dropdown"
            className="dropdown-icon"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          />
          {dropdownOpen && (
            <div className="dropdown-menu">
              <Link to="/wishlist">Wishlist</Link>
              <Link to="/reviews">Reviews</Link>
              <Link to="/messages">Messages</Link>
              <Link to="/notifications">Notifications</Link>
            </div>
          )}
        </div>
      </div>
      <div className="sections-container">
        {profile.sections.map(section => renderSection(section))}
      </div>
    </div>
  );
}

export default UserProfile;
