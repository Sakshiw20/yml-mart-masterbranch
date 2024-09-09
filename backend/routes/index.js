const express = require('express');
const router = express.Router();
const userDetailsController = require('../controller/user/userDetails');
const updateAddressController = require('../controller/user/uploadAddress');
const orderController = require('../controller/user/orderController');
const updateDeliveryController = require('../controller/user/updateDeliveryController');
const referralOrderController = require('../controller/product/getReferralOrders');
const upload = require('../config/multer'); // Import the multer configuration

// Payment routes
const paymentRoutes = require('../controller/payment/paymentRoutes');
router.use('/payment', paymentRoutes);

const kycController = require('../controller/user/kycController'); // Import your controller

// Define route to handle KYC data and file uploads
router.post('/upload-kyc', upload.fields([
  { name: 'panCardFile', maxCount: 1 },
  { name: 'aadharFile', maxCount: 1 },
  { name: 'passbookFile', maxCount: 1 }
]), kycController.handleKYC);

// User and Product routes
router.put('/orders/:orderId', updateDeliveryController);
router.post("/signup", require("../controller/user/userSignUp"));
router.post("/signin", require('../controller/user/userSignIn'));
router.get("/user-details", require('../middleware/authToken'), userDetailsController);
router.get("/userLogout", require('../controller/user/userLogout'));
router.post('/user-details', require('../middleware/authToken'), updateAddressController);
router.get('/dashboard', orderController);


// Admin Panel Routes
router.get("/all-user", require('../middleware/authToken'), require('../controller/user/allUsers'));
router.post("/update-user", require('../middleware/authToken'), require('../controller/user/updateUser'));
router.delete("/delete-user/:userId", require('../middleware/authToken'), require('../controller/user/deleteUser'));


// Product Routes
router.post("/upload-product", require('../middleware/authToken'), require('../controller/product/uploadProduct'));
router.get("/get-product", require('../controller/product/getProduct'));
router.post("/update-product", require('../middleware/authToken'), require('../controller/product/updateProduct'));
router.delete("/delete-product", require('../middleware/authToken'), require('../controller/product/deleteProduct'));
router.delete("/delete-address", require('../middleware/authToken'), require('../controller/product/deleteAddress'));

router.get("/get-categoryProduct", require('../controller/product/getCategoryProductOne'));
router.post("/category-product", require('../controller/product/getCategoryWiseProduct'));
router.post("/product-details", require('../controller/product/getProductDetails'));
router.get("/search", require('../controller/product/searchProduct'));
router.post("/filter-product", require('../controller/product/filterProduct'));
router.post("/popularity", require('../controller/product/popularity'));
router.get("/referralOrders", require('../middleware/authToken'), referralOrderController)

// Banner
router.post("/upload-banner", require('../middleware/authToken'), require('../controller/banner/uploadBanner'));
router.get("/all-banner", require('../controller/banner/getBanner'));

// AdBanner
router.post("/upload-adbanner", require('../middleware/authToken'), require('../controller/adbanner/uploadBanner'));
router.get("/all-adbanner", require('../controller/adbanner/getBanner'));


// User Cart Routes
router.post("/addtocart", require('../middleware/authToken'), require('../controller/user/addToCartController'));
router.post("/buyNow", require('../middleware/authToken'), require('../controller/user/buyNowController'));

router.get("/countAddToCartProduct", require('../middleware/authToken'), require('../controller/user/countAddToCartProduct'));
router.get("/view-card-product", require('../middleware/authToken'), require('../controller/user/addToCartViewProduct'));
router.post("/update-cart-product", require('../middleware/authToken'), require('../controller/user/updateAddToCartProduct'));
router.post("/delete-cart-product", require('../middleware/authToken'), require('../controller/user/deleteAddToCartProduct'));
// router.get("/user-profile", require('../middleware/authToken'), require('../controller/user/userProfileController'));

module.exports = router;