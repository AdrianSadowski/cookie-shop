const express = require('express');
const router = express.Router();

const Product = require('../models/product.model');

router.get('/products', async (req, res) => {
  try{
    const result = await Product.find();
    if(!result) res.status(404).json({product: 'Not Found'});
    else res.json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/posts/:id', async (req, res) => {
  try {
    const result = await Product.findById(req.params.id);
    if(!result) res.status(404).json({product: 'Not Found'});
    else res.json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;