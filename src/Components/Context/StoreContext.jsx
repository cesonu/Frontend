import { createContext, useState, useEffect } from "react";
import { food_list } from "../../assets/assets";

export const StoreContext = createContext(null);
 
const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [food_list, setFoodList]= useState([]);
  const [user_id] = useState(localStorage.getItem("user_id"));

  useEffect(() => {
    const fetchFoodList = async () => {
      try {
        const response = await fetch("https://backend-2-i0ej.onrender.com/menu-items");
        const data = await response.json();
        setFoodList(data);
      } catch (error) {
        console.error("Error fetching food list:", error);
      }
    };

    fetchFoodList();
  }, []);

  const addToCart = (itemId, quantity = 1) => {
    setCartItems((prev) => {
      const updatedCart = { ...prev };
      updatedCart[itemId] = (updatedCart[itemId] || 0) + quantity;
      console.log("Updated Cart Items:", updatedCart); // Log cart items
      return updatedCart;
    });
  };
  

  const removeFromCart = (itemId) => {
    setCartItems((prev) => {
      const updatedCart = { ...prev };
      if (updatedCart[itemId] > 1) {
        updatedCart[itemId] -= 1;
      } else {
        delete updatedCart[itemId];
      }
      console.log("Cart after removal:", updatedCart);
      return updatedCart;
    });
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const itemInfo = food_list.find((product) => product._id === String(item));
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[item];
        }
      }
    }
    return totalAmount;
  };

  const fetchCartItems = async () => {
    try {
      const response = await fetch(`https://backend-2-i0ej.onrender.com/cart/${user_id}`);
      const data = await response.json();
  
      // Check if the data matches the expected structure
      const formattedCartItems = data.reduce((acc, item) => {
        acc[item.food_id] = item.quantity;
        return acc;
      }, {});
  
      setCartItems(formattedCartItems);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };
   

  const placeOrder = async () => {
    try {
      const total_price = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const response = await fetch(`https://backend-2-i0ej.onrender.com/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id,
          total_price,
          items: cartItems,
        }),
      });

      if (response.ok) {
        alert("Order placed successfully!");
        setCartItems([]); // Clear the cart
      } else {
        console.error("Error placing order:", await response.json());
      }
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount, 
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
