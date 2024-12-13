import React, { useState } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';

const LoginPopup = ({ setShowLogin }) => {
  const [currentState, setCurrentState] = useState('Login');
  const [buttonText, setButtonText] = useState('Login'); // For logout functionality
  const [user, setUser] = useState(null); // Track logged-in user

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const name = formData.get('name') || ''; // Optional for login

    try {
      if (currentState === 'Sign Up') {
        const response = await fetch('https://backend-2-i0ej.onrender.com/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          alert(data.message);
        } else {
          alert(data.message || 'Error during sign-up');
        }
      } else if (currentState === 'Login') {
        const response = await fetch('https://backend-2-i0ej.onrender.com/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          // Store user data in localStorage
          localStorage.setItem('user_id', data.user.user_id);
          localStorage.setItem('name', data.user.name);

          // Update button text and user state
          setUser(data.user);
          setButtonText('Logout');
          alert(data.message);
        } else {
          alert(data.message || 'Error during login');
        }
      }
    } catch (error) {
      console.error('Error:', error.message);
      alert('Something went wrong. Please try again.');
    }
  };

  const handleLogout = () => {
    // Clear localStorage and reset user state
    localStorage.removeItem('user_id');
    localStorage.removeItem('name');
    setUser(null);
    setButtonText('Login');
    alert('Logged out successfully.');
  };

  return (
    <div className="login-popup">
      <form
        className="login-popup-container"
        onSubmit={(e) => {
          if (buttonText === 'Logout') {
            handleLogout();
            e.preventDefault(); // Prevent form submission when logging out
          } else {
            handleSubmit(e);
          }
        }}
      >
        <div className="login-popup-title">
          <h2>{currentState}</h2>
          <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
        </div>
        <div className="login-popup-inputs">
          {currentState === 'Login' ? null : (
            <input type="text" name="name" placeholder="Your Name" required />
          )}
          <input type="email" name="email" placeholder="Your email" required />
          <input type="password" name="password" placeholder="Password" required />
        </div>
        <button>{buttonText}</button>
        {buttonText !== 'Logout' && (
          <div className="login-popup-condition">
            <input type="checkbox" required />
            <p>By continuing, I agree to the terms of use & privacy policy.</p>
          </div>
        )}
        {buttonText !== 'Logout' && (
          <p>
            {currentState === 'Login' ? (
              <>
                Create a new account?{' '}
                <span onClick={() => setCurrentState('Sign Up')}>Click here</span>
              </>
            ) : (
              <>
                Already have an account? <span onClick={() => setCurrentState('Login')}>Login here</span>
              </>
            )}
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;
