import React, { useState, useEffect } from "react";

const LoyaltyProgram = ({ userId }) => {
  const [points, setPoints] = useState(0);
  const [redeemPoints, setRedeemPoints] = useState(0);

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const response = await fetch(`http://localhost:4000/users/${userId}`);
        const data = await response.json();
        setPoints(data.loyalty_points);
      } catch (error) {
        console.error("Error fetching loyalty points:", error);
      }
    };

    fetchPoints();
  }, [userId]);

  const handleRedeem = async () => {
    try {
      const response = await fetch(`http://localhost:4000/users/${userId}/redeem`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ points: redeemPoints }),
      });
      if (response.ok) {
        alert("Points redeemed successfully!");
        setPoints(points - redeemPoints);
      } else {
        alert("Failed to redeem points.");
      }
    } catch (error) {
      console.error("Error redeeming points:", error);
    }
  };

  return (
    <div>
      <h3>Loyalty Points</h3>
      <p>Available Points: {points}</p>
      <input
        type="number"
        value={redeemPoints}
        onChange={(e) => setRedeemPoints(parseInt(e.target.value))}
        placeholder="Enter points to redeem"
      />
      <button onClick={handleRedeem}>Redeem Points</button>
    </div>
  );
};

export default LoyaltyProgram;
