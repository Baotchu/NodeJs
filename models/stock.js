var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/test");

// if our user.js file is at app/models/user.js

// grab the things we need

var Schema = mongoose.Schema;

// I - Create a schema
var stockSchema = new Schema({
  name: String,
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  admin: Boolean,
  location: String,
  meta: {
    age: Number,
    website: String
  },
  created_at: Date,
  updated_at: Date
});

// you can also do queries and find similar users
stockSchema.methods.dudify = function() {
  // add some stuff to the users name
  this.name = this.name + '-dude';

  return this.name;
};

// the schema is useless so far
// we need to create a model using it
var Stock = mongoose.model('Stock', stockSchema);
//
// make this available to our users in our Node applications
module.exports = Stock;
//
//
//
// II - Create a new user called chris
var chris = new Stock({
  name: 'Chris',
  username: 'sevila',
  password: 'password'
});

// call the custom method. this will just add -dude to his name
// user will now be Chris-dude
chris.dudify(function(err, name) {
  if (err) throw err;

  console.log('Your new name is ' + name);
});

// call the built-in save method to save to the database
chris.save(function(err) {
  if (err) throw err;

  console.log('Stock saved successfully!');
});

// on every save, add the date
stockSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();

  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at)
    this.created_at = currentDate;

  next();
});

//Test Git
// CREATE methods
// create a new user
var newStock = Stock({
  name: 'Peter Quill',
  username: 'starlord',
  password: 'password123456',
  admin: true
});

// save the user
newStock.save(function(err) {
  if (err) throw err;

  console.log('Stock created!');
});

// III - READ methods
// Find All

// get all the users
Stock.find({}, function(err, stocks) {
  if (err) throw err;

  // object of all the users
  console.log(stocks);
});

// get the stock starlord55
Stock.find({ username: 'starlord55' }, function(err, stock) {
  if (err) throw err;

  // object of the user
  console.log(stock);
});

// FIND by ID

// get a user with ID of 1
Stock.findById(5, function(err, stock) {
  if (err) throw err;

  // show the one user
  console.log(stock);
});

// IV - QUERING (Use MongoDB query syntax)

// get any admin that was created in the past month

// get the date 1 month ago
var monthAgo = new Date();
monthAgo.setMonth(monthAgo.getMonth() - 1);

Stock.find({ admin: true }).where('created_at').gt(monthAgo).exec(function(err, stocks) {
  if (err) throw err;

  // show the admins in the past month
  console.log(stocks);
});

// V - UPDATE specific stocks, change some attributes and resave records
// Get a stock with ID of 1 then update it

// get a user with ID of 1
Stock.findById(1, function(err, stock) {
  if (err) throw err;

  // change the users location
  stock.location = 'US';

  // save the user
  stock.save(function(err) {
    if (err) throw err;

    console.log('Stock successfully updated!');
  });

});

// Find and updated

// find the stock starlord55
// update him to starlord 88
Stock.findOneAndUpdate({ username: 'starlord55' }, { username: 'starlord88' }, function(err, stock) {
  if (err) throw err;

  // we have the updated user returned to us
  console.log(stock);
});

// Find by ID and update

// find the stock with id 4
// update username to starlord 88
Stock.findByIdAndUpdate(4, { username: 'starlord88' }, function(err, stock) {
  if (err) throw err;

  // we have the updated user returned to us
  console.log(stock);
});

// VI - DELETE method

// Get a stock then remove
// get the user starlord55
Stock.find({ username: 'starlord55' }, function(err, stock) {
  if (err) throw err;

  // delete him
  stock.remove(function(err) {
    if (err) throw err;

    console.log('Stock successfully deleted!');
  });
});

// Find and remove

// find the stock with id 4
Stock.findOneAndRemove({ username: 'starlord55' }, function(err) {
  if (err) throw err;

  // we have deleted the user
  console.log('Stock deleted!');
});

// Find by ID and remove

// find the user with id 4
Stock.findByIdAndRemove(4, function(err) {
  if (err) throw err;

  // we have deleted the stock
  console.log('Stock deleted!');
});
