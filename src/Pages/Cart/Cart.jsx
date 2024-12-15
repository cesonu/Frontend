import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './Cart.css';
import { StoreContext } from '../../Components/Context/StoreContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { cartItems: contextCartItems, setCartItems: setContextCartItems } = useContext(StoreContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const userId = localStorage.getItem('user_id');
        
        if (!userId) {
          // When not logged in, set empty cart but continue rendering
          setCartItems([]);
          setTotalAmount(0);
          setLoading(false);
          return;
        }

        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/cart/${userId}`);
        
        setCartItems(response.data);
        
        // Calculate total amount
        const total = response.data.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
        setTotalAmount(total);
        
        // Update context cart items
        const formattedCartItems = response.data.reduce((acc, item) => {
          acc[item.food_id] = item.quantity;
          return acc;
        }, {});
        setContextCartItems(formattedCartItems);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching cart items:', error);
        setError('Failed to load cart items');
        setLoading(false);
        setCartItems([]);
        setTotalAmount(0);
      }
    };

    fetchCartItems();
  }, [localStorage.getItem('user_id')]);

  const handleRemoveItem = async (cartId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/cart/${cartId}`);
      
      // Refresh cart items after removal
      const userId = localStorage.getItem('user_id');
      const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/cart/${userId}`);
      
      setCartItems(response.data);
      
      // Recalculate total amount
      const total = response.data.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
      setTotalAmount(total);

      // Update context cart items
      const formattedCartItems = response.data.reduce((acc, item) => {
        acc[item.food_id] = item.quantity;
        return acc;
      }, {});
      setContextCartItems(formattedCartItems);
    } catch (error) {
      console.error('Error removing cart item:', error);
      alert('Failed to remove item from cart');
    }
  };

  if (loading) {
    return <div>Loading cart...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Image</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {cartItems.length === 0 ? (
          <div className="empty-cart-message">
            {!localStorage.getItem('user_id') ? (
              <div>
                <p>Please log in to view your cart items.</p>
              </div>
            ) : (
              <p>Your cart is empty</p>
            )}
          </div>
        ) : (
          cartItems.map((item) => (
            <div key={item.cart_id} className="cart-items-item">
              <img src={`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/uploads/images/menu/${item.image_url}`} alt={item.name} style={{ width: '100px', height: '50px' }}/>
              <p>{item.name}</p>
              <p>${parseFloat(item.price).toFixed(2)}</p>
              <p>{item.quantity}</p>
              <p>${(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
              <button onClick={() => handleRemoveItem(item.cart_id)}>x</button>
            </div>
          ))
        )}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${totalAmount.toFixed(2)}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>$2.00</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>${(totalAmount + 2).toFixed(2)}</b>
            </div>
          </div>
          <button disabled={cartItems.length === 0}>PROCEED TO CHECKOUT</button>
        </div>
        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, Enter it here</p>
            <div className="cart-promocode-input">
              <input type="text" placeholder="promo code" />
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;