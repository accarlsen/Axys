const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mutationTestSchema = new Schema({
    name: String,
    done: Boolean
});
module.exports = mongoose.model('MutationTest', mutationTestSchema);