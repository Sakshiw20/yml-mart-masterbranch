
import logo from './logo.svg';
import './App.css';
import 'animate.css';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import SummaryApi from './common';
import Context from './context';
import { useDispatch } from 'react-redux';
import { setUserDetails } from './store/userSlice';
import 'animate.css';

function App() {
  const dispatch = useDispatch()
  const [cartProductCount,setCartProductCount] = useState(0)
  const [totalPurchasing, setTotalPurchasing] = useState(0);

  
  const fetchUserDetails = async()=>{
      const dataResponse = await fetch(SummaryApi.current_user.url,{
        method : SummaryApi.current_user.method,
        credentials : 'include'
      })

      const dataApi = await dataResponse.json()

      if(dataApi.success){
        dispatch(setUserDetails(dataApi.data))
      }
  }

  const fetchUserAddToCart = async()=>{
    const dataResponse = await fetch(SummaryApi.addToCartProductCount.url,{
      method : SummaryApi.addToCartProductCount.method,
      credentials : 'include'
    })

    const dataApi = await dataResponse.json()

    setCartProductCount(dataApi?.data?.count)
  }




  // const fetchTotalPurchasing = async () => {
  //   const dataResponse = await fetch(SummaryApi.current_user.url, {
  //     method: SummaryApi.current_user.method,
  //     credentials: 'include',
  //   });
  
  //   const data = await dataResponse.json();
  
  //   // Check if orderDetail exists and is an array
  //   if (data && Array.isArray(data.orderDetail)) {
  //     const totalAmount = data.orderDetail
  //       .filter((order) => order.status === 'paid')
  //       .reduce(
  //         (acc, order) =>
  //           acc +
  //           order.products.reduce(
  //             (acc, product) => acc + product.price * product.quantity,
  //             0
  //           ),
  //         0
  //       );
  
  //     setTotalPurchasing(totalAmount);
  //   } else {
  //     // Handle case when orderDetail is not available or not an array
  //     setTotalPurchasing(0);
  //     console.error("Order details not available or invalid format");
  //   }
  // };
  





  useEffect(()=>{
    /**user Details */
    fetchUserDetails()
    /**user Details cart product */
    fetchUserAddToCart()
    // fetchTotalPurchasing();


  },[])
  return (
    <>
      <Context.Provider value={{
          fetchUserDetails, // user detail fetch 
          cartProductCount, // current user add to cart product count,
          fetchUserAddToCart,
          // totalPurchasing
      }}>
        <ToastContainer 
          position='top-center'
        />
        
        <Header/>
        <main className='min-h-[calc(100vh-120px)] pt-16'>
          <Outlet/>
        </main>
        <Footer/>
      </Context.Provider>
    </>
  );
}

export default App;