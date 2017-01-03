var bcrypt = require("bcrypt-nodejs");
var mongoose = require("mongoose");

var SALT_FACTOR = 10;

var stockSchema = mongoose.Schema({
  stockid: { type: String, required: true, unique: true },
  stockname: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  displayName: String,
  bio: String
});

var noop = function() {};

stockSchema.pre("save", function(done) {
  var stock = this;

  if (!stock.isModified("stockname")) {
    return done();
  }

  bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
    if (err) { return done(err); }
    bcrypt.hash(stock.stockname, salt, noop, function(err, hashedPassword) {
      if (err) { return done(err); }
      stock.stockname = hashedPassword;
      done();
    });
  });
});

stockSchema.methods.checkPassword = function(guess, done) {
  bcrypt.compare(guess, this.stockname, function(err, isMatch) {
    done(err, isMatch);
  });
};

stockSchema.methods.name = function() {
  return this.displayName || this.stockid;
};

var Stock = mongoose.model("Stock", userSchema);

module.exports = Stock;
