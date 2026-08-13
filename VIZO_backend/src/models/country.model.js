const mongoose = require("mongoose");

const countrySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    isoCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    phoneCode: {
      type: String,
      required: true,
      trim: true,
    },
    flag: {
      type: String,
      default: "",
    },
    currency: {
      type: String,
      default: "",
    },
    location: {
      latitude: Number,
      longitude: Number,
    },
    timezones: [
      {
        zoneName: String,
        gmtOffset: Number,
        gmtOffsetName: String,
        abbreviation: String,
        tzName: String,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const Country = mongoose.model("Country", countrySchema);
module.exports = Country;
