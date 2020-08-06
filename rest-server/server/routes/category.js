const express = require('express');

const {
  validateToken,
  validateAdminRole,
} = require('../middlewares/authentication');

const Category = require('../models/categories');

const app = express();

const getCategoriesHandle = (req, res) => {
  Category.find({}, (error, result) => {
    if (error) {
      return res.status(400).json({ success: false, error });
    }

    return res.json({ success: true, categories: result });
  });
};

const getCategoryHandle = (req, res) => {
  const { params: { id = '' } = {} } = req;

  Category.findById(id, (error, categoryDB) => {
    if (error) {
      return res.status(400).json({ success: false, error });
    }
    if (!categoryDB) {
      return res
        .status(404)
        .json({ success: false, error: { message: 'not found' } });
    }
    res.json({ success: true, category: categoryDB });
  });
};

const createCategoryHandle = (req, res) => {
  const { body: { description } = {} } = req;
  const { locales: { user: { _id: userId = '' } = {} } = {} } = res;

  const category = new Category({
    description,
    user: userId,
  });

  category.save((error, result) => {
    if (error) {
      return res.status(400).json({ success: false, error: { ...error } });
    }
    res.json({ success: true, category: result });
  });
};

const updateCategoryHandle = (req, res) => {
  const { params: { id: idToUpdate = '' } = {} } = req;
  const { body: { description } = {} } = req;

  Category.findByIdAndUpdate(
    idToUpdate,
    { description },
    { new: true },
    (error, result) => {
      if (error) {
        return res.status(400).json({ success: false, error: { ...error } });
      }
      res.json({ success: true, category: result });
    },
  );
};

const deleteCategoryHandle = (req, res) => {
  const { params: { id: idToDelete = '' } = {} } = req;

  Category.findByIdAndRemove(idToDelete, (error, categoryDeleted) => {
    if (error) {
      return res.status(400).json({ success: false, error });
    }

    if (!categoryDeleted) {
      return res
        .status(404)
        .json({ success: false, error: { message: 'not found' } });
    }
    res.json({ success: true, category: categoryDeleted });
  });
};

app.get('/category', validateToken, getCategoriesHandle);
app.get('/category/:id', validateToken, getCategoryHandle);
app.post('/category', validateToken, createCategoryHandle);
app.put('/category/:id', validateToken, updateCategoryHandle);
app.delete(
  '/category/:id',
  [validateToken, validateAdminRole],
  deleteCategoryHandle,
);

module.exports = app;
