import express from 'express';
import {
  adminLogin,
  createAdmin,
  createDealer,
  createUser,
  dealerLogin,
  userLogin,
} from '../controllers/auth.js';
import {
  Cars,
  getCars,
  soldVehicle,
  vehicleDeal,
} from '../controllers/deals.js';
// import { validateUser } from '../middlewares/middleware.js';

// Create an instance of the Express Router
const Router = express.Router();

// Routes for creating and logging in users
Router.post('/auth/user_signup', createUser); // Endpoint for user registration
Router.post('/auth/user_login', userLogin); // Endpoint for user login

// Routes for creating and logging in admins
Router.post('/auth/admin_signup', createAdmin); // Endpoint for admin registration
Router.post('/auth/admin_login', adminLogin); // Endpoint for admin login

// Routes for creating and logging in dealers
Router.post('/auth/dealer_signup', createDealer); // Endpoint for dealer registration
Router.post('/auth/dealer_login', dealerLogin); // Endpoint for dealer login

// Routes related to deals
Router.post('/deal/:dealer_id/new_car', Cars); // Endpoint for adding a new car by a dealer
Router.post('/deal/:dealer_id/vehicle_deal', vehicleDeal); // Endpoint for making a vehicle deal by a dealer
Router.post('/deal/:dealer_id/sold_vehicle', soldVehicle); // Endpoint for marking a vehicle as sold by a dealer

Router.get('/deal/all_cars', getCars); // Endpoint for getting all available cars

export default Router;
