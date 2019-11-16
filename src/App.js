import React, { Component } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-chat-elements/dist/main.css";
import { ChatList } from "react-chat-elements";
import { MessageList } from "react-chat-elements";
import RightSide from "./components/RightSide/right-side";
import LeftSide from "./components/LeftSide/left-side";
import io from "socket.io-client";

export default class App extends Component {
  socket = null;
  SOCKET_URL = "http://localhost:7000";
  state = {
    receivedatafromdb: null,
    username: null,
    conversations: [],
    target: null,
    user: null,
    userlist: null,
    islogin: false,
    showlist: 1
  };

  componentDidMount() {
    this.socket = io(this.SOCKET_URL);

    this.socket.on("message", this.onMessage.bind(this));
    this.socket.on("receivedatafromdb", this.onReceiveDataFromDb.bind(this));
    this.socket.on("newconversation", this.onNewConversation.bind(this));
  }

  checkLogin() {
    this.socket.emit("login", this.state.username);
    this.setState({ islogin: true });
  }

  onReceiveDataFromDb(e) {
    this.setState({ userlist: e.userlist });
    this.setState({ user: e.user });

    var conversations = e.conversations;
    if (e.messages)
      e.messages.forEach(mes => {
        if (mes.to == this.state.user._id) mes.position = "right";
        else mes.position = "left";
        conversations
          .filter(conversation => conversation._id == mes.conversationId)
          .map((con, i) => {
            if (!con.unread) con.unread = 0;

            if (con.messages) con.messages.push(mes);
            else {
              con.messages = [];
              con.messages.push(mes);
            }

            con.name = this.findUsername(con);
          });
      });
    this.setState({ conversations: conversations });

    if (this.state.conversations) this.setShowlist(0);
    else this.setShowlist(1);
    this.setState({ islogin: true });
  }

  setTarget(e) {
    this.setState({ target: e.target }, () => {
      if (e.target.isConversation) {
        var con = this.state.conversations;

        if (con && this.state.target) {
          con.find(el => el._id == this.state.target._id).unread = 0;
        }
        this.setState({ conversations: con });
      }
    });
  }

  emitMessage(e) {
    this.setState({ messagetext: null });
    let message = {
      to: this.state.user._id,
      conversation: this.state.target,
      message: e,
      date: new Date()
    };

    this.socket.emit("message", message);
  }

  onNewConversation(e) {
    var mes = e.message;
    var con = e.conversation;
    if (mes.to == this.state.user._id) mes.position = "right";
    else mes.position = "left";

    if (con.unread) con.unread += 1;
    else con.unread = 1;

    if (con.messages) con.messages.push(mes);
    else {
      con.messages = [];
      con.messages.push(mes);
    }

    con.name = this.findUsername(con);

    if (!this.state.conversations) this.setState({ conversations: [] });
    this.setState({
      conversations: this.state.conversations.concat(con),
      showlist: 0
    });
  }

  onMessage(e) {
    if (e.to == this.state.user._id) e.position = "right";
    else e.position = "left";

    var conversations = this.state.conversations;

    conversations
      .filter(conversation => conversation._id == e.conversation._id)
      .map(con => {
        if (con.unread) con.unread += 1;
        else con.unread = 1;

        if (con.messages) con.messages.push(e);
        else {
          con.messages = [];
          con.messages.push(e);
        }
      });
    this.setState({ conversations: conversations });
  }

  addGroup() {}

  findUsername(e) {
    if (e.userIds.length == 2) {
      var userId = e.userIds.filter(el => el !== this.state.user._id)[0];
      if (this.state.userlist.find(el => el._id == userId))
        return this.state.userlist.find(el => el._id == userId).username;
      else return "new user";
    }
  }
  setShowlist(e) {
    this.setState({ showlist: e });
  }

  render() {
    return (
      <div>
        {this.state.islogin ? (
          <div className="row " style={{ margin: "0px" }}>
            <LeftSide
              conversations={this.state.conversations}
              user={this.state.user}
              setTarget={this.setTarget.bind(this)}
              userlist={this.state.userlist}
              showlist={this.state.showlist}
              setShowlist={this.setShowlist.bind(this)}
            />

            <RightSide
              conversations={this.state.conversations}
              target={this.state.target}
              emitMessage={this.emitMessage.bind(this)}
            />
          </div>
        ) : (
          <div className="loginpage">
            <center>
              <input
                type="text"
                className="form-control buttoninput"
                onChange={e => this.setState({ username: e.target.value })}
                onKeyPress={e => {
                  if (e.key == "Enter") this.checkLogin();
                }}
                id="message"
                placeholder="Type username"
                style={{
                  height: "10vh",
                  background: "transparent",
                  border: "transparent",
                  textAlign: "center",
                  fontSize: "larger"
                }}
              />
            </center>
          </div>
        )}
      </div>
    );
  }
}
