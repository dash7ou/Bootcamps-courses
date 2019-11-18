const mongoose = require('mongoose');
const slugify = require('slugify');
const geocoder = require('../utils/geocoder');

const BootcampsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      unique: true,
      trim: true,
      maxlength: [50, 'Name can not be more than 50 characters']
    },
    slug: String,
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [500, 'Description can not be more than 500 characters']
    },
    website: {
      type: String,
      match: [
        /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/,
        'Please use a valid URL with http or https'
      ]
    },
    phone: {
      type: String,
      maxlength: [20, 'Phone number can nor be longer than 20 character']
    },
    email: {
      type: String,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email']
    },
    address: {
      type: String,
      required: [true, 'Please add an address']
    },
    location: {
      //GeoJSON Point
      type: {
        type: String,
        enum: ['Point']
      },
      coordinates: {
        type: [Number],
        index: '2dsphere'
      },
      formattedAddress: String,
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String
    },
    careers: {
      type: [String],
      required: true,
      enum: ['Web Development', 'Mobile Development', 'UI/UX', 'Data Science', 'Business', 'Other']
    },
    averageRating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [10, 'Rating must can not be more than 10']
    },
    averageCost: { type: Number },
    photo: {
      type: String,
      default: 'no-photo.jpg'
    },
    housing: {
      type: Boolean,
      default: false
    },
    jobAssistance: {
      type: Boolean,
      default: false
    },
    jobGuarantee: {
      type: Boolean,
      default: false
    },
    acceptGi: {
      type: Boolean,
      default: false
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true
  }
);

// Create bootcamp slug from the name
BootcampsSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Geocode & create location field
BootcampsSchema.pre('save', async function(next) {
  const loc = await geocoder.geocode(this.address);
  const [
    { longitude, latitude, formattedAddress, streetName, city, state, zipcode, countryCode }
  ] = loc;
  this.location = {
    type: 'Point',
    coordinates: [longitude, latitude],
    formattedAddress,
    street: streetName,
    city,
    state,
    zipcode,
    country: countryCode
  };

  // Do not save address in DB
  this.address = undefined;
  next();
});

// Cascade delete courses when a bootcamp is deleted
BootcampsSchema.pre('remove', async function(next) {
  console.log(`Courses being removed from bootcamp ${this._id}`.green);
  await this.model('Course').deleteMany({ bootcamp: this._id });
  next();
});

// Revers populate with virtuals
BootcampsSchema.virtual('courses', {
  ref: 'Course',
  localField: '_id',
  foreignField: 'bootcamp',
  jestOne: false
});

module.exports = mongoose.model('Bootcamp', BootcampsSchema);
