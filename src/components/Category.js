import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useParams } from 'react-router-dom';

function Category() {
  const { category } = useParams();
  const [artworks, setArtworks] = useState([]);

  useEffect(() => {
    const fetchArtworks = async () => {
      const querySnapshot = await getDocs(collection(db, 'artworks'));
      const artworksData = querySnapshot.docs
        .map(doc => doc.data())
        .filter(art => art.category === category);
      setArtworks(artworksData);
    };

    fetchArtworks();
  }, [category]);

  return (
    <div className="page category-page">
      <h1>{category} Art</h1>
      <div className="artworks">
        {artworks.map(art => (
          <div className="artwork" key={art.id}>
            <img src={art.imageUrl} alt={art.title} />
            <h2>{art.title}</h2>
            <p>{art.description}</p>
            <p>${art.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Category;
