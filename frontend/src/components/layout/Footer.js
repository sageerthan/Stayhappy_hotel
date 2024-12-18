import React from "react";

const Footer = () => {
  let today = new Date();
  return (
    <footer className="bg-dark text-light py-3 footer fixed-bottom">
      <div className="text-center">
        <p className="mb-0">&copy; {today.getFullYear()} Stayhappy Hotel</p>
      </div>
    </footer>
  );
};

export default Footer;