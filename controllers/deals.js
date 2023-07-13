import {
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
  const checkDealer = await dealerCollection.findOne({
    _id: new ObjectId(dealer_id),
  });
  if (!checkDealer)
    return res
      .status(401)
      .json({ success: false, error: "there's no dealers with this id" });
  try {
    const doc = {
      name: name || faker.vehicle.manufacturer(),
      type: type || faker.vehicle.type(),
      model: model || faker.vehicle.model(),
      carinfo: [],
    };
    const result = await carCollection.insertOne(doc);
    if (result.acknowledged) {
      await dealerCollection.updateOne(
        { _id: new ObjectId(dealer_id) },
        { $push: { cars: result.insertedId } }
      );
      return res.status(200).json({ success: true, car: doc });
    }
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
  if (!dealer_id.length || !car_id) {
    return res.status(401).json({ success: false, error: 'missing fields' });
  }
  const checkDealer = await dealerCollection.findOne({
    dealer_id: new ObjectId(dealer_id),
  });
  if (!checkDealer) {
    return res.status(401).json({ success: false, error: 'no dealer found!' });
  }
  try {
    const doc = {
      car_id,
      deal_info: [],
    };
    const result = await vehicleDealCollection.insertOne(doc);
    if (result.acknowledged) {
      await dealerCollection.updateOne(
        { _id: new ObjectId(dealer_id) },
        { $push: { deals: result.insertedId } }
      );
      return res.status(200).json({ success: true, deal_info: doc });
    }
    res.status(400).json({ success: false, error: 'something went wrong' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Something went wrong' });
  }
};
//sold vehicle
export const soldVehicle = async (req, res) => {
  const { dealer_id } = req.params;
  const { car_id } = req.query;
  if (!dealer_id.length || !car_id) {
    return res.status(401).json({ success: false, error: 'missing fields' });
  }
  const checkDealer = await dealerCollection.findOne({
    dealer_id: new ObjectId(dealer_id),
  });
  if (!checkDealer) {
    return res.status(401).json({ success: false, error: 'no dealer found!' });
  }
  try {
    const doc = {
      car_id,
      vehicle_info: [],
    };
    const result = await soldVehicleCollection.insertOne(doc);
    if (result.acknowledged) {
      await dealerCollection.updateOne(
        { _id: new ObjectId(dealer_id) },
        { $push: { sold_vehicles: result.insertedId } }
      );
      return res.status(200).json({ success: true, deal_info: doc });
    }
    res.status(400).json({ success: false, error: 'something went wrong' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Something went wrong' });
  }
};
