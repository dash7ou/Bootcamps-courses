const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

// Hashing password before save user
userSchema.pre('save', async function(next) {
  const { password } = this;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Sign JWT and return
userSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

module.exports = mongoose.model('User', userSchema);
