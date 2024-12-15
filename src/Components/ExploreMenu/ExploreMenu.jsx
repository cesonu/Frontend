import { useState, useEffect } from 'react'
import './ExploreMenu.css'
import axios from 'axios'

const ExploreMenu = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const backendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;
        if (!backendUrl) {
          throw new Error('Backend URL is not defined');
        }

        const response = await axios.get(`${backendUrl}/categories`);
        setCategories(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories');
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return <div>Loading categories...</div>;
  if (error) return <div>{error}</div>;
  
  return (
    <div className='explore-menu' id='explore-menu'>
      <h1>Explore Our Menu</h1>
      <p className='explore-menu-text'>
        Browse through our delicious categories
      </p>
      <div className='explore-menu-list'>
        {categories.map((cat) => (
          <div 
            key={cat.category_id} 
            className='explore-menu-list-item'
          >
            <img 
              src={`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/uploads/images/categories/${cat.image_url}`}
              alt={`${cat.name} image`} 
            />
            <p>{cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}</p>
          </div>
        ))}
      </div>
      <hr />
    </div>
  )
}

export default ExploreMenu