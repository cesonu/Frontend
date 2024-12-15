import './Home.css'
import Header from '../../Components/Header/Header'
import ExploreMenu from '../../Components/ExploreMenu/ExploreMenu'
import FoodDisplay from '../../Components/FoodDisplay/FoodDisplay'
import AppDownload from '../../Components/AppDownload/AppDownload'

const Home = () => {
  return (
    <div>
        <Header/>
        <ExploreMenu/>
        <FoodDisplay/>
        <AppDownload/>
    </div>
  )
}

export default Home