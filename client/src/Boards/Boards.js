import React, { Component } from "react";
import "./Boards.scss";
import AppContext from "../App.context";
import Common from "../Common";
import * as $ from 'jquery';

export default class Boards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      boards: [],
      boardName: ""
    };
    this.goToBoard = this.goToBoard.bind(this);
    this.common = new Common();
  }
  static contextType = AppContext;

  componentDidMount() {
    this.common.get("/board/findAllBoards").then(response => {
      this.setState({ boards: response.data });
    });
  }

  goToBoard(id) {
    this.common.get(`/board/findBoard/${id}`).then(response => {
      this.context.manageBoard(response.data);
      this.props.history.push(`/board/${id}`);
    });
  }

  createBoard(e) {
    e.persist();
    e.preventDefault();
    this.common
      .post(`/board/createBoard`, { name: this.state.boardName })
      .then(response => {
        this.setState(prevState => {
          return {
            boards: [...prevState.boards, response.data]
          };
        });
        this.context.manageBoard(response.data);
        $('#modal').toggle();
        $('.modal-backdrop').remove();
        this.props.history.push(`/board/${response.data._id}`);
      });
  }

  render() {
    return (
      <div className="container-fluid boards-wrapper">
        <h5 className="text-center pt-5">Personal Boards</h5>
        <div className="boards-list container mt-5">
          <div className="row board-container">
            {this.state.boards.length > 0 &&
              this.state.boards.map(board => (
                <div
                  key={board._id}
                  className="board-item nav-link p-0 col-md-2 mr-3 mb-3"
                  onClick={e => this.goToBoard(board._id)}
                >
                  <p className="m-0">{board.name}</p>
                </div>
              ))}
            <div
              className="board-item col-md-2 mr-3"
              data-toggle="modal"
              data-target="#createBoard"
            >
              <p className="m-0">create new board...</p>
            </div>
          </div>
        </div>
        <div
          className="modal fade hide"
          id="createBoard"
          role="dialog"
          aria-labelledby="ModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="ModalLabel">
                  Create Board
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form className="create-board-form" onSubmit={this.createBoard.bind(this)}>
                  <input
                    type="text"
                    id="boardName"
                    name="boardName"
                    className="board-name"
                    placeholder="Enter board name"
                    value={this.state.boardName}
                    onChange={this.common.handleChange.bind(this)}
                    autoComplete='off'
                  />
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={this.createBoard.bind(this)}
                  data-dismiss="modal"
                >
                  Create board
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
