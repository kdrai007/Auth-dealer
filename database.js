import { MongoClient } from 'mongodb';
import { config } from './config.js';

// Create a MongoDB connection URL
const url = config.databaseUrl;

// Create a new MongoClient
const client = new MongoClient(url);

client
  .connect()
  .then(() => {
    console.log('Connected successfully to database');
    client.close();
  })
  .catch((err) => {
    console.error('Failed to connect to database:', err);
  });
