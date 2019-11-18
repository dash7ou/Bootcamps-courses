const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add your name']
    },
    email: {
      type: String,
      trim: true,
      unique: [true, 'This email is already taken.'],
      required: [true, 'Please enter your email'],
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add valid email']
    },
    password: {
      type: String,
      required: [true, 'Please enter your password'],
      minlength: 6,
      select: false
    },
    role: {
      type: String,
      enum: ['user', 'publisher'],
      default: 'user'
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);
