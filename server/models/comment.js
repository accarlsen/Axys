const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    text: String,
    authorId: String,
    taskId: String,

    date: String,
    time: String,
    timeStamp: Number,
});
module.exports = mongoose.model('Comment', commentSchema);