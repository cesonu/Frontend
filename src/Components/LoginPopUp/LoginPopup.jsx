import { useState, useContext } from 'react';
import axios from 'axios';
import './LoginPopup.css';
import { StoreContext } from '../Context/StoreContext';

const LoginPopup = ({ setShowLogin, setUser }) => {
  const [currState, setCurrState] = useState("Login");
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const { setCartItems } = useContext(StoreContext);

  const fetchCartItems = async (userId) => {
    try {
      const backendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;
      if (!backendUrl) {
        throw new Error('Backend URL is not defined');
      }

      const response = await axios.get(`${backendUrl}/cart/${userId}`);
      
      // Format cart items for context
      const formattedCartItems = response.data.reduce((acc, item) => {
        acc[item.food_id] = item.quantity;
        return acc;
      }, {});
      
      setCartItems(formattedCartItems);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      throw error;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const backendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;
      if (!backendUrl) {
        throw new Error('Backend URL is not defined in environment variables');
      }

      let response;
      if (currState === "Login") {
        // Login endpoint
        response = await axios.post(`${backendUrl}/login`, {
          email: formData.email,
          password: formData.password
        });
      } else {
        // Signup endpoint
        response = await axios.post(`${backendUrl}/signup`, {
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
      }
      
      // Validate response data
      if (!response.data || !response.data.user || !response.data.user_id) {
        throw new Error('Invalid authentication response');
      }
      
      // Handle successful login/signup
      const userData = response.data.user;
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Store user_id separately for cart functionality
      localStorage.setItem('user_id', response.data.user_id);
      
      setUser(userData);
      
      // Fetch and update cart items
      await fetchCartItems(response.data.user_id);
      
      setShowLogin(false);
    } catch (error) {
      // Detailed error logging
      console.error('Full authentication error:', error);
      
      // More specific error handling
      if (error.response) {
        // The request was made and the server responded with a status code
        console.error('Server responded with error:', error.response.data);
        console.error('Status code:', error.response.status);
        
        // Use server-provided error message if available
        const errorMessage = error.response.data?.message || 
                             error.response.data?.error || 
                             'Authentication failed';
        
        alert(errorMessage);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        alert('No response from server. Please check your network connection.');
      } else {
        // Something happened in setting up the request
        console.error('Error setting up request:', error.message);
        alert(error.message || 'An unexpected error occurred during authentication.');
      }
    }
  };

  return (
    <div className="login-popup">
      <form onSubmit={handleSubmit} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <div onClick={() => setShowLogin(false)} className="close-icon">×</div>
        </div>
        
        <div className="login-popup-inputs">
          {currState === "Signup" && (
            <input 
              type="text" 
              name="name" 
              placeholder="Name" 
              value={formData.name}
              onChange={handleChange}
              required 
            />
          )}
          
          <input 
            type="email" 
            name="email" 
            placeholder="Email" 
            value={formData.email}
            onChange={handleChange}
            required 
          />
          
          <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            value={formData.password}
            onChange={handleChange}
            required 
          />
        </div>
        
        <button type="submit">
          {currState === "Login" ? "Login" : "Create Account"}
        </button>
        
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, I agree to the terms of use & privacy policy</p>
        </div>
        
        {currState === "Login" ? (
          <p>
            Create a new account? 
            <span onClick={() => setCurrState("Signup")}>Click here</span>
          </p>
        ) : (
          <p>
            Already have an account? 
            <span onClick={() => setCurrState("Login")}>Login here</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;