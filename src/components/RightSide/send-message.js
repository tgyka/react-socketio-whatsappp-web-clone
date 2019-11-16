import React, { Component } from "react";
import { ChatList, MessageList } from "react-chat-elements";
import { format, render, cancel, register } from "timeago.js";

export default class SendMessage extends Component {
  state = {
    message: ""
  };

  render() {
    return (
      <input
        type="text"
        className="form-control buttoninput"
        id="message"
        value={this.state.message}
        onChange={e => this.setState({ message: e.target.value })}
        onKeyPress={e => {
          if (e.key == "Enter") {
            this.props.emitMessage(this.state.message);
            this.setState({ message: "" });
          }
        }}
        placeholder="Type message"
        style={{ height: "5vh" }}
      />
    );
  }
}
