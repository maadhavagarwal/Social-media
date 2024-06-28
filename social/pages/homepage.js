import React from 'react'
import Navbar from '../components/Navbar/Navbar'
  // import Banner from '@/components/Banner'
import Banner from '../components/Banner'
// import Footer from '@/components/Footer/footer'
import styles from '../styles/Home.module.css';
// import "ecomerce-app/pages/CSS/home.css"
const Homepage = () => {
  return (
    <div className='container'>
      <Navbar/>
      <div className={styles.center}>
      
      <h1 className={styles.description}>Welcome to Social Media App</h1>
    </div>  
    <div className={styles.center}>
      <Banner/>
    </div>
    
    
    </div>
  )
}

export default Homepage
