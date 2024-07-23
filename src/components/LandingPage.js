import React from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="page landing-page">
      <div className="hero">
        <h1>Welcome to Cohort</h1>
        <p>Discover talented artists and launch your business.</p>
        <div className="actions">
          <Link to="/login" className="button">Log In</Link>
          <Link to="/signup" className="button">Sign Up</Link>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
