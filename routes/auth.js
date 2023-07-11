import express from 'express';
const Router = express.Router();

Router.get('/g', (req, res) => {
  res.send('<h2>hello how do you do</h1>');
});

export default Router;
