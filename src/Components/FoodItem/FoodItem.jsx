import React, { useContext, useState } from 'react';
import './FoodItem.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../Context/StoreContext';

const FoodItem = ({ id, name, price, description, image }) => {
  const { cartItems, addToCart } = useContext(StoreContext);

  const [quantity, setQuantity] = useState(1); // Track quantity
  const [showAddToCart, setShowAddToCart] = useState(true); // Toggle between "Add to Cart" and "+" button

  const handleAddToCart = () => {
    addToCart(id, quantity); // Add item with chosen quantity
    setShowAddToCart(false); // Switch to quantity controls
  };

  return (
    <div className="food-item">
      <div className="food-item-image-container">
        <img className="food-item-image" src={image} alt="" />
        {showAddToCart ? (
          <button
            className="add-to-cart-button"
            onClick={handleAddToCart}
          >
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
        <p className="food-item-price">${price} </p>
      </div>
    </div>
  );
};

export default FoodItem;
