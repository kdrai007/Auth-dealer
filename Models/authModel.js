import { client } from '../utils/helpers.js';

// Access the 'Dealers' database
const db = client.db('Dealers');

// Export the 'users' collection from the 'Dealers' database
export default db.collection('users');

// Export the 'admins' collection from the 'Dealers' database
export const adminCollection = db.collection('admins');

// Export the 'alldealers' collection from the 'Dealers' database
export const dealerCollection = db.collection('alldealers');

// Export the 'soldvehicles' collection from the 'Dealers' database
export const soldVehicleCollection = db.collection('soldvehicles');
