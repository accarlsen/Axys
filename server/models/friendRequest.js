const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const friendRequestSchema = new Schema({
    senderId: String,
    recieverId: String,
    answer: Boolean,
    valid: Boolean,
});
module.exports = mongoose.model('FriendRequest', friendRequestSchema);