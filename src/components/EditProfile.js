import React, { useState } from 'react';

function EditProfile({ profile, availableSections, onSave }) {
  const [editingProfile, setEditingProfile] = useState({ ...profile });
  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingProfile({ ...editingProfile, [name]: value });
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleAddSection = (section) => {
    if (!editingProfile.sections.includes(section)) {
      const updatedSections = [...editingProfile.sections, section];
      setEditingProfile({ ...editingProfile, sections: updatedSections });
    }
  };

  const handleRemoveSection = (section) => {
    const updatedSections = editingProfile.sections.filter(sec => sec !== section);
    setEditingProfile({ ...editingProfile, sections: updatedSections });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (imageFile) {
      const storageRef = ref(storage, `profileImages/${editingProfile.userId}`);
      await uploadBytes(storageRef, imageFile);
      const imageUrl = await getDownloadURL(storageRef);
      editingProfile.photoURL = imageUrl;
    }

    onSave(editingProfile.sections);
  };

  return (
    <div className="edit-profile">
      <form onSubmit={handleSaveProfile}>
        <input
          type="text"
          name="displayName"
          placeholder="Display Name"
          value={editingProfile.displayName}
          onChange={handleChange}
        />
        <textarea
          name="bio"
          placeholder="Bio"
          value={editingProfile.bio}
          onChange={handleChange}
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={editingProfile.location}
          onChange={handleChange}
        />
        <input
          type="text"
          name="profession"
          placeholder="Profession"
          value={editingProfile.profession}
          onChange={handleChange}
        />
        <label htmlFor="upload" className="upload-label">Choose File</label>
        <input type="file" id="upload" className="upload-input" onChange={handleFileChange} />
        <button type="submit" className="save-button">Save</button>
      </form>
      <div className="manage-sections">
        <h2>Manage Sections</h2>
        {availableSections.map((section, index) => (
          <div key={index} className="section-item">
            <span>{section}</span>
            {editingProfile.sections.includes(section) ? (
              <button onClick={() => handleRemoveSection(section)} className="remove-button">Remove</button>
            ) : (
              <button onClick={() => handleAddSection(section)} className="add-button">Add</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default EditProfile;
