import React, { useState } from 'react'
import Navbar from './Components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './Pages/Home/Home'
import Cart from './Pages/Cart/Cart'
import Placeorder from './Pages/PlaceOrder/Placeorder'
import Footer from './Components/Footer/Footer'
import LoginPopup from './Components/LoginPopUp/LoginPopup'
import Profile from './Pages/Profile/Profile'

const App = () => {

  const [showLogin,setShowLogin] = useState(false)
  return (
  <>
  {showLogin?<LoginPopup setShowLogin={setShowLogin} />:<></>}
    <div className='app'>
      <Navbar setShowLogin={setShowLogin} />
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/cart' element={<Cart/>} />
        <Route path='order' element={<Placeorder/>} />
        <Route path='/profile' element={<Profile />} />
      </Routes>
    </div>
    <Footer />
  </>  
  );
};

export default App