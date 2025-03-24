import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../src/components/login/Login.jsx';
import About from './components/about/About';
import Navbar from './components/navigation/Navbar.jsx';
import Market from './components/market/Market.jsx';
import Portfolio from './components/portfolio/Portfolio.jsx';
import './App.css';

function App() {
    const [user, setUser] = useState({
        user: '',
        isLoggedIn: false,
    });

    const handleLogout = () => {
        setUser({
            user: '',
            isLoggedIn: false,
        });
    };

    return (
        <Router>
            {user.isLoggedIn && <Navbar handleLogout={handleLogout} />}
            <Routes>
                <Route
                    path="/"
                    element={
                        user.isLoggedIn ? (
                            <Navigate to="/portfolio" />
                        ) : (
                            <Login setUserInParentComponent={setUser} />
                        )
                    }
                />
                <Route
                    path="/portfolio"
                    element={
                        user.isLoggedIn ? <Portfolio /> : <Navigate to="/" />
                    }
                />
                <Route
                    path="/market"
                    element={
                        user.isLoggedIn ? <Market /> : <Navigate to="/" />
                    }
                />
                <Route
                    path="/about"
                    element={
                        user.isLoggedIn ? <About /> : <Navigate to="/" />
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;