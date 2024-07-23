import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';

function Search() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersData);
    };

    fetchUsers();
  }, []);

  return (
    <div className="page">
      <h1>Search Artists</h1>
      <div className="grid">
        {users.map(user => (
          <div className="search-profile-card" key={user.id}>
            <Link to={`/artist-profile/${user.id}`}>
              <img src={user.photoURL || ''} alt={user.displayName} />
              <h3>{user.displayName}</h3>
              <p>{user.city}</p>
              <p>{user.profession}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Search;
