import React, { Component } from "react";
import { ChatList } from "react-chat-elements";
import { format, render, cancel, register } from "timeago.js";

export default class ConversationList extends Component {
  render() {
    return (
      <ChatList
        className="chat-list"
        dataSource={this.props.conversations
          .sort((a, b) => {
            return (
              new Date(b.messages[b.messages.length - 1].date) -
              new Date(a.messages[a.messages.length - 1].date)
            );
          })
          .map(con => {
            con.isConversation = true;
            if (!con.name) con.name = "";

            return {
              avatar: "",
              alt: con.name,
              title: con.name,
              subtitle: con.messages[con.messages.length - 1].message,
              dateString: format(con.messages[con.messages.length - 1].date),
              unread: con.unread,
              target: con
            };
          })}
        onClick={this.props.setTarget}
      />
    );
  }
}
