import { client } from '../utils/helpers.js';

const db = client.db('Dealers');

export const carCollection = db.collection('cars');
export const vehicleDealCollection = db.collection('vehicleDeals');
