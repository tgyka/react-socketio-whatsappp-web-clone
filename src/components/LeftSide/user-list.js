import React, { Component } from "react";
import { ChatList, MessageList } from "react-chat-elements";

export default class UserList extends Component {
  render() {
    return (
      <ChatList
        className="chat-list"
        dataSource={this.props.userlist
          .filter(e => e._id !== this.props.user._id)
          .map(con => {
            con.isConversation = false;
            return {
              avatar: "",
              title: con.username,
              target: con,
              date: null
            };
          })}
        onClick={this.props.setTarget}
      />
    );
  }
}
