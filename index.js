//imports library
import express from 'express';
import dotenv from 'dotenv';
//dotenv configration
dotenv.config();
import Router from './routes/auth.js';
const app = express();
const port = process.env.PORT || 5001;
app.use(express.json());
app.use('/auth', Router);

app.get('/', (req, res) => {
  res.send('<h1>hello there</h1>');
});
app.listen(port, () => console.log('server is listening on port ' + port));
