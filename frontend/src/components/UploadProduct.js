import React, { useState, useEffect,useContext } from 'react';
import { CgClose } from "react-icons/cg";
import productCategory from '../helpers/productCategory'; // Update this to include subcategories
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from '../helpers/uploadImage';
import DisplayImage from './DisplayImage';
import { MdDelete } from "react-icons/md";
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import Context from "../context/index";
import AWS from 'aws-sdk';



const UploadProduct = ({
    onClose,
    fetchData,
    
    
}) => {
  const [data, setData] = useState({
    productName: "",
    brandName: "",
    category: "",
    subcategory: "",
    productImage: [],
    description: "",
    price: "",
    sellingPrice: "",
    quantity: ""
  });
  const { authToken } = useContext(Context); // Get the authToken from Context

  
  const [subcategories, setSubcategories] = useState([]);
  const [openFullScreenImage, setOpenFullScreenImage] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState("");
  

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle category change and update subcategories
  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    const selected = productCategory.find(cat => cat.value === selectedCategory);
    setData((prev) => ({
      ...prev,
      category: selectedCategory,
      subcategory: "" // reset subcategory when category changes
    }));
    setSubcategories(selected ? selected.subcategories : []);
  };


// Configure AWS
AWS.config.update({
    accessKeyId: process.env.REACT_APP_ACCESS_KEY,
    secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
    region: process.env.REACT_APP_BUCKET_REGION
});

const s3 = new AWS.S3();

const handleUploadProduct = async (e) => {
    const file = e.target.files[0];
    console.log(file)
    try {
        const url = await uploadImageToS3(file);
        setData((prev) => ({
            ...prev,
            productImage: [...prev.productImage, url]
        }));
    } catch (error) {
        console.error('Error uploading image:', error);
    }
};

const uploadImageToS3 = async (file) => {
  console.log(process.env.REACT_APP_BUCKET_NAME)
    const params = {
        Bucket: process.env.REACT_APP_BUCKET_NAME,
        Key: `products/${Date.now()}_${file.name}`, // you can change the path as per your structure
        Body: file,
        // ACL: 'public-read', // makes the file publicly readable
        ContentType: file.type,
    };

    return new Promise((resolve, reject) => {
        s3.upload(params, (err, data) => {
            if (err) {
                reject(err);
            }
            resolve(data.Location); // URL of the uploaded file
        });
    });
};


  const handleDeleteProductImage = (index) => {
    const newProductImage = [...data.productImage];
    newProductImage.splice(index, 1);
    setData((prev) => ({
      ...prev,
      productImage: [...newProductImage]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(SummaryApi.uploadProduct.url, {
      method: SummaryApi.uploadProduct.method,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`, 
      },
      body: JSON.stringify(data)
    });
    const responseData = await response.json();

    if (responseData.success) {
      toast.success(responseData?.message);
      onClose();
      fetchData();
    } else {
      toast.error(responseData?.message);
    }
  };

  return (
    <div className='fixed w-full h-full bg-slate-200 bg-opacity-35 top-0 left-0 right-0 bottom-0 flex justify-center items-center'>
      <div className='bg-white p-4 rounded w-full max-w-2xl h-full max-h-[80%] overflow-hidden'>
        <div className='flex justify-between items-center pb-3'>
          <h2 className='font-bold text-lg'>Upload Product</h2>
          <div className='w-fit ml-auto text-2xl hover:text-sky-600 cursor-pointer' onClick={onClose}>
            <CgClose />
          </div>
        </div>

        <form className='grid p-4 gap-2 overflow-y-scroll h-full pb-5' onSubmit={handleSubmit}>
          <label htmlFor='productName'>Product Name :</label>
          <input
            type='text'
            id='productName'
            placeholder='enter product name'
            name='productName'
            value={data.productName}
            onChange={handleOnChange}
            className='p-2 bg-slate-100 border rounded'
            required
          />

          <label htmlFor='brandName' className='mt-3'>Brand Name :</label>
          <input
            type='text'
            id='brandName'
            placeholder='enter brand name'
            value={data.brandName}
            name='brandName'
            onChange={handleOnChange}
            className='p-2 bg-slate-100 border rounded'
            required
          />

          <label htmlFor='category' className='mt-3'>Category :</label>
          <select required value={data.category} name='category' onChange={handleCategoryChange} className='p-2 bg-slate-100 border rounded'>
            <option value={""}>Select Category</option>
            {
              productCategory.map((el, index) => (
                <option value={el.value} key={el.value + index}>{el.label}</option>
              ))
            }
          </select>

          {/* Subcategory Dropdown */}
          {subcategories.length > 0 && (
            <>
              <label htmlFor='subcategory' className='mt-3'>Subcategory :</label>
              <select required value={data.subcategory} name='subcategory' onChange={handleOnChange} className='p-2 bg-slate-100 border rounded'>
                <option value={""}>Select Subcategory</option>
                {
                  subcategories.map((subcat, index) => (
                    <option value={subcat.value} key={subcat.value + index}>{subcat.label}</option>
                  ))
                }
              </select>
            </>
          )}

          <label htmlFor='productImage' className='mt-3'>Product Image :</label>
          <label htmlFor='uploadImageInput'>
            <div className='p-2 bg-slate-100 border rounded h-32 w-full flex justify-center items-center cursor-pointer'>
              <div className='text-slate-500 flex justify-center items-center flex-col gap-2'>
                <span className='text-4xl'><FaCloudUploadAlt /></span>
                <p className='text-sm'>Upload Product Image</p>
                <input type='file' id='uploadImageInput' className='' onChange={handleUploadProduct} />
              </div>
            </div>
          </label>

          <div>
            {data?.productImage[0] ? (
              <div className='flex items-center gap-2'>
                {data.productImage.map((el, index) => (
                  <div className='relative group' key={index}>
                    <img
                      src={el}
                      alt={el}
                      width={80}
                      height={80}
                      className='bg-slate-100 border cursor-pointer'
                      onClick={() => {
                        setOpenFullScreenImage(true);
                        setFullScreenImage(el);
                      }}
                    />
                    <div className='absolute bottom-0 right-0 p-1 text-white bg-sky-600 rounded-full hidden group-hover:block cursor-pointer' onClick={() => handleDeleteProductImage(index)}>
                      <MdDelete />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className='text-sky-600 text-xs'>*Please upload product image</p>
            )}
          </div>

          <label htmlFor='price' className='mt-3'>Price :</label>
          <input
            type='number'
            id='price'
            placeholder='enter price'
            value={data.price}
            name='price'
            onChange={handleOnChange}
            className='p-2 bg-slate-100 border rounded'
            required
          />

          <label htmlFor='sellingPrice' className='mt-3'>Selling Price :</label>
          <input
            type='number'
            id='sellingPrice'
            placeholder='enter selling price'
            value={data.sellingPrice}
            name='sellingPrice'
            onChange={handleOnChange}
            className='p-2 bg-slate-100 border rounded'
            required
          />

          <label htmlFor='quantity' className='mt-3'>Quantity :</label>
          <input
            type='Number'
            id='quantity'
            placeholder='Enter Quantity'
            value={data.quantity}
            name='quantity'
            onChange={handleOnChange}
            className='p-2 bg-slate-100 border rounded'
            required
          />

          <label htmlFor='description' className='mt-3'>Description :</label>
          <textarea
            className='h-28 bg-slate-100 border resize-none p-1'
            placeholder='enter product description'
            rows={3}
            onChange={handleOnChange}
            name='description'
            value={data.description}
          ></textarea>

          <button className='px-3 py-2 bg-sky-600 text-white mb-10 hover:bg-sky-700'>Upload Product</button>
        </form>
      </div>
    </div>
  );
};

export default UploadProduct;
