//imports library
import express from 'express';
import './database.js';

import { config } from './config.js';
import Router from './routes/auth.js';
import { validateUser } from './middlewares/middleware.js';
import { dealerCollection } from './Models/authModel.js';
import { ObjectId } from 'mongodb';
const app = express();
const port = config.port || 5001;

app.use(express.json());
app.use('/api', Router);

app.get('/getuser', validateUser, (req, res) => {
  res.send(req.user);
});
app.listen(port, () => console.log('server is listening on port ' + port));
