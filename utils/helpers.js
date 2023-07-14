import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';
import { config } from '../config.js';

// MongoDB connection URL from the configuration file
const url = config.databaseUrl;

// Create a new instance of the MongoClient using the connection URL
export const client = new MongoClient(url);

// Hashes a password using bcrypt
export const hashPassoword = async (password) => {
  // Generate a salted and hashed password using bcrypt with 10 rounds of salt
  const hash = await bcrypt.hash(password, 10);
  return hash;
};
