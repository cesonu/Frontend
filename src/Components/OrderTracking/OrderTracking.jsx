import React, { useState, useEffect } from "react";

const OrderTracking = ({ orderId }) => {
  const [orderStatus, setOrderStatus] = useState("");

  useEffect(() => {
    const fetchOrderStatus = async () => {
      try {
        const response = await fetch(`http://localhost:4000/orders/${orderId}/status`);
        const data = await response.json();
        setOrderStatus(data.order_status);
      } catch (error) {
        console.error("Error fetching order status:", error);
      }
    };

    fetchOrderStatus();
  }, [orderId]);

  return (
    <div>
      <h3>Order Status</h3>
      <p>{orderStatus}</p>
    </div>
  );
};

export default OrderTracking;
