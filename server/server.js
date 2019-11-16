const express = require("express");
var app = express();
var server = app.listen(process.env.PORT || 7000);
const mongoose = require("mongoose");
const http = require("http").Server(app);
var io = require("socket.io").listen(server);

require("dotenv").config();

var User = require("./models/user.model");
var Message = require("./models/message.model");
var Conversation = require("./models/conversation.model");

app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true });

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established succesfully");
});

var sockets = [];

io.on("connection", function(socket) {
  console.log("A user connected");

  socket.on("login", data => {
    User.findOne({ username: data }).then(user => {
      if (!user) {
        const newUser = new User({ username: data });

        newUser.save().then(user => {
          emitReceiveDataFromDb(user, socket);
        });
      } else {
        emitReceiveDataFromDb(user, socket);
      }
    });
  });

  socket.on("message", data => {
    if (data.conversation.isConversation) {
      Conversation.findOne({ _id: data.conversation._id }).then(
        conversation => {
          const newMessage = new Message({
            message: data.message,
            to: data.to,
            conversationId: data.conversation,
            date: data.date
          });

          newMessage
            .save()
            .then(() => {
              console.log("message added");
              conversation.userIds.forEach(id => {
                sockets
                  .filter(e => e.userId == id)
                  .forEach(socket => socket.socket.emit("message", data));
              });
            })
            .catch(err => console.log(err));
        }
      );
    } else {
      const newConversation = new Conversation({
        name: null,
        userIds: [data.to, data.conversation._id]
      });

      newConversation
        .save()
        .then(conversation => {
          console.log("conversation added");
          data.conversation = conversation._id;

          const newMessage = new Message({
            message: data.message,
            to: data.to,
            conversationId: conversation._id,
            date: data.date
          });

          newMessage
            .save()
            .then(() => {
              console.log("message added");

              conversation.userIds.forEach(id => {
                sockets
                  .filter(e => e.userId == id)
                  .forEach(socket => {
                    socket.socket.emit("newconversation", {
                      conversation: conversation,
                      message: data
                    });
                  });
              });
            })
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    }
  });

  socket.on("disconnect", () => {});
});

function emitReceiveDataFromDb(user, socket) {
  User.find({})
    .then(users => {
      sockets.push({ userId: user._id, socket: socket });

      Conversation.find({ userIds: user._id }).then(conversations => {
        var conversationId = conversations.map(function(el) {
          return el._id;
        });
        if (conversations.length == 0) {
          socket.emit("receivedatafromdb", {
            conversations: null,
            messages: null,
            userlist: users,
            user: user
          });
        } else {
          Message.find({
            conversationId: { $in: conversationId }
          }).then(messages => {
            socket.emit("receivedatafromdb", {
              conversations: conversations,
              userlist: users,
              user: user,
              messages: messages
            });
          });
        }
      });
    })
    .catch(err => console.log(err));
}
