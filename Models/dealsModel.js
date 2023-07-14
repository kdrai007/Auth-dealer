import { client } from '../utils/helpers.js';

// Export the 'dealers' db from database;
const db = client.db('Dealers');

//export 'car' collection ;
export const carCollection = db.collection('cars');
//export the 'vehicle-dea' collection;
export const vehicleDealCollection = db.collection('vehicleDeals');
