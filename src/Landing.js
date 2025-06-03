import React from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css'; 
import coffeeImage from './asset/undraw_coffee-time_98vi.svg'; // Gambar orang ngopi kamu

const Landing = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/home');
  };

  return (
    <div className="landing-container">
      <div className="card-container">
        <h1 className="welcome-title">Welcome</h1> {/* Tambahan tulisan Welcome */}
        <img 
          src={coffeeImage} 
          alt="Sea Coffee" 
          className="landing-image"
        />
        <h1 className="landing-title">Sea Coffee Vibes ☕️</h1>
        <p className="landing-description">
          Kopi enak, pesen gampang, langsung siap! 🚀
        </p>
        <p className="cta-text">Siap buat ngopi? Let's go! 🚀</p>
        <button
          onClick={handleGetStarted}
          className="landing-button"
        >
          Gaskeun! 🚀
        </button>
      </div>
    </div>
  );
};

export default Landing;
