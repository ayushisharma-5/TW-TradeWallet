import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/navbar.css';
import logo from '../../assets/kiwi-logo.jpg';

const Navbar = ({ handleLogout }) => {
    return (
        <>
            <nav className="navbar">
                <div className="navbar-left">
                    <img src={logo} alt="TradeWallet Logo" className="navbar-logo" style={{ width: '30px', height: '30px', marginRight: '0.5rem' }} />
                    <span className="navbar-brand">TradeWallet</span>
                </div>
                <div className="navbar-center">
                    <Link to="/home" className="navbar-link">Home</Link>
                    <Link to="/portfolio" className="navbar-link">Portfolio</Link>
                    <Link to="/market" className="navbar-link">Market</Link>
                    <Link to="/about" className="navbar-link">About</Link>
                </div>
                <div className="navbar-right">
                    <button onClick={handleLogout} className="navbar-button">Logout</button>
                </div>
            </nav>
        </>
    );
};

export default Navbar;