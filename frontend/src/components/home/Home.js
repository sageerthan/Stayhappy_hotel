import React, { useEffect, useState } from 'react';
import MainHeader from '../layout/MainHeader';
import Parallax from '../common/Parallax';
import HotelService from '../common/HotelService';
import RoomCarousel from '../common/RoomCarousel';
import RoomSearch from '../common/RoomSearch';
import { useLocation } from 'react-router-dom';

const Home = () => {
  const location = useLocation();
  const initialMessage = location.state?.message;
  const currentUser = localStorage.getItem("userId");

  const [message, setMessage] = useState(initialMessage);
  const [showLoggedIn, setShowLoggedIn] = useState(!!currentUser);

  useEffect(() => {
    // Set a timeout to clear the message after 3 seconds
    if (message) {
      const messageTimeout = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(messageTimeout); // Cleanup timeout
    }
  }, [message]);

  useEffect(() => {
    // Set a timeout to hide logged-in notification after 3 seconds
    if (showLoggedIn) {
      const loggedInTimeout = setTimeout(() => setShowLoggedIn(false), 3000);
      return () => clearTimeout(loggedInTimeout); // Cleanup timeout
    }
  }, [showLoggedIn]);

  return (
    <section>
      {message && <p className="text-warning px-5 text-center">{message}</p>}
      {showLoggedIn && (
        <h6 className="text-success text-center">
          You are logged in as {currentUser}
        </h6>
      )}
      <MainHeader />
      <section className="container">
        <RoomSearch />
        <RoomCarousel />
        <Parallax />
        <HotelService />
      </section>
    </section>
  );
};

export default Home;
