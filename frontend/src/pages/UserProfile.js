import React, { useState, useEffect,useContext } from "react";
import { MdLocationOff } from "react-icons/md";
import { FaTimes, FaBars } from "react-icons/fa";
import { BsBagXFill } from "react-icons/bs";
import { CgTrack } from "react-icons/cg";
import ProfileIcons from '../assest/loginProfile1.png'

import { useSelector } from "react-redux";
import { MdModeEditOutline } from "react-icons/md";
import { FaRegCircleUser } from "react-icons/fa6";
import SummaryApi from "../common/index";
import { toast } from "react-toastify";
import AddressForm from "../components/AddressForm";
import { uploadAddress } from "../helpers/uploadAddress";
import Context from "../context/index";
import { FaTruck, FaBox, FaTimesCircle, FaCheckCircle, FaHourglassHalf, FaMotorcycle } from "react-icons/fa";import { MdLocalShipping, MdCancel } from "react-icons/md";
// import { BsBagXFill } from "react-icons/bs";
import { RiShoppingCartFill } from "react-icons/ri"; 
import { FaStar } from 'react-icons/fa';
import { MdDelete } from "react-icons/md";
import { IoIosAddCircle } from "react-icons/io";







const Profile = () => {
  const [activeSection, setActiveSection] = useState("Profile Information");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  
  // const profilePicUrl = userData?.profilePic ? `${backendDomain}/${userData.profilePic}` : 'defaultProfilePicUrl';


  const StarRating = ({ itemId, initialRating, onSave }) => {
    const [rating, setRating] = useState(initialRating || 0);
  
    const handleClick = (newRating) => {
      setRating(newRating);
      onSave(itemId, newRating); // Trigger the save callback
    };
  
    return (
      <div className="flex items-center space-x-1"> {/* Flex container to align stars horizontally */}
        {[...Array(5)].map((_, index) => (
          <FaStar
            key={index}
            className={`cursor-pointer ${index < rating ? 'text-yellow-500' : 'text-gray-300'}`}
            onClick={() => handleClick(index + 1)}
          />
        ))}
      </div>
    );
  };
  
  
  const [ratedItems, setRatedItems] = useState({});

  // Fetch rated items from localStorage on initial load
  useEffect(() => {
    const savedRatings = localStorage.getItem('ratedItems');
    if (savedRatings) {
      setRatedItems(JSON.parse(savedRatings));
    }
  }, []);

  const handleSaveRating = async (itemId, rating) => {
    try {
       const response = await fetch(SummaryApi.saveRating.url, {
         method: SummaryApi.saveRating.method,
         headers: {
           "Content-Type": "application/json",
         },
         body: JSON.stringify({ itemId, rating }),
       });
       if (!response.ok) {
         throw new Error('Failed to save rating');
       }
 
       const result = await response.json();
       if (result.success) {
         const updatedRatedItems = { ...ratedItems, [itemId]: true };
         setRatedItems(updatedRatedItems);
         localStorage.setItem('ratedItems', JSON.stringify(updatedRatedItems)); // Save to localStorage
         toast.success('Thanks for rating!', {
           position: 'top-right',
           autoClose: 3000,
           theme: 'colored',
         });
       } else {
         throw new Error(result.message || 'Failed to save rating');
       }
     } catch (error) {
       console.error('Error saving rating:', error);
       toast.error('Error saving rating. Please try again.');
     }
   };
 

  const handleAddNewAddress = () => {
    setShowAddressForm((prevState) => !prevState);
    if (!showAddressForm) {
      setAddress({ name:"", mobileNo : "",street: "", city: "", state: "", zip: "" });
    }
  };
  

  const [address, setAddress] = useState({
    name:"", 
    mobileNo : "",
    street: "",
    city: "",
    state: "",
    zip: "",
  });

  const resetTotalPurchasing = () => {
    //setTotalPurchasing(0);
    console.log("Total purchasing reset to 0");
  };

  


  const getTimeUntilNextFirst = () => {
    const now = new Date();
    const nextMonth = now.getMonth() + 1;
    const nextYear = nextMonth > 11 ? now.getFullYear() + 1 : now.getFullYear();
    const firstOfNextMonth = new Date(nextYear, nextMonth % 12, 1, 0, 0, 0);
    return firstOfNextMonth - now;
  };


  useEffect(() => {
    // Function to handle the monthly reset
    const handleMonthlyReset = () => {
      const now = new Date();
      const currentMonthYear = `${now.getFullYear()}-${now.getMonth() + 1}`; // 1-indexed month

      // Retrieve the last reset month from localStorage
      const lastResetMonth = localStorage.getItem('lastResetMonth');

      if (lastResetMonth !== currentMonthYear) {
        if (now.getDate() === 1) {
          resetTotalPurchasing();
          localStorage.setItem('lastResetMonth', currentMonthYear);
        }
      }
    };

    // Perform the initial check on component mount
    handleMonthlyReset();

    // Schedule the next reset
    const scheduleNextReset = () => {
      const delay = getTimeUntilNextFirst();
      setTimeout(() => {
        resetTotalPurchasing();
        const now = new Date();
        const currentMonthYear = `${now.getFullYear()}-${now.getMonth() + 1}`;
        localStorage.setItem('lastResetMonth', currentMonthYear);
        // Schedule the subsequent reset
        scheduleNextReset();
      }, delay);
    };

    scheduleNextReset();

    // Cleanup function to clear timeout when component unmounts
    return () => {
      // If you store the timeout ID, you can clear it here
      // Example:
      // clearTimeout(timer);
    };
  }, []);



  const handleSubmit = async (e) => {
    e.preventDefault();
    await uploadAddress(address, setUserData);
    setShowAddressForm(false);
  };


  useEffect(() => {
    const fetchUserData = async (authToken) => {
      try {
        const response = await fetch(SummaryApi.current_user.url,{
          method : SummaryApi.current_user.method,
          credentials: "include",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`, 
        },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log(data)
        setUserData(data.data);
        console.log(data.data)
        
        

        setOrderData(data.orderDetail);
        console.log(orderData[0].deliveryStatus)
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchUserData();
  }, []);

  const deleteAddress = async (id, userId,authToken) => {
    try {
      const response = await fetch(SummaryApi.deleteAddress.url, {
        method: SummaryApi.deleteAddress.method,
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`, 
      },
        body: JSON.stringify({
          AddressId: id,
          userId: userId,
        }),
      });
  
      const responseData = await response.json();
      if (responseData.success) {
        // Ensure `address` field is correctly updated in the state
        setUserData((prevData) => ({
          ...prevData,
          address: responseData.data?.address || [], // Ensure address is always an array
        }));
        alert("Address deleted successfully");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to delete address");
    }
  };
  

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

    // Function to return the appropriate icon for each delivery status
    const getStatusIcon = (status) => {
      
      switch (status.toLowerCase()) {
        case "ordered":
          return <RiShoppingCartFill className="text-yellow-600" />;
        case "shipped":
          return <FaTruck className="text-blue-600" />;
        case "in-transit":
          return <MdLocalShipping className="text-orange-500" />;
        case "delivered":
          return <FaCheckCircle className="text-green-600" />;
        case "cancelled":
          return <FaTimesCircle className="text-red-600" />;
        case "processing":
          return <FaHourglassHalf className="text-purple-600" />;  // Add a processing icon
          case "out of delivery": // Make sure it's lowercase
          return <FaMotorcycle className="text-indigo-600" />;  // Add out-for-delivery icon
        default:
          return <FaBox className="text-gray-500" />;

      }
    };
  
  const renderContent = () => {
    switch (activeSection) {
      case "Profile Information":
        return (
          <div>
            <div className="flex  justify-between">
              <h1 className="text-2xl font-bold mb-4">Profile Information</h1>
              {/* <h3>Your total purchasing:₹{totalPurchasing} </h3> */}
            </div>
            <div className="flex flex-col items-center mb-6">
              <div className="relative inline-block">

                  <img
                    src={ProfileIcons}
                    alt="Profile"
                    className="w-24 h-24 rounded-full mb-2"
                  />
                
                {/* <MdModeEditOutline className="bg-sky-600 text-white rounded-full p-1 text-3xl absolute bottom-3 right-5 transform translate-x-1/2 translate-y-1/2" /> */}
              </div>

              <h2 className="text-xl font-semibold">
                {userData?.name.toUpperCase()}
              </h2>
              {/* <h2>{orderData.signature}</h2> */}
            </div>
            <form className="space-y-4">
              <div className="flex flex-col">
                <label htmlFor="first-name" className="font-semibold mb-1">
                  Name
                </label>
                <input
                  id="first-name"
                  value={`${userData?.name}`}
                  className="border border-gray-300 p-2 rounded"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="phone" className="font-semibold mb-1">
                  Phone Number
                </label>
                <input
                  id="mobileNo"
                  value={`${userData?.mobileNo}`}
                  className="border border-gray-300 p-2 rounded"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="email" className="font-semibold mb-1">
                  Email
                </label>
                <input
                  id="email"
                  value={`${userData?.email}`}
                  className="border border-gray-300 p-2 rounded"
                />
              </div>
              <button
                type="submit"
                className="bg-sky-600 text-white py-2 px-4 rounded mt-4 w-full"
              >
                Edit
              </button>
            </form>
          </div>
        );
      case "My Orders":
        return (
          <div>
      <h1 className="text-2xl font-bold mb-4">Your Orders</h1>

      {orderData ? (
        <div className="w-full max-w-3xl">
          {orderData.length > 0 ? (
            <div>
              <h2 className="text-xl font-semibold mb-4">Order Details</h2>
              {orderData.map((order) => (
                <div key={order._id} className="mb-6 relative">
                  <div className="order-container p-6 border border-gray-300 rounded-lg bg-white shadow-lg relative">
                    {order.products.map((product) => (
                      <div
                        key={product._id}
                        className="w-full h-32 my-3 p-3 border border-gray-200 rounded-lg flex items-center bg-sky-50 shadow-sm"
                      >
                        <div className="h-24 w-24 overflow-hidden rounded-lg shadow-md">
                          <img
                            src={product.image[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="ml-4 flex flex-col justify-between">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {product.name}
                          </h3>
                          <h4 className="text-sm text-gray-600">
                            {product.category}
                          </h4>
                          <p className="text-sm text-gray-700">
                            <strong>Quantity:</strong> {product.quantity}
                          </p>
                          <p className="text-sm text-gray-700">
                            <strong>Total Cost:</strong>{" "}
                            <span className="font-bold text-gray-800">
                              {"₹" + product.price * product.quantity}
                            </span>
                          </p>
                          <p className="text-sm flex items-center">
                            <strong>Status:</strong>{" "}
                            <span className="text-green-700 font-semibold flex items-center">
                              {/* {getStatusIcon(order.status)}{" "} */}
                              <span className="ml-2">{order.status}</span>
                            </span>
                          </p>
                        </div>
                      </div>
                    ))}

                    {/* Order ID and Tracking Status */}
                    <div className="absolute bottom-0 right-0 p-4 bg-white rounded-lg shadow-lg">
                      <p className="text-sm text-blue-600 font-semibold flex items-center">
                        {getStatusIcon(order.deliveryStatus)}
                        <span className="ml-2">Tracking Status: {order.deliveryStatus}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <BsBagXFill style={{ fontSize: "6rem" }} className="text-sky-600 text-6xl mb-2" />
              <p>No orders found!</p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <BsBagXFill style={{ fontSize: "6rem" }} className="text-sky-600 text-6xl mb-2" />
          <p>No order found!</p>
        </div>
      )}
    </div>
        );
        case "Address":
        return (
          <div>
            <h1 className="text-2xl font-bold mb-4">Address</h1>

            <div className="flex items-center mt-4">
        <IoIosAddCircle className="text-sky-500 text-xl" />
        <button
          className="ml-2 text-blue-500 hover:text-blue-700"
          onClick={handleAddNewAddress}
        >
          {showAddressForm ? "Cancel" : "Add New Address"}
        </button>
      </div>           
      {showAddressForm && (
        <form className="grid gap-4 mt-4" onSubmit={handleSubmit}>
          <AddressForm address={address} setAddress={setAddress} />
          <button className="bg-green-600 text-white py-2 px-4 rounded-lg w-[300px]">
            Add New Address
          </button>
        </form>
      )} 
<div className="mt-6 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {userData?.address?.length > 0 ? (
    userData.address.map((addr, index) => (
      <div
        key={index}
        className="relative p-6 bg-white shadow-md rounded-lg border border-gray-300 mb-4"
      >
        <div className="flex justify-between">
          <strong className="text-gray-800">{addr.name}</strong>
          <div
            className="absolute top-2 right-2 text-red-500 cursor-pointer p-2 hover:text-white hover:bg-red-600 hover:rounded-full"
            onClick={() => deleteAddress(addr._id, userData._id)}
          >
            <MdDelete fontSize={18} />
          </div>
        </div>

        <p className="text-gray-800 mt-4">
          <span>{addr.mobileNo}</span>
        </p>
        <p className="text-gray-700 mt-2">
          {addr.street}, {addr.city}, <br />
          {addr.state} - <strong>{addr.zip}</strong>
        </p>
      </div>
    ))
) : (
  <div className="flex justify-center items-center p-2">
    <p className="text-red-500 text-md p">No addresses provided.</p>
  </div>
)}

</div>
</div>
        );

         // Inside renderContent function
       case "Delivered":
        return (
          <div>
            <h1 className="text-2xl font-bold mb-4">Delivered Items</h1>
            {orderData ? (
              <div className="w-full max-w-3xl">
                {orderData.filter((order) => order.deliveryStatus.toLowerCase() === "delivered").length > 0 ? (
                  orderData
                    .filter((order) => order.deliveryStatus.toLowerCase() === "delivered")
                    .map((order) => (
                      <div key={order._id} className="mb-6 relative">
                        <div className="order-container p-6 border border-gray-300 rounded-lg bg-white shadow-lg relative">
                          {order.products.map((product) => (
                            <div
                              key={product._id}
                              className="w-full h-32 my-3 p-3 border border-gray-200 rounded-lg flex items-center bg-sky-50 shadow-sm relative"
                            >
                              <div className="h-24 w-24 overflow-hidden rounded-lg shadow-md">
                                <img
                                  src={product.image[0]}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="ml-4 flex flex-col justify-between flex-1">
                                <h3 className="text-lg font-semibold text-gray-800">
                                  {product.name}
                                </h3>
                                <p className="text-sm text-gray-700">
                                  <strong>Total Cost:</strong>{" "}
                                  <span className="font-bold text-gray-800">
                                    {"₹" + product.price * product.quantity}
                                  </span>
                                </p>
                                <p className="text-sm text-gray-700">
                                  <strong>Delivered On:</strong>{" "}
                                  {new Date(order.deliveredDate).toLocaleString("en-US", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                              </div>
                              {/* Star Rating Section */}
                              <div className="absolute top-0 right-0 mt-4 mr-4">
                                <div className="flex items-center space-x-1">
                                  <span className="text-sm text-gray-700 mr-2">Your Rating:</span>
                                  {!ratedItems[product._id] ? (
                                    <StarRating
                                      itemId={product._id}
                                      initialRating={product.rating}
                                      onSave={handleSaveRating}
                                    />
                                  ) : (
                                    <div className="text-green-500">Thanks for rating!</div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="flex flex-col items-center">
                    <BsBagXFill style={{ fontSize: "6rem" }} className="text-sky-600 text-6xl mb-2" />
                    <p>No delivered items found!</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <BsBagXFill style={{ fontSize: "6rem" }} className="text-sky-600 text-6xl mb-2" />
                <p>No delivered items found!</p>
              </div>
            )}
          </div>
        );
      
      // case "Track Order":
        // return (
        //   <div>
        //     <h1 className="text-2xl font-bold mb-4">Track Your Order</h1>
        //     <div className="flex flex-col items-center">
        //       <CgTrack
        //         style={{ fontSize: "6rem" }}
        //         className="text-sky-600 text-6xl mb-2"
        //       />
        //       <p>Order not found!</p>
        //     </div>
        //   </div>
        // );
      default:
        return (
          <div>
            <h1 className="text-2xl font-bold mb-4">Profile Information</h1>
          </div>
        );
    }
  };

  return (
    <div className="flex items-center justify-center mt-40 bg-gray-100">
      <div className="relative flex w-full max-w-5xl  bg-white rounded-lg shadow-lg">
        <button
          className="absolute top-4 right-4 bg-sky-600 text-white p-2 rounded-md md:hidden"
          onClick={toggleSidebar}
        >
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>

        <aside
          className={`z-50 md:z-10 md:h-auto fixed top-0 left-0 mt[0] h-[100vh] bg-gray-100 p-4 transition-transform transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:relative md:translate-x-0 md:w-64`}
        >
          <ul className="space-y-5">
            <li
              className={
                activeSection === "Profile Information"
                  ? "font-bold text-sky-600"
                  : ""
              }
            >
              <button
                onClick={() => {
                  setActiveSection("Profile Information");
                  toggleSidebar();
                }}
                className="text-lg"
              >
                Profile Information
              </button>
            </li>
            <li
              className={
                activeSection === "My Orders" ? "font-bold text-sky-600" : ""
              }
            >
              <button
                onClick={() => {
                  setActiveSection("My Orders");
                  toggleSidebar();
                }}
                className="text-lg"
              >
                My Orders
              </button>
            </li>
            <li
              className={
                activeSection === "Address" ? "font-bold text-sky-600" : ""
              }
            >
              <button
                onClick={() => {
                  setActiveSection("Address");
                  toggleSidebar();
                }}
                className="text-lg"
              >
                Address
              </button>
            </li>
            <li className={activeSection === "Delivered" ? "font-bold text-sky-600" : ""}>
    <button
      onClick={() => {
        setActiveSection("Delivered");
        toggleSidebar();
      }}
      className="text-lg"
    >
      Delivered
    </button>
  </li>
            
            {/* <li
              className={
                activeSection === "Track Order" ? "font-bold text-sky-600" : ""
              }
            >
              <button
                onClick={() => {
                  setActiveSection("Track Order");
                  toggleSidebar();
                }}
                className="text-lg"
              >
                Track Order
              </button>
            </li> */}
          </ul>
        </aside>
        <main className="flex-1 p-4 ">{renderContent()}</main>
      </div>

    </div>
    



  );

};

export default Profile;