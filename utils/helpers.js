import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';
import { config } from '../config.js';
const url = config.databaseUrl;
export const client = new MongoClient(url);

export const hashPassoword = async (password) => {
  const hash = await bcrypt.hash(password, 10);
  return hash;
};
