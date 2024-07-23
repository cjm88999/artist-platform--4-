import React from 'react';

function SectionManager({ availableSections, profile, handleAddSection, handleRemoveSection, handleSaveSections }) {
  return (
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
      <button onClick={handleSaveSections} className="save-button">Save Sections</button>
    </div>
  );
}

export default SectionManager;
