import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import ThermoHubMark from './shared/ThermoHubMark';

const Layout = () => {
  return (
    <div className="app-container">
      <Navbar />
      <main className="content">
        <Outlet />
      </main>
      <footer className="footer">
        <div className="footer-logo">
          <ThermoHubMark className="footer-icon brand-mark" />
          <span className="footer-logo-text">ThermoHub</span>
        </div>
        <p className="footer-copy">(c) 2026 Prof. Ing. Andrea Viola - Progetto ad uso didattico.</p>
      </footer>
    </div>
  );
};

export default Layout;
