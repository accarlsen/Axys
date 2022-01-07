const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    name: String,
    description: String,
    createdTimeStamp: Number,
    creatorId: String,
    adminIds: [String],
    memberIds: [String],

    simplifiedTasks: Boolean,
    inviteRequired: Boolean,
    inviteAdminExclusive: Boolean,

});
module.exports = mongoose.model('Project', projectSchema);