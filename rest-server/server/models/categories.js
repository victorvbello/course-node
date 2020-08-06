const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const categorySchema = new Schema({
  description: {
    type: String,
    unique: true,
    required: [true, 'description is required'],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

categorySchema.plugin(uniqueValidator, { message: '{PATH} must be unique' });

module.exports = mongoose.model('Category', categorySchema);
