import React, { useContext } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../Context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'

const FoodDisplay = () => {

    const {food_list} = useContext(StoreContext)


  return (
    <div className="food-display" id="food-display">
      <h2>Top Dishes near you</h2>
      <div className="food-display-list">
        {food_list.map((item) => (
          <FoodItem
            key={item._id}
            _id={item._id}
            name={item.name}
            description={item.description}
            price={item.price}
            image={item.image_url}
            customizations={item.customizations}
            nutrition={item.nutrition}
          />
        ))}
      </div>
    </div>
  );
};

export default FoodDisplay