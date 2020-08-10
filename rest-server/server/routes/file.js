const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');

const Product = require('../models/products');
const User = require('../models/users');

const { validateToken, validateTokenUrl } = require('../middlewares/authentication');
const {
  isValidImage,
  moveFileToLocal,
  removeLocalFile,
} = require('../helpers/file');

const app = express();

// process file upload
app.use(fileUpload({ useTempFiles: true, createParentPath: true }));

const updateProductFileHandle = async (req, res) => {
  const { files = {}, params: { id = '' } = {} } = req;
  if (!Object.keys(files || {}).length) {
    return res.status(400).json({
      success: false,
      error: 'no files were uploaded',
    });
  }

  const { img: imgFile } = files;

  if (!imgFile) {
    return res.status(400).json({
      success: false,
      error: 'field img is required',
    });
  }

  const { error: imageFileError = '' } = isValidImage(imgFile);
  if (imageFileError) {
    return res.status(400).json({
      success: false,
      error: imageFileError,
    });
  }

  const resultMoveFile = await moveFileToLocal('product', imgFile);

  const { error: moveFileError, name: fileName = '' } = resultMoveFile;

  if (moveFileError) {
    return res.status(400).json({
      success: false,
      error: moveFileError,
    });
  }

  Product.findById(id).exec((error, productDB) => {
    if (error) {
      removeLocalFile('product', fileName);
      return res.status(400).json({ success: false, error });
    }
    const oldImg = productDB.img;
    productDB.img = fileName;
    productDB.save((saveError, productSaved) => {
      if (saveError) {
        removeLocalFile('product', fileName);
        return res.status(400).json({ success: false, error: saveError });
      }
      removeLocalFile('product', oldImg);
      return res.json({ success: true, product: productSaved });
    });
  });
};

const updateUserFileHandle = async (req, res) => {
  const { files = {}, params: { id = '' } = {} } = req;
  if (!Object.keys(files || {}).length) {
    return res.status(400).json({
      success: false,
      error: 'no files were uploaded',
    });
  }

  const { avatar: imgFile } = files;

  if (!imgFile) {
    return res.status(400).json({
      success: false,
      error: 'field img is required',
    });
  }

  const { error: imageFileError = '' } = isValidImage(imgFile);
  if (imageFileError) {
    return res.status(400).json({
      success: false,
      error: imageFileError,
    });
  }

  const resultMoveFile = await moveFileToLocal('user', imgFile);

  const { error: moveFileError, name: fileName = '' } = resultMoveFile;

  if (moveFileError) {
    return res.status(400).json({
      success: false,
      error: moveFileError,
    });
  }

  User.findById(id).exec((error, userDB) => {
    if (error) {
      removeLocalFile('user', fileName);
      return res.status(400).json({ success: false, error });
    }
    const oldImg = userDB.img;
    userDB.img = fileName;
    userDB.save((saveError, userSaved) => {
      if (saveError) {
        removeLocalFile('user', fileName);
        return res.status(400).json({ success: false, error: saveError });
      }
      removeLocalFile('user', oldImg);
      return res.json({ success: true, user: userSaved });
    });
  });
};

const showFileHandle = async (req, res) => {
  const { params: { type = '', fileName = '' } = {} } = req;

  const finalPath = path.resolve(
    __dirname,
    `../../uploads/${type}/${fileName}`,
  );

  const safePath = path.resolve(__dirname, '../../views/img/no-image.jpg/');

  if (fs.existsSync(finalPath)) {
    return res.sendFile(finalPath);
  }

  return res.sendFile(safePath);
};

app.put('/file/product/:id', validateToken, updateProductFileHandle);
app.put('/file/user/:id', validateToken, updateUserFileHandle);
app.get('/file/:type/:fileName', validateTokenUrl, showFileHandle);

module.exports = app;
