import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../src/components/login/Login.jsx';
import About from './components/about/About';
import Navbar from './components/navigation/Navbar.jsx';
import Market from './components/market/Market.jsx';
import Portfolio from './components/portfolio/Portfolio.jsx';
import Home from './components/home/Home.jsx'; // ✅ Import your Home component
import './App.css';

function App() {
    const [user, setUser] = useState({
        user: '',
        userId: -1,
        isLoggedIn: false,
    });

    const handleLogout = () => {
        setUser({
            user: '',
            userId: -1,
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
                            <Navigate to="/home" />  // Redirect to /home
                        ) : (
                            <Login setUserInParentComponent={setUser} />
                        )
                    }
                />
                <Route
                    path="/home"
                    element={
                        user.isLoggedIn ? <Home user={user} /> : <Navigate to="/" />
                    }
                />
                <Route
                    path="/portfolio"
                    element={
                        user.isLoggedIn ? <Portfolio user={user} /> : <Navigate to="/" />
                    }
                />
                <Route
                    path="/market"
                    element={
                        user.isLoggedIn ? <Market user={user} /> : <Navigate to="/" />
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