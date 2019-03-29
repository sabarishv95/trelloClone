import React, { Component } from "react";
import "./Lists.scss";
import Cards from "./Cards/Cards";
import AppContext from "../../App.context";
import Common from '../../Common';

class Lists extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createList: false,
      listTitle: "",
      editList: false
    };
    this.deleteList = this.deleteList.bind(this);
    this.common = new Common()
  }

  static contextType = AppContext;

  createList() {
    this.common.post(`/list/createList`, { title: this.state.listTitle, board: this.props.boardId }).then(response => {
      this.setState({
        listTitle: "",
        createList: false
      }, () => {
        this.common.get(`/board/findBoard/${this.props.boardId}`).then(response => {
          this.context.manageBoard(response.data);
        });
      });
    });
  }

  deleteList(id) {
    this.common.delete(`/list/deleteList/${id}/${this.props.boardId}`).then(response => {
      this.setState({
        editList: false
      }, () => {
        this.common.get(`/board/findBoard/${this.props.boardId}`).then(response => {
          this.context.manageBoard(response.data);
        });
      });
    });
  }

  closeList(e) {
    e.persist();
    e.stopPropagation()
    this.setState(prevState => {
      return { createList: !prevState.createList };
    });
  }

  render() {
    const { list, index, listLength, boardId } = this.props;
    return (
      <React.Fragment>
        {list.length !== 0 && (
          <div className="d-inline-block list mr-3 p-2">
            <div className="list-title-wrapper">
              <p className="m-0 ml-3 m-0 list-title">{list.title}</p>
              <i
                className="fas fa-ellipsis-v"
                onClick={() =>
                  this.setState(prevState => {
                    return { editList: !prevState.editList };
                  })
                }
              />
            </div>
            {this.state.editList && (
              <div className="list-actions-wrapper">
                <div className="list-actions-header">
                  <p className="font-weight-bold ml-2 mr-0 my-0 py-2 list-actions-heading">
                    List Actions
                  </p>
                  <i
                    className="mr-2 fas fa-times"
                    onClick={() =>
                      this.setState(prevState => {
                        return { editList: !prevState.editList };
                      })
                    }
                  />
                </div>
                <div className="list-actions">
                  <p className="ml-2 mb-1 mt-1 font-weight-normal">
                    Add Card ...
                  </p>
                  <p
                    className="ml-2 mb-1 font-weight-normal"
                    onClick={() => this.deleteList(list._id)}
                  >
                    Delete list ...
                  </p>
                </div>
              </div>
            )}
            {list.cards.length !== 0 &&
              list.cards.map((card, index) => (
                <Cards
                  key={card._id}
                  card={card}
                  index={index}
                  cardsLength={list.cards.length}
                  boardId={boardId}
                  listId={list._id}
                />
              ))}
            {list.cards.length === 0 && (
              <Cards
                key={list._id}
                card={list.cards}
                index={-1}
                cardsLength={list.cards.length}
                boardId={boardId}
                listId={list._id}
              />
            )}
          </div>
        )}
        {index === listLength - 1 && (
          <div
            className="d-inline-block add-list p-2"
            onClick={() =>
              this.setState(prevState => {
                return { createList: !prevState.createList };
              })
            }
          >
            {!this.state.createList && (
              <p className="m-0">
                <span> + </span>Add another list
              </p>
            )}
            {this.state.createList && (
              <div className="mt-3 list-form">
                <input
                  type="text"
                  id="listTitle"
                  className="list-title"
                  placeholder="Enter list title"
                  value={this.state.listTitle}
                  onChange={this.common.handleChange.bind(this)}
                  onClick={e => e.stopPropagation()}
                />
                <div>
                  <button
                    className="btn btn-success mt-2"
                    onClick={this.createList.bind(this)}
                    disabled={this.state.listTitle === "" ? true : false}
                  >
                    Add list
                  </button>
                  <i
                    className="mt-2 fas fa-times"
                    onClick={() => this.closeList.bind(this)}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default Lists;
