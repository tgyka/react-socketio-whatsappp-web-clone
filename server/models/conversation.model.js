const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const conversationSchema = new Schema({
  name: { type: String },
  userIds: [{ type: String, required: true }]
});

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;
