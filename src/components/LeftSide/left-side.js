import React, { Component } from "react";
import "../LeftSide/left-side.css";
import Dropdown from "react-bootstrap/Dropdown";
import ConversationList from "./conversation-list";
import UserList from "./user-list";
import CreateNewGroup from "./create-new-group";

export default class LeftSide extends Component {
  state = {
    conversations: []
  };

  searchfilter(e) {
    var con = this.props.conversations;
    this.setState(
      { conversations: con.filter(con => con.name.includes(e)) },
      () => {
        console.log(this.state.conversations);
      }
    );
  }

  render() {
    var conversations;
    var username = "";
    if (this.props.user) username = this.props.user.username;
    if (this.props.showlist == 0 && this.props.conversations)
      conversations = (
        <ConversationList
          conversations={this.props.conversations}
          setTarget={this.props.setTarget}
        />
      );
    else if (
      this.props.showlist == 1 &&
      this.props.userlist &&
      this.props.user
    ) {
      conversations = (
        <UserList
          userlist={this.props.userlist}
          setTarget={this.props.setTarget}
          user={this.props.user}
        />
      );
    } else if (this.props.showlist == 2 && this.props.userlist)
      conversations = <CreateNewGroup />;

    return (
      <div className="col-md-4 left" style={{ padding: "0px" }}>
        <div className="header">
          {username}
          <Dropdown>
            <Dropdown.Toggle
              style={{ background: "transparent", border: "transparent" }}
              id="dropdown-basic"
            ></Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={e => this.props.setShowlist(0)}>
                Conversation List
              </Dropdown.Item>

              <Dropdown.Item onClick={e => this.props.setShowlist(1)}>
                Userlist
              </Dropdown.Item>
              <Dropdown.Item onClick={e => this.props.setShowlist(2)}>
                Create New Group
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div className="search">
          <input
            type="text"
            className="form-control buttoninput"
            onChange={e => this.searchfilter(e.target.value)}
            id="message"
            placeholder="Search..."
            style={{
              width: "100vh",
              height: "10vh",
              background: "transparent",
              border: "transparent",
              fontSize: "large"
            }}
          />
        </div>
        <div className="conversations">{conversations}</div>
      </div>
    );
  }
}
