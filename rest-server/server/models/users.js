const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const validRoles = {
  values: ['ADMIN_ROLE', 'USER_ROLE'],
  message: '{VALUE}, not is a valid role'
}

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'User name is required'],
  },
  email: {
    type: String,
    required: [true, 'User email is required'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'User password is required'],
  },
  img: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    default: 'USER_ROLE',
    enum: validRoles,
  },
  state: {
    type: Boolean,
    default: true,
  },
  google: {
    type: Boolean,
    default: false,
  },
});

userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
}

userSchema.plugin(uniqueValidator, { message: '{PATH} must be unique' });

module.exports = mongoose.model('User', userSchema);
