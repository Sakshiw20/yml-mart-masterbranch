import React, { useEffect, useState } from 'react';
import UploadAdBanner from '../components/UploadAdBanner';
import SummaryApi from '../common';
import AdminBannerCard from '../components/AdminBannerCard';

const AllBanners = () => {
  const [openUploadBanner, setOpenUploadBanner] = useState(false);
  const [allBanner, setAllBanner] = useState([]);

  const fetchAllBanner = async () => {
    try {
      const response = await fetch(SummaryApi.allAdBanner.url);
      const dataResponse = await response.json();
      console.log("banner data", dataResponse);

      // Convert object to array
      const bannersArray = dataResponse?.data ? Object.values(dataResponse.data) : [];
      setAllBanner(bannersArray);
    } catch (error) {
      console.error('Error fetching banners:', error);
    }
  };

  useEffect(() => {
    fetchAllBanner();
  }, []);

  return (
    <div>
      <div className='bg-white py-2 px-4 flex justify-between items-center'>
        <h2 className='font-bold text-lg'>All Banners</h2>
        <button 
          className='border-2 border-sky-600 text-sky-600 hover:bg-sky-600 hover:text-white transition-all py-1 px-3 rounded-full' 
          onClick={() => setOpenUploadBanner(true)}
        >
          Upload Banner
        </button>
      </div>

      {/** All banners */}
      <div className='flex items-center flex-wrap gap-5 py-4 h-[calc(100vh-190px)] overflow-y-scroll'>
        {
          allBanner.map((banner, index) => (
            <AdminBannerCard data={banner} key={banner._id || index} fetchData={fetchAllBanner} />
          ))
        }
      </div>

      {/** Upload banner component */}
      {
        openUploadBanner && (
          <UploadAdBanner onClose={() => setOpenUploadBanner(false)} fetchData={fetchAllBanner} />
        )
      }
    </div>
  );
};

export default AllBanners;
