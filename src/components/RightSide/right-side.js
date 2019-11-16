import React, { Component } from "react";
import "../RightSide/right-side.css";
import Chat from "./chat";
import SendMessage from "./send-message";
export default class RightSide extends Component {
  render() {
    var targetname = "";

    if (this.props.target) {
      if (this.props.target.isConversation) targetname = this.props.target.name;
      else targetname = this.props.target.username;
    }

    return (
      <div className="col-md-8 right" style={{ padding: "0px" }}>
        <div className="messageheader">{targetname}</div>
        <div className="messages">
          {this.props.conversations &&
          this.props.target &&
          this.props.target.isConversation ? (
            <div>
              <Chat
                conversations={this.props.conversations}
                target={this.props.target}
              />{" "}
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="sendmessage">
          <SendMessage emitMessage={this.props.emitMessage.bind(this)} />
        </div>
      </div>
    );
  }
}
