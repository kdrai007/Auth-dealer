import express from 'express';
import {
  adminLogin,
  createAdmin,
  createDealer,
  createUser,
  dealerLogin,
  userLogin,
} from '../controllers/auth.js';
import { Cars, getCars, vehicleDeal } from '../controllers/deals.js';
// import { validateUser } from '../middlewares/middleware.js';
const Router = express.Router();
//create user on http://localhost:5000/auth/user-signup or 5001
Router.post('/auth/user_signup', createUser);
//login at /auth/user_login
Router.post('/auth/user_login', userLogin);
Router.post('/auth/admin_signup', createAdmin);
Router.post('/auth/admin_login', adminLogin);
Router.post('/auth/dealer_signup', createDealer);
Router.post('/auth/dealer_login', dealerLogin);

//deals realated
Router.post('/deal/:dealer_id/new-car', Cars);
Router.post('/deal/:dealer_id/vehicle_deal', vehicleDeal);
Router.get('/deal/all-cars', getCars);

export default Router;
