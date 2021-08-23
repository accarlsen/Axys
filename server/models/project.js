const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    name: String,
    description: String,
    date: String,
    estimatedTime: Number,
    usedTime: Number,
    authorId: String,
    clockifyId: String,
});
module.exports = mongoose.model('Project', projectSchema);