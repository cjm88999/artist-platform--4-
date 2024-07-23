import React from 'react';
import { getAuth } from 'firebase/auth';

function ProfileHeader({ profile, setProfile, isEditing, setIsEditing }) {
  const auth = getAuth();
  const user = auth.currentUser;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const storageRef = ref(storage, `profileImages/${user.uid}`);
      await uploadBytes(storageRef, file);
      const photoURL = await getDownloadURL(storageRef);
      setProfile({ ...profile, photoURL });
    }
  };

  return (
    <div className="profile-header">
      <img src={profile.photoURL || 'https://via.placeholder.com/150'} alt="Profile" className="profile-image" />
      <div className="profile-info">
        <h1>{profile.displayName}</h1>
        <p>{profile.location}</p>
        <p>{profile.profession}</p>
        <p>{profile.bio}</p>
        <button onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
        {isEditing && (
          <form>
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
          </form>
        )}
      </div>
    </div>
  );
}

export default ProfileHeader;
