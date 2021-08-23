const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    name: String,
    done: Boolean,
    progress: Number,
    weight: Number,
    authorId: String,
    parentId: String,
});
module.exports = mongoose.model('Task', taskSchema);