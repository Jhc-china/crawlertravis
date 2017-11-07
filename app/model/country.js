'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const CountrySchema = new mongoose.Schema({
    ENname: { type: String },
    CNname: { type: String },
    Shortening: { type: String },
    countryNum: { type: String },
    countryTelnum: { type: String },
  }, { collection: 'country' });
  return mongoose.model('Country', CountrySchema);
};
// 这个是我的model，collection是database里面的country table
