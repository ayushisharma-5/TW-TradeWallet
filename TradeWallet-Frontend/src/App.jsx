import { useState } from 'react'
import {BrowserRouter as Router, Routes,Route} from 'react-router-dom';
import Login from '../src/components/login/Login.jsx'
import About from './components/about/About';
import Navbar from './components/navigation/Navbar.jsx';
import Market from './components/market/Market.jsx';
import Portfolio from './components/portfolio/Portfolio.jsx';

function App() {
  const [user, setUser] = useState({
    user: '',
    isLoggedIn: false
  });
 
  const handleLogout = (event) => {
    event.preventDefault();
    setUser(prevState => ({
      ...prevState,
      isLoggedIn: false
    }));
  };

  return (
    <>
    <Router>
      {user.isLoggedIn && <Navbar onLogout={handleLogout}/>}
      <Routes>
      <Route path="/" element={user.isLoggedIn ? <Portfolio /> : <Login setUserInParentComponent={setUser}/>}/>
        <Route path="/portfolio" element={user.isLoggedIn ? <Portfolio /> : <Login setUserInParentComponent={setUser}/>}/>
        <Route path="/market" element={user.isLoggedIn ? <Market /> : <Login setUserInParentComponent={setUser}/>}/>
        <Route path="/about" element={user.isLoggedIn ? <About /> : <Login setUserInParentComponent={setUser}/>}/>
      </Routes>
    </Router>
    </>
  )
}

export default App;
