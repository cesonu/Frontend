import React, { useContext, useState } from 'react';
import './FoodItem.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../Context/StoreContext';

const FoodItem = ({ _id, name, price, description, image, customizations, nutrition }) => {
  const { cartItems, addToCart } = useContext(StoreContext);

  const [quantity, setQuantity] = useState(1); // Track quantity
  const [showAddToCart, setShowAddToCart] = useState(true); // Toggle between "Add to Cart" and "+" button
  const [selectedCustomizations, setSelectedCustomizations] = useState([]); // Track selected customizations

  // Add to Cart Handler
  const handleAddToCart = async () => {
    try {
      // Add item to cart locally
      addToCart(_id, quantity);

      // Send the cart item to the backend
      const response = await fetch('https://backend-2-i0ej.onrender.com/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: localStorage.getItem('user_id'),
          food_id: _id,
          quantity,
          price,
          customizations: selectedCustomizations,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add item to cart on the server.');
      }

      // Successfully added to cart on the backend
      alert('Item added to cart!');
      setShowAddToCart(false); // Switch to quantity controls
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    }
  };

  // Handle Customization Selection
  const handleCustomizationChange = (customization) => {
    setSelectedCustomizations((prev) =>
      prev.includes(customization)
        ? prev.filter((item) => item !== customization) // Remove if already selected
        : [...prev, customization] // Add if not selected
    );
  };

  return (
    <div className="food-item">
      <div className="food-item-image-container">
        <img className="food-item-image" src={image} alt="" />
        {showAddToCart ? (
          <button className="add-to-cart-button" onClick={handleAddToCart}>
            Add to Cart
          </button>
        ) : (
          <div className="food-item-counter">
            <button
              className="quantity-button"
              onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
            >
              -
            </button>
            <span>{quantity}</span>
            <button
              className="quantity-button"
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </button>
          </div>
        )}
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="" />
        </div>
        <p className="food-item-description">{description}</p>
        <p className="food-item-price">${price}</p>

        {/* Nutrition Information */}
        {nutrition && (
          <div className="nutrition-info">
            <h4>Nutrition Information:</h4>
            <p>Calories: {nutrition.calories}</p>
            <p>Fat: {nutrition.fat}</p>
            <p>Protein: {nutrition.protein}</p>
          </div>
        )}

        {/* Customization Options */}
        {customizations && customizations.length > 0 && (
          <div className="customizations">
            <h4>Customizations:</h4>
            {customizations.map((option, index) => (
              <label key={index} className="customization-option">
                <input
                  type="checkbox"
                  value={option.name}
                  onChange={() => handleCustomizationChange(option)}
                />
                {option.name} (+${option.price})
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodItem;
