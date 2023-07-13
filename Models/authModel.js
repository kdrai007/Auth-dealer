import { client } from '../utils/helpers.js';

const db = client.db('Dealers');

export default db.collection('users');
export const adminCollection = db.collection('admins');
export const dealerCollection = db.collection('alldealers');
export const soldVehicleCollection = db.collection('soldvehicles');
