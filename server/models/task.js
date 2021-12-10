const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    name: String,
    progress: Number,
    weight: Number,
    authorId: String,
    assigneeId: String,
    parentId: String,
    date: String,
    time: String,
    plannedDate: String,

    done: Boolean,
    timestampDone: Number,
    dateDone: String,
    timeDone: String,

    accepted: Boolean,
    timestampAccepted: Number,
    dateAccepted: String,
    timeAccepted: String,

    ignored: Boolean,
    timestampIgnored: Number,
    dateIgnored: String,
    timeIgnored: String,
});
module.exports = mongoose.model('Task', taskSchema);