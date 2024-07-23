import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import '../../styles/ExternalLinks.css';

function ExternalLinks({ profile }) {
  const [externalLinks, setExternalLinks] = useState([]);

  useEffect(() => {
    const fetchExternalLinks = async () => {
      if (profile?.id) {
        const q = query(collection(db, 'externalLinks'), where('userId', '==', profile.id));
        const querySnapshot = await getDocs(q);
        const links = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setExternalLinks(links);
      }
    };

    fetchExternalLinks();
  }, [profile]);

  const handleDeleteLink = async (id) => {
    if (profile?.id) {
      const docRef = doc(db, 'externalLinks', id);
      await deleteDoc(docRef);
      setExternalLinks(externalLinks.filter(link => link.id !== id));
    }
  };

  return (
    <div className="external-links">
      <h2>External Links</h2>
      <div className="grid">
        {externalLinks.map(link => (
          <div className="grid-item" key={link.id}>
            <a href={link.url} target="_blank" rel="noopener noreferrer">{link.title}</a>
            <button onClick={() => handleDeleteLink(link.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExternalLinks;
