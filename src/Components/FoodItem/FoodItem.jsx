import { useContext, useState } from 'react';
import './FoodItem.css';
import { StoreContext } from '../Context/StoreContext';
import axios from 'axios';

const FoodItem = ({ _id, name, price, category, image, customizations, nutrition }) => {
  const {addToCart} = useContext(StoreContext);
  const [selectedCustomizations, setSelectedCustomizations] = useState([]);
  const [quantity, setQuantity] = useState(1);

  const handleCustomizationChange = (customization) => {
    setSelectedCustomizations((prev) =>
      prev.includes(customization)
        ? prev.filter((item) => item !== customization)
        : [...prev, customization]
    );
  };

  const [showQuantityControls, setShowQuantityControls] = useState(false);

  const handleAddToCart = async () => {
    const userId = localStorage.getItem('user_id');

    // Check if user is logged in
    if (!userId) {
      alert('Please log in to add items to cart');
      return;
    }

    try {
      // Calculate total price based on quantity
      const totalPrice = price * quantity;

      // Log the data being sent to help diagnose the issue
      console.log('Adding to cart with data:', {
        user_id: userId,
        food_id: _id,
        quantity: quantity,
        price: totalPrice,  // Use total price here
        customizations: selectedCustomizations.join(',')
      });

      // Send the cart item to the backend
      const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/cart`, {
        user_id: userId,
        food_id: _id,
        quantity: quantity,
        price: totalPrice,  // Use total price here
        customizations: selectedCustomizations.join(',')
      });

      // Add item to cart locally multiple times based on quantity
      for (let i = 0; i < quantity; i++) {
        addToCart(_id);
      }

      // Reset state after adding to cart
      setQuantity(1);
      setShowQuantityControls(false);
      setSelectedCustomizations([]);
    } catch (error) {
      // More detailed error logging
      console.error('Full error object:', error);
      console.error('Error response:', error.response);
      console.error('Error request:', error.request);
      
      // Display more informative error message
      alert(`Failed to add item to cart: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleAddToCartFlow = () => {
    if (!showQuantityControls) {
      // First click: Show quantity controls
      setShowQuantityControls(true);
    } else {
      // Second click: Add to cart
      handleAddToCart();
    }
  };

  return (
    <div className="food-item">
      <div className="food-item-image-container">
        <img className="food-item-image" src={image} alt={name} />
        
        {/* Cart Controls */}
        {!showQuantityControls ? (
          <button 
            className="add-to-cart-button" 
            onClick={handleAddToCartFlow}
          >
            Add to Cart
          </button>
        ) : (
          <div className="food-item-counter">
            <button onClick={() => setQuantity(prevQuantity => Math.max(1, prevQuantity - 1))}>-</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(prevQuantity => prevQuantity + 1)}>+</button>
            <button onClick={handleAddToCart}>Add</button>
          </div>
        )}
      </div>
      
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
        </div>
        <p className="food-item-category">
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </p>
        <p className="food-item-price">${price}</p>

        {nutrition && (
          <div className="nutrition-info">
            <h4>Nutrition Information</h4>
            <p>{nutrition}</p>
          </div>
        )}

        {customizations && customizations.length > 0 && (
          <div className="customizations">
            <h4>Customizations:</h4>
            {customizations.map((option, index) => (
              <label key={index} className="customization-option">
                <input
                  type="checkbox"
                  value={option}
                  onChange={() => handleCustomizationChange(option)}
                />
                {option}
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodItem;