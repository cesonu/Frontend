import React, { useContext, useState } from "react";
import "./Cart.css";
import { StoreContext } from "../../Components/Context/StoreContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cartItems, food_list, removeFromCart, getTotalCartAmount, addToCart } =
    useContext(StoreContext);
  const [promoCode, setPromoCode] = useState(""); // For promo code input
  const [discount, setDiscount] = useState(0); // To apply promo code discounts

  const navigate = useNavigate();

  // Function to apply promo code
  const handlePromoCode = () => {
    if (promoCode === "DISCOUNT10") {
      setDiscount(10); // Apply 10% discount
      alert("Promo code applied! 10% discount added.");
    } else {
      alert("Invalid promo code. Please try again.");
      setDiscount(0);
    }
  };

  const calculateTotalWithDiscount = () => {
    const subtotal = getTotalCartAmount();
    const discountedTotal = subtotal - (subtotal * discount) / 100;
    const deliveryFee = subtotal === 0 ? 0 : 4.5;
    return discountedTotal + deliveryFee;
  };

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list.map((item, index) => {
          if (cartItems[item._id] && cartItems[item._id] > 0) {
            return (
              <div key={index}>
                <div className="cart-items-title cart-items-item">
                  <img src={item.image} alt={item.name} />
                  <p>{item.name}</p>
                  <p>${item.price}</p>
                  <div className="quantity-control">
                    <button
                      onClick={() => addToCart(item._id, -1)}
                      disabled={cartItems[item._id] <= 1}
                    >
                      -
                    </button>
                    <p>{cartItems[item._id]}</p>
                    <button onClick={() => addToCart(item._id, 1)}>+</button>
                  </div>
                  <p>${item.price * cartItems[item._id]}</p>
                  <p
                    onClick={() => removeFromCart(item._id)}
                    className="cross"
                    style={{ cursor: "pointer", color: "red" }}
                  >
                    x
                  </p>
                </div>
                <hr />
              </div>
            );
          }
          return null;
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            {discount > 0 && (
              <>
                <div className="cart-total-details">
                  <p>Discount ({discount}%)</p>
                  <p>-${(getTotalCartAmount() * discount) / 100}</p>
                </div>
                <hr />
              </>
            )}
            <div className="cart-total-details">
              <p>Delivery fee</p>
              <p>${getTotalCartAmount() === 0 ? 0 : 4.5}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>${calculateTotalWithDiscount().toFixed(2)}</b>
            </div>
          </div>
          <button onClick={() => navigate("/order")}>PROCEED TO CHECKOUT</button>
        </div>
        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, enter it here.</p>
            <div className="cart-promocode-input">
              <input
                type="text"
                placeholder="Promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
              <button onClick={handlePromoCode}>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
