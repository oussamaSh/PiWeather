var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    username: { type: String },
    email: { type: String },
    password: { type: String },
    isTokenValid: { type: Boolean },
    tokenDate: { type: Date},
    accountAdresse: { type: String }
}, { collection: "userCustom" });

module.exports = mongoose.model("User", userSchema);