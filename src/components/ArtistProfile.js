import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import SwipeableViews from 'react-swipeable-views';
import { db } from '../firebase';
import '../styles/UserProfile.css';

function ArtistProfile() {
  const { id } = useParams();
  const history = useHistory();
  const [artist, setArtist] = useState(null);
  const [sections, setSections] = useState([]);
  const [shopItems, setShopItems] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState({});

  useEffect(() => {
    const fetchArtist = async () => {
      const docRef = doc(db, 'users', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const artistData = docSnap.data();
        setArtist(artistData);
        setSections(artistData.sections || []);
      }
    };

    const fetchShopItems = async () => {
      const q = query(collection(db, 'shops'), where('userId', '==', id));
      const querySnapshot = await getDocs(q);
      const itemsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setShopItems(itemsData);
    };

    const fetchPortfolio = async () => {
      const q = query(collection(db, 'portfolios'), where('userId', '==', id));
      const querySnapshot = await getDocs(q);
      const portfolioData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPortfolio(portfolioData);
    };

    fetchArtist();
    fetchShopItems();
    fetchPortfolio();
  }, [id]);

  if (!artist) {
    return <div>Loading...</div>;
  }

  const handleShopItemClick = (shopId) => {
    history.push(`/art/${shopId}`);
  };

  const toggleDropdown = (index) => {
    setDropdownOpen((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const addToWishlist = async (item) => {
    const userId = id; // Replace this with the current logged-in user ID
    const wishlistRef = collection(db, 'wishlists');
    await addDoc(wishlistRef, {
      userId,
      itemId: item.id,
      itemType: item.type,
      itemData: item,
      createdAt: new Date()
    });
    alert('Added to wishlist!');
  };

  const renderDropdown = (index, item, type) => (
    <div className="dropdown" onClick={() => toggleDropdown(index)}>
      <button className="dropdown-toggle">Options</button>
      {dropdownOpen[index] && (
        <div className="dropdown-menu">
          <button onClick={() => addToWishlist({ ...item, type })}>Add to Wishlist</button>
        </div>
      )}
    </div>
  );

  const renderSection = (title, items, renderItem) => (
    items.length > 0 && (
      <div className="grid-section">
        <h2>{title}</h2>
        <SwipeableViews enableMouseEvents>
          {items.map((item, index) => renderItem(item, index))}
        </SwipeableViews>
      </div>
    )
  );

  return (
    <div className="page artist-profile-page">
      <div className="profile-header">
        <img
          src={artist.photoURL || 'https://via.placeholder.com/150'}
          alt={artist.displayName}
        />
        <div className="profile-info">
          <h1>{artist.displayName}</h1>
          <p>{artist.city}</p>
          <p>{artist.profession}</p>
          <p>{artist.bio || 'No bio available.'}</p>
          <button onClick={() => history.push(`/chat?recipient=${id}`)}>Contact</button>
        </div>
      </div>
      {sections.includes('Shop Items') && renderSection('Shop Items', shopItems, (item, index) => (
        <div key={index} className="grid-item" onClick={() => handleShopItemClick(item.id)}>
          <img src={item.fileUrl} alt={item.title} />
          <h3>{item.title}</h3>
          <p>{item.description}</p>
          <p>${item.price}</p>
          {renderDropdown(index, item, 'shopItem')}
        </div>
      ))}
      {sections.includes('Portfolio') && renderSection('Portfolio', portfolio, (item, index) => (
        <div key={index} className="grid-item">
          {item.fileType === 'video' ? (
            <video controls src={item.fileUrl} alt="portfolio video" />
          ) : (
            <img src={item.fileUrl} alt="portfolio item" />
          )}
          {renderDropdown(`portfolio-${index}`, item, 'portfolio')}
        </div>
      ))}
    </div>
  );
}

export default ArtistProfile;
