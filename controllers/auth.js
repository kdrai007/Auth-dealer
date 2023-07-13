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

    const userEmail = (email || faker.internet.email()).toLowerCase();

    const doc = {
      user_email: userEmail,
      password: hashedPassword,
      user_location: `${faker.location.city()}, ${faker.location.state()}, India`,
      user_info: [],
      vehicle_info: [],
    };

    const result = await userCollection.insertOne(doc);
    res.status(201).json({
      success: result.acknowledged,
      created: { email: doc.user_email, user_id: result.insertedId },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'An error occurred while creating the user.',
    });
  }
};

export const createAdmin = async (req, res) => {
  const { fullname, admin, password } = req.body;
  const user = await adminCollection.findOne({ admin });
  console.log(user);
  if (user)
    return res.status(401).json({
      success: false,
      error: 'try different email ! admin by this email already exists',
    });
  try {
    const hash = await hashPassoword(password || 'heythere');
    const doc = {
      fullname: fullname || faker.person.fullName(),
      admin: (admin || faker.internet.email()).toLowerCase(),
      password: hash,
    };
    const result = await adminCollection.insertOne(doc);
    res.status(201).json({
      success: result.acknowledged,
      created: { email: doc.admin, user_id: result.insertedId },
    });
  } catch (err) {
    console.log(err);
  }
};

export const createDealer = async (req, res) => {
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
    const hashedPassword = await hashPassoword(password || 'heythere');

    const DealerEmail = (email || faker.internet.email()).toLowerCase();

    const doc = {
      dealer_email: DealerEmail,
      password: hashedPassword,
      dealer_location: `${faker.location.city()}, ${faker.location.state()}, India`,
      dealer_info: [],
      deals: [],
      cars: [],
      sold_vehicles: [],
    };

    const result = await dealerCollection.insertOne(doc);
    res.status(201).json({
      success: result.acknowledged,
      created: { email: doc.dealer_email, dealer_id: result.insertedId },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'An error occurred while creating the user.',
    });
  }
};

export const userLogin = async (req, res) => {
  const { user_email, password } = req.body;
  const user = await userCollection.findOne({ user_email });
  if (!user)
    return res.status(401).json({ success: false, error: 'user not found' });
  try {
    bcrypt.compare(password, user.password, function (err, result) {
      if (result) {
        const token = jwt.sign(
          { user_id: user._id, user_email },
          config.jwtSecret,
          {
            expiresIn: '2h',
          }
        );
        // save user token
        return res.status(200).json({
          success: true,
          email: user.user_email,
          token,
          message: 'user logged in',

          // token: pass.token,
          // user: pass.name,
        });
      } else {
        if (!err)
          return res
            .status(401)
            .json({ success: false, error: 'invalid credentials' });
      }
    });
  } catch (error) {
    res.status(401).json({ success: false, error: 'something went wrong' });
  }
};

export const adminLogin = async (req, res) => {
  const { admin, password } = req.body;

  try {
    const checkAdmin = await adminCollection.findOne({ admin });

    if (!checkAdmin) {
      return res.status(401).json({ success: false, error: 'admin not found' });
    }

    bcrypt
      .compare(password, checkAdmin.password)
      .then((result) => {
        if (result) {
          const token = jwt.sign(
            { user_id: checkAdmin._id, admin },
            config.jwtSecret,
            {
              expiresIn: '2h',
            }
          );
          return res.status(200).json({
            success: true,
            message: 'admin logged in',
            token,
          });
        } else {
          return res
            .status(401)
            .json({ success: false, error: 'invalid credentials' });
        }
      })
      .catch(() => {
        return res
          .status(401)
          .json({ success: false, error: 'something went wrong' });
      });
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, error: 'something went wrong' });
  }
};

export const dealerLogin = async (req, res) => {
  const { dealer_email, password } = req.body;

  try {
    const checkDealer = await dealerCollection.findOne({ dealer_email });
    console.log(checkDealer);

    if (!checkDealer) {
      return res
        .status(401)
        .json({ success: false, error: 'dealer not found' });
    }

    bcrypt
      .compare(password, checkDealer.password)
      .then((result) => {
        if (result) {
          const token = jwt.sign(
            { user_id: checkDealer._id, dealer_email },
            config.jwtSecret,
            {
              expiresIn: '2h',
            }
          );
          return res.status(200).json({
            success: true,
            message: 'dealer logged in',
            token,
          });
        } else {
          return res
            .status(401)
            .json({ success: false, error: 'invalid credentials' });
        }
      })
      .catch(() => {
        return res
          .status(401)
          .json({ success: false, error: 'something went wrong' });
      });
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, error: 'something went wrong' });
  }
};
