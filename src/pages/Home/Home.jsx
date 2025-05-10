import { Helmet } from 'react-helmet-async'
import Plants from '../../components/Home/Plants'

const Home = () => {
  return (
    <div>
      <Helmet>
        <title> PlantNet | Buy Your Desired Plant</title>
      </Helmet>
      {/* <div className='pt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'>

      </div> */}
      <Plants />
    </div>
  )
}

export default Home
