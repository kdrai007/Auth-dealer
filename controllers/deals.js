import userCollection, {
  dealerCollection,
  soldVehicleCollection,
} from '../Models/authModel.js';
import { carCollection, vehicleDealCollection } from '../Models/dealsModel.js';
dealerCollection;
import { ObjectId } from 'mongodb';
import { client } from '../utils/helpers.js';
import { faker } from '@faker-js/faker/locale/en_IN';

//new car
export const Cars = async (req, res) => {
  const { type, name, model } = req.body;
  const { dealer_id } = req.params;

  // Check if dealer with provided dealer_id exists
  const checkDealer = await dealerCollection.findOne({
    _id: new ObjectId(dealer_id),
  });
  if (!checkDealer) {
    return res
      .status(401)
      .json({ success: false, error: "there's no dealers with this id" });
  }

  try {
    // Create a new document for the car
    const doc = {
      name: name || faker.vehicle.manufacturer(),
      type: type || faker.vehicle.type(),
      model: model || faker.vehicle.model(),
      carinfo: [],
    };

    // Insert the car document into the carCollection
    const result = await carCollection.insertOne(doc);

    // If the document is successfully inserted
    if (result.acknowledged) {
      // Update the dealer's cars array with the inserted document's ID
      await dealerCollection.updateOne(
        { _id: new ObjectId(dealer_id) },
        { $push: { cars: result.insertedId } }
      );

      // Return a success response with the car information
      return res.status(200).json({ success: true, car: doc });
    }

    // If an error occurred while inserting the document
    res.status(400).json({ success: false, error: 'something went wrong' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: 'something went wrong' });
  }
};

//get all cars
export const getCars = async (req, res) => {
  try {
    const db = client.db('Dealers');
    const carCollection = db.collection('cars');
    //getting all cars data from datatbase;
    const docs = await carCollection.find().toArray();
    res.status(200).json({ success: true, docs });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Something went wrong' });
  }
};
//making vehicle deal
export const vehicleDeal = async (req, res) => {
  const { dealer_id } = req.params;
  const { car_id } = req.query;

  // Check if required fields are missing
  if (!dealer_id.length || !car_id) {
    return res.status(401).json({ success: false, error: 'missing fields' });
  }

  // Check if dealer with provided dealer_id exists
  const checkDealer = await dealerCollection.findOne({
    _id: new ObjectId(dealer_id),
  });
  if (!checkDealer) {
    return res.status(401).json({ success: false, error: 'no dealer found!' });
  }

  try {
    // Create a new document for the vehicle deal
    const doc = {
      car_id,
      deal_info: [],
    };

    // Insert the vehicle deal document into the vehicleDealCollection
    const result = await vehicleDealCollection.insertOne(doc);

    // If the document is successfully inserted
    if (result.acknowledged) {
      // Update the dealer's deals array with the inserted document's ID
      await dealerCollection.updateOne(
        { _id: new ObjectId(dealer_id) },
        { $push: { deals: result.insertedId } }
      );

      // Return a success response with the deal information
      return res.status(200).json({ success: true, deal_info: doc });
    }

    // If an error occurred while inserting the document
    res.status(400).json({ success: false, error: 'something went wrong' });
  } catch (error) {
    // If any error occurs during the process, return an error response
    res.status(500).json({ success: false, error: 'Something went wrong' });
  }
};

//sold vehicle
export const soldVehicle = async (req, res) => {
  const { dealer_id } = req.params;
  const { user_id, car_id } = req.query;

  // Check if required fields are missing
  if (!dealer_id.length || !car_id) {
    return res.status(401).json({ success: false, error: 'missing fields' });
  }

  // Check if dealer with provided dealer_id exists
  const checkDealer = await dealerCollection.findOne({
    _id: new ObjectId(dealer_id),
  });
  if (!checkDealer) {
    return res
      .status(401)
      .json({ success: false, error: "there's no dealers with this id" });
  }

  // Check if user with provided user_id exists
  const user = await userCollection.findOne({ _id: new ObjectId(user_id) });
  if (!user) {
    return res.status(401).json({ success: false, error: 'user not found' });
  }

  try {
    // Create a new document for the sold vehicle
    const doc = {
      car_id,
      vehicle_info: [],
    };

    // Insert the sold vehicle document into the soldVehicleCollection
    const result = await soldVehicleCollection.insertOne(doc);

    // If the document is successfully inserted
    if (result.acknowledged) {
      // Update the dealer's sold_vehicles array with the inserted document's ID
      await dealerCollection.updateOne(
        { _id: new ObjectId(dealer_id) },
        { $push: { sold_vehicles: result.insertedId } }
      );

      // Update the user's vehicle_info array with the inserted document's ID
      await userCollection.updateOne(
        { _id: new ObjectId(user_id) },
        { $push: { vehicle_info: result.insertedId } }
      );

      // Return a success response with the deal information
      return res.status(200).json({ success: true, deal_info: doc });
    }

    // If an error occurred while inserting the document
    res.status(400).json({ success: false, error: 'something went wrong' });
  } catch (error) {
    // If any error occurs during the process, return an error response
    res.status(500).json({ success: false, error: 'Something went wrong' });
  }
};
