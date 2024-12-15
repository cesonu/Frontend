import { useState, useEffect, useContext } from 'react'
import Navbar from './Components/Navbar/Navbar'
import { Route, Routes, useNavigate } from 'react-router-dom'
import Home from './Pages/Home/Home'
import Cart from './Pages/Cart/Cart'
import Placeorder from './Pages/PlaceOrder/Placeorder'
import Footer from './Components/Footer/Footer'
import LoginPopup from './Components/LoginPopUp/LoginPopup'
import Profile from './Pages/Profile/Profile'
import { StoreContext } from './Components/Context/StoreContext'

const App = () => {
  const [showLogin, setShowLogin] = useState(false)
  const [user, setUser] = useState(null)
  const { clearCart } = useContext(StoreContext)
  const navigate = useNavigate()

  useEffect(() => {
    // Check for existing user in localStorage on component mount
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const handleLogout = () => {
    // Clear user from localStorage and state
    localStorage.removeItem('user')
    localStorage.removeItem('user_id')
    setUser(null)
    clearCart() // Clear the cart when logging out
    navigate('/') // Redirect to home page
  }

  const navigateToCart = () => {
    navigate('/cart')
  }

  return (
  <>
  {showLogin && !user ? 
    <LoginPopup 
      setShowLogin={setShowLogin} 
      setUser={setUser}
      navigateToCart={navigateToCart}
    /> : 
    <></>
  }
    <div className='app'>
      <Navbar 
        setShowLogin={setShowLogin} 
        user={user} 
        handleLogout={handleLogout} 
      />
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/cart' element={<Cart/>} />
        <Route path='order' element={<Placeorder/>} />
        <Route path='/profile' element={<Profile user={user} />} />
      </Routes>
    </div>
    <Footer />
  </>  
  );
};

export default App;