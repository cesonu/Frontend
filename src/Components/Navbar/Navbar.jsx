import { useState } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ setShowLogin, user, handleLogout }) => {
  const [menu, setMenu] = useState("Home"); 
  const navigate = useNavigate();

  const handleSignInClick = () => {
    if (user) {
      navigate('/profile');
    } else {
      setShowLogin(true);
    }
  };

  return (
    <div className="navbar">
      <Link to="/">
        <img src={assets.logo} alt="logo" className="logo" />
      </Link>
      <ul className="navbar-menu">
        <Link 
          to="/" 
          onClick={() => setMenu("Home")} 
          className={menu === "Home" ? "active" : ""}
        >
          Home
        </Link>
        <Link 
          to="/cart" 
          onClick={() => setMenu("Cart")} 
          className={menu === "Cart" ? "active" : ""}
        >
          Cart
        </Link>
        <Link 
          to="/order" 
          onClick={() => setMenu("Order")} 
          className={menu === "Order" ? "active" : ""}
        >
          Order
        </Link>
      </ul>
      <div className="navbar-right">
        {user ? (
          <div className="user-section">
            <button onClick={handleSignInClick} className="profile-btn">
              Profile
            </button>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        ) : (
          <button onClick={handleSignInClick} className="sign-in-btn">
            Sign In
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;