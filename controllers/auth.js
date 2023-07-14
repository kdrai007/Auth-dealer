import { hashPassoword } from '../utils/helpers.js';
import { faker } from '@faker-js/faker/locale/en_IN';
import userCollection, {
  adminCollection,
  dealerCollection,
} from '../Models/authModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { config } from '../config.js';

export const createUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user already exists
    const user = await userCollection.findOne({ user_email: email });
    if (user) {
      return res.status(401).json({
        success: false,
        error:
          'User with this email already exists. Please try a different email.',
      });
    }

    // Generate a random salt and hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(
      password || 'heythere',
      saltRounds
    );
    //if user provider email otherwise random email is gonna assign by faker.js
    const userEmail = (email || faker.internet.email()).toLowerCase();
    //creating new doc the new user
    const doc = {
      user_email: userEmail,
      password: hashedPassword,
      user_location: `${faker.location.city()}, ${faker.location.state()}, India`,
      user_info: [],
      vehicle_info: [],
    };
    //inserting doc in database
    const result = await userCollection.insertOne(doc);
    //sending the result
    res.status(201).json({
      success: result.acknowledged,
      created: { email: doc.user_email, user_id: result.insertedId },
    });
  } catch (err) {
    // If any error occurs during the process, return an error response

    res.status(500).json({
      success: false,
      error: 'An error occurred while creating the user.',
    });
  }
};

export const createAdmin = async (req, res) => {
  const { fullname, admin, password } = req.body;
  // Check if admin already exists
  const user = await adminCollection.findOne({ admin });
  if (user)
    return res.status(401).json({
      success: false,
      error: 'try different email ! admin by this email already exists',
    });
  try {
    //hasing the password
    const hash = await hashPassoword(password || 'heythere');
    //creating new doc the new admin
    const doc = {
      fullname: fullname || faker.person.fullName(),
      admin: (admin || faker.internet.email()).toLowerCase(),
      password: hash,
    };
    //inserting doc in database
    const result = await adminCollection.insertOne(doc);
    //sending the result
    res.status(201).json({
      success: result.acknowledged,
      created: { email: doc.admin, user_id: result.insertedId },
    });
  } catch (err) {
    // If any error occurs during the process, return an error response

    res.status(500).json({
      success: false,
      error: 'An error occurred while creating the admin.',
    });
  }
};

export const createDealer = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if dealer already exists
    const user = await userCollection.findOne({ user_email: email });
    if (user) {
      return res.status(401).json({
        success: false,
        error:
          'User with this email already exists. Please try a different email.',
      });
    }

    // Generate a random salt and hash the password
    const hashedPassword = await hashPassoword(password || 'heythere');
    //generating if user doesn't provide email
    const DealerEmail = (email || faker.internet.email()).toLowerCase();
    //creating a new doc for dealer
    const doc = {
      dealer_email: DealerEmail,
      password: hashedPassword,
      dealer_location: `${faker.location.city()}, ${faker.location.state()}, India`,
      dealer_info: [],
      deals: [],
      cars: [],
      sold_vehicles: [],
    };
    //inserting doc in database
    const result = await dealerCollection.insertOne(doc);
    //sending the reuslt
    res.status(201).json({
      success: result.acknowledged,
      created: { email: doc.dealer_email, dealer_id: result.insertedId },
    });
  } catch (err) {
    // If any error occurs during the process, return an error response
    res.status(500).json({
      success: false,
      error: 'An error occurred while creating the user.',
    });
  }
};

export const userLogin = async (req, res) => {
  const { user_email, password } = req.body;

  // Find the user in the userCollection based on the provided email
  const user = await userCollection.findOne({ user_email });

  // If user is not found, return an error response
  if (!user)
    return res.status(401).json({ success: false, error: 'user not found' });

  try {
    // Compare the provided password with the stored hashed password using bcrypt
    bcrypt.compare(password, user.password, function (err, result) {
      if (result) {
        // If the passwords match, generate a JSON Web Token (JWT) for authentication
        const token = jwt.sign(
          { user_id: user._id, user_email },
          config.jwtSecret,
          {
            expiresIn: '2h',
          }
        );

        // Return a success response with the user email, token, and a message indicating successful login
        return res.status(200).json({
          success: true,
          email: user.user_email,
          token,
          message: 'user logged in',
        });
      } else {
        // If the passwords don't match, return an error response indicating invalid credentials
        if (!err)
          return res
            .status(401)
            .json({ success: false, error: 'invalid credentials' });
      }
    });
  } catch (error) {
    // If any error occurs during the process, return an error response
    res.status(401).json({ success: false, error: 'something went wrong' });
  }
};

export const adminLogin = async (req, res) => {
  const { admin, password } = req.body;

  try {
    // Find the admin in the adminCollection based on the provided admin id

    const checkAdmin = await adminCollection.findOne({ admin });

    if (!checkAdmin) {
      return res.status(401).json({ success: false, error: 'admin not found' });
    }
    // Compare the provided password with the stored hashed password using bcrypt
    bcrypt
      .compare(password, checkAdmin.password)
      .then((result) => {
        if (result) {
          // If the passwords match, generate a JSON Web Token (JWT) for authentication
          const token = jwt.sign(
            { user_id: checkAdmin._id, admin },
            config.jwtSecret,
            {
              expiresIn: '2h',
            }
          );
          // Return a success response with the user email, token, and a message indicating successful login
          return res.status(200).json({
            success: true,
            message: 'admin logged in',
            token,
          });
        } else {
          //Return a error response in case admin provided a wrong credentials;
          return res
            .status(401)
            .json({ success: false, error: 'invalid credentials' });
        }
      })
      // If any error occurs during the process, return an error response
      .catch(() => {
        return res
          .status(401)
          .json({ success: false, error: 'something went wrong' });
      });
  } catch (error) {
    // If any error occurs during the process, return an error response
    return res
      .status(401)
      .json({ success: false, error: 'something went wrong' });
  }
};

export const dealerLogin = async (req, res) => {
  const { dealer_email, password } = req.body;

  try {
    // Find the dealer in the dealerCollection based on the provided email
    const checkDealer = await dealerCollection.findOne({ dealer_email });
    console.log(checkDealer);

    // If dealer is not found, return an error response
    if (!checkDealer) {
      return res
        .status(401)
        .json({ success: false, error: 'dealer not found' });
    }

    // Compare the provided password with the stored hashed password using bcrypt
    bcrypt
      .compare(password, checkDealer.password)
      .then((result) => {
        if (result) {
          // If the passwords match, generate a JSON Web Token (JWT) for authentication
          const token = jwt.sign(
            { user_id: checkDealer._id, dealer_email },
            config.jwtSecret,
            {
              expiresIn: '2h',
            }
          );
          // Return a success response with a message indicating successful login and the token
          return res.status(200).json({
            success: true,
            message: 'dealer logged in',
            token,
          });
        } else {
          // If the passwords don't match, return an error response indicating invalid credentials
          return res
            .status(401)
            .json({ success: false, error: 'invalid credentials' });
        }
      })
      .catch(() => {
        // If any error occurs during the process, return an error response
        return res
          .status(401)
          .json({ success: false, error: 'something went wrong' });
      });
  } catch (error) {
    // If any error occurs during the process, return an error response
    return res
      .status(401)
      .json({ success: false, error: 'something went wrong' });
  }
};
