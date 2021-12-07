const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const personSchema = new Schema({
    fname: String,
    lname: String,
    name: String,
    email: String,
    password: String,
    admin: Boolean,
    friendIds: [String],
});
module.exports = mongoose.model('Person', personSchema);