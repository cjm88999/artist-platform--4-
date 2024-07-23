import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import '../../styles/Portfolio.css';

const Portfolio = ({ profile }) => {
  const [portfolioItems, setPortfolioItems] = useState([]);

  useEffect(() => {
    if (!profile || !profile.userId) return;

    const fetchPortfolioItems = async () => {
      try {
        const q = query(collection(db, 'portfolios'), where('userId', '==', profile.userId));
        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPortfolioItems(items);
      } catch (error) {
        console.error('Error fetching portfolio items: ', error);
      }
    };

    fetchPortfolioItems();
  }, [profile]);

  if (!profile || !profile.userId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="portfolio-section">
      <h2>Portfolio</h2>
      <div className="portfolio-grid">
        {portfolioItems.map(item => (
          <div key={item.id} className="portfolio-item">
            {item.fileType === 'video' ? (
              <video controls src={item.fileUrl}></video>
            ) : (
              <img src={item.fileUrl} alt={item.title} />
            )}
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Portfolio;
