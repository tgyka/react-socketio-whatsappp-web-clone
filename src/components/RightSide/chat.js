import React, { Component } from "react";
import { ChatList, MessageList } from "react-chat-elements";
import { format, render, cancel, register } from "timeago.js";

export default class Chat extends Component {
  render() {
    return (
      <MessageList
        className="message-list"
        lockable={true}
        toBottomHeight={"100%"}
        dataSource={this.props.conversations
          .find(el => el._id == this.props.target._id)
          .messages.map(con => {
            return {
              type: "text",
              text: con.message,
              position: con.position,
              dateString: format(con.date)
            };
          })}
      />
    );
  }
}
