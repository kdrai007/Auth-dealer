//importing library
import express from 'express';
//checking if database is connected
import './database.js';
//config containing dotenv files here
import dotenv from 'dotenv';
dotenv.config();
//importing routes from routes.js
import Router from './routes/routes.js';
//importing middlewares for validating users
import { validateUser } from './middlewares/middleware.js';
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use('/api', Router);
//route for validating user
//Writing somethign at root endpoint
app.get('/', (req, res) => {
  res.send('<h1>Welcome to Auth-Dealer</h1>');
});
app.get('/validate_user', validateUser, (req, res) => {
  res
    .status(200)
    .json({ success: true, message: 'token verified', user: req.user });
});

app.listen(port, () => console.log('server is listening on port ' + port));
