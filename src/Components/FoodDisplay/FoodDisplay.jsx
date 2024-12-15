import { useState, useEffect } from 'react'
import './FoodDisplay.css'
import FoodItem from '../FoodItem/FoodItem'
import axios from 'axios'

const FoodDisplay = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/menu-items`);
                setMenuItems(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching menu items:', err);
                setError('Failed to load menu items');
                setLoading(false);
            }
        };

        fetchMenuItems();
    }, []);

    if (loading) return <div>Loading menu items...</div>;
    if (error) return <div>{error}</div>;

    // Get unique categories
    const categories = [...new Set(menuItems.map(item => item.category_name))];

    // Filter menu items by selected category
    const filteredMenuItems = selectedCategory 
        ? menuItems.filter(item => item.category_name === selectedCategory)
        : menuItems;

    return (
        <div className="food-display" id="food-display">
            <h2>Top Dishes near you</h2>
            
            {/* Category Filter */}
            <div className="category-filter">
                <button 
                    onClick={() => setSelectedCategory(null)}
                    className={selectedCategory === null ? 'active' : ''}
                >
                    All
                </button>
                {categories.map(category => (
                    <button 
                        key={category} 
                        onClick={() => setSelectedCategory(category)}
                        className={selectedCategory === category ? 'active' : ''}
                    >
                        {category}
                    </button>
                ))}
            </div>

            <div className="food-display-list">
                {filteredMenuItems.map((item) => (
                    <FoodItem
                        key={item.food_id}
                        _id={item.food_id}
                        name={item.name}
                        category={item.category_name}
                        price={item.price}
                        image={`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/uploads/images/menu/${item.image_url}`}
                        customizations={item.customizations ? item.customizations.split(',') : []}
                        nutrition={item.nutrition}
                    />
                ))}
            </div>
        </div>
    );
};

export default FoodDisplay