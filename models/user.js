const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
    }   //password and username will be added by passport-local-mongoose automatically
});
UserSchema.plugin(passportLocalMongoose.default); //adds username, hash and salt fields to store the username, the hashed password and the salt value

module.exports = mongoose.model('User', UserSchema);