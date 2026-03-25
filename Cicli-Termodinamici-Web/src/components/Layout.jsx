import React from 'react';
import { Outlet } from 'react-router-dom';
import { Wind } from 'lucide-react';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className="app-container">
      <Navbar />
      <main className="content">
        <Outlet />
      </main>
      <footer className="footer">
        <div className="footer-logo">
          <Wind size={18} className="footer-icon" style={{ color: '#38BDF8' }} />
          <span className="footer-logo-text">ThermoHub</span>
        </div>
        <p className="footer-copy">(c) 2026 Prof. Ing. Andrea Viola - Progetto ad uso didattico.</p>
      </footer>
    </div>
  );
};

export default Layout;
