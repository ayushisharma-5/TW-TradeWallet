import '../../styles/Navbar.css';
import logo from '../../assets/kiwi-logo.png';
import { Link } from 'react-router-dom';

const Navbar = ({ handleLogout }) => {
  return (<>
        <nav className="navbar">
            <div className="navbar-left">
                <img src={logo} alt="App Logo" className="navbar-logo" />
            </div>
            <div className="navbar-center">
                <Link to="/portfolio" className="navbar-link">Portfolio</Link>
                <Link to="/market" className="navbar-link">Market</Link>
                <Link to="/about" className="navbar-link">About</Link>
            </div>
            <div className="navbar-right">
                <button onClick={() => handleLogout()} className="navbar-button">Logout</button>
            </div>
        </nav></>);
}

export default Navbar;