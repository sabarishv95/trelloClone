import React, { Component } from "react";
import Lists from "./Lists/Lists";
import "./Board.scss";
import AppContext from "../App.context";
import axios from "axios";

export default class Board extends Component {
  static contextType = AppContext;

  componentDidMount() {
    if (!this.context.currentBoard) {
      axios
        .get(
          `/board/findBoard/${this.props.match.params.id}`,
          {
            header: {
              "content-type": "application/json"
            }
          }
        )
        .then(response => {
          this.context.manageBoard(response.data);
        });
    }
  }

  render() {
    return (
      <div className="container-fluid board-wrapper p-4">
        {this.context.currentBoard !== null && (
          <React.Fragment>
            <h5 className="board-name">{this.context.currentBoard.name}</h5>
            <div className="board mt-3">
              {this.context.currentBoard.lists.length !== 0 &&
                this.context.currentBoard.lists.map((list, index) => (
                  <div className="list-wrapper" key={list._id}>
                    <Lists
                      list={list}
                      index={index}
                      listLength={this.context.currentBoard.lists.length}
                      boardId={this.props.match.params.id}
                    />
                  </div>
                ))}
              {this.context.currentBoard.lists.length === 0 && (
                <div
                  className="list-wrapper"
                  key={this.context.currentBoard._id}
                >
                  <Lists
                    list={this.context.currentBoard.lists}
                    index={-1}
                    listLength={this.context.currentBoard.lists.length}
                    boardId={this.props.match.params.id}
                  />
                </div>
              )}
            </div>
          </React.Fragment>
        )}
      </div>
    );
  }
}
