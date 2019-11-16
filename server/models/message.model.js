const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    message: { type: String, required: true },
    to: { type: String, required: true },
    conversationId: { type: String, required: true },
    date: { type: Date, required: true }
  },
  {
    timestamps: true
  }
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
