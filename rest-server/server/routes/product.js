const express = require('express');

const { validateToken } = require('../middlewares/authentication');

const Product = require('../models/products');

const app = express();

const getProductsHandle = (req, res) => {
  const { query = {} } = req;
  const {
    limit_form: limitFrom = 0,
    limit_to: limitTo = 5,
    all: showAll = false,
  } = query;

  const queryCondition = showAll ? {} : { enabled: true };

  Product.find(queryCondition)
    .skip(parseInt(limitFrom, 10))
    .limit(parseInt(limitTo, 10))
    .populate('user', 'name email')
    .populate('category', 'description')
    .exec((error, result) => {
      if (error) {
        return res.status(400).json({ success: false, error });
      }

      Product.countDocuments(queryCondition, (countError, total) => {
        if (countError) {
          return res
            .status(400)
            .json({ success: false, error: { ...countError } });
        }
        return res.json({ success: true, products: result, total });
      });
    });
};

const getProductHandle = (req, res) => {
  const { params: { id = '' } = {} } = req;

  Product.findById(id)
    .populate('user', 'name email')
    .populate('category', 'description')
    .exec((error, productDB) => {
      if (error) {
        return res.status(400).json({ success: false, error });
      }
      if (!productDB) {
        return res
          .status(404)
          .json({ success: false, error: { message: 'not found' } });
      }
      return res.json({ success: true, product: productDB });
    });
};

const searchProductHandle = (req, res) => {
  const { params: { term = '' } = {} } = req;

  const nameRegex = new RegExp(term, 'i');

  Product.find({ name: nameRegex, enabled: true })
    .populate('user', 'name email')
    .populate('category', 'description')
    .exec((error, result) => {
      if (error) {
        return res.status(400).json({ success: false, error });
      }

      return res.json({ success: true, products: result });
    });
};

const createProductHandle = (req, res) => {
  const { body = {}, locales: { user: { _id: userId = '' } = {} } = {} } = req;
  const { name, price, description, category } = body;

  const newProduct = new Product({
    name,
    price,
    description,
    category,
    user: userId,
  });

  newProduct.save((error, productDB) => {
    if (error) {
      return res.status(400).json({ success: false, error });
    }
    return res.json({ success: true, product: productDB });
  });
};

const updateProductHandle = (req, res) => {
  const { params: { id = '' } = {} } = req;
  const { body = {} } = req;
  const { name, price, description, category } = body;
  const finalData = {
    ...(name ? { name } : {}),
    ...(price ? { price } : {}),
    ...(description ? { description } : {}),
    ...(category ? { category } : {}),
  };

  Product.findByIdAndUpdate(
    id,
    finalData,
    { new: true, runValidators: true, context: 'query' },
    (error, productDB) => {
      if (error) {
        return res.status(400).json({ success: false, error });
      }
      if (!productDB) {
        return res
          .status(404)
          .json({ success: false, error: { message: 'not found' } });
      }
      return res.json({ success: true, product: productDB });
    },
  );
};

const deleteProductHandle = (req, res) => {
  const { params: { id = '' } = {} } = req;

  Product.findByIdAndUpdate(
    id,
    { enabled: false },
    { new: true, runValidators: true, context: 'query' },
    (error, productDB) => {
      if (error) {
        return res.status(400).json({ success: false, error });
      }
      if (!productDB) {
        return res
          .status(404)
          .json({ success: false, error: { message: 'not found' } });
      }
      return res.json({ success: true, product: productDB });
    },
  );
};

app.get('/product', validateToken, getProductsHandle);
app.get('/product/:id', validateToken, getProductHandle);
app.get('/product/search/:term', validateToken, searchProductHandle);
app.post('/product', validateToken, createProductHandle);
app.put('/product/:id', validateToken, updateProductHandle);
app.delete('/product/:id', validateToken, deleteProductHandle);

module.exports = app;
