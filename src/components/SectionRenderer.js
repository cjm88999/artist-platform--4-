import React from 'react';
import UploadForms from './UploadForms';

const renderSection = (section, profile) => {
  switch (section) {
    case 'Art Listings':
      return (
        <UploadForms section="Art Listings" profile={profile} />
      );
    case 'Portfolio':
      return (
        <UploadForms section="Portfolio" profile={profile} />
      );
    case 'Events':
      return (
        <UploadForms section="Events" profile={profile} />
      );
    case 'Services':
      return (
        <UploadForms section="Services" profile={profile} />
      );
    case 'Resume':
      return (
        <UploadForms section="Resume" profile={profile} />
      );
    case 'Reels':
      return (
        <UploadForms section="Reels" profile={profile} />
      );
    case 'Videos':
      return (
        <UploadForms section="Videos" profile={profile} />
      );
    case 'Experience':
      return (
        <UploadForms section="Experience" profile={profile} />
      );
    case 'Skills':
      return (
        <UploadForms section="Skills" profile={profile} />
      );
    case 'Shop Items':
      return (
        <UploadForms section="Shop Items" profile={profile} />
      );
    case 'Music':
      return (
        <UploadForms section="Music" profile={profile} />
      );
    case 'External Links':
      return (
        <UploadForms section="External Links" profile={profile} />
      );
    default:
      return null;
  }
};

function SectionRenderer({ profile }) {
  return (
    <>
      {profile.sections.map(section => (
        <div key={section}>
          {renderSection(section, profile)}
        </div>
      ))}
    </>
  );
}

export default SectionRenderer;
