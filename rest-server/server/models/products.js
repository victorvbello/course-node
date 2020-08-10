const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, 'name is required'],
  },
  price: {
    type: Number,
    required: [true, 'price is requires'],
  },
  description: {
    type: String,
    required: [true, 'description is requires'],
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  img: {
    type: String,
    required: false,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'category is requires'],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

module.exports = mongoose.model('Product', productSchema);
