const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const personSchema = new Schema({
    fname: String,
    lname: String,
    email: String,
    password: String,
    admin: Boolean,
});
module.exports = mongoose.model('Person', personSchema);