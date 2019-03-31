import React, { Component } from "react";
import "./Lists.scss";
import Cards from "./Cards/Cards";
import AppContext from "../../App.context";
import Common from "../../Common";
import { DropTarget } from "react-dnd";

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    hovered: monitor.isOver(),
    source: monitor.getItem()
  };
}

class Lists extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createList: false,
      editList: false,
      moveAllCards: false,
      listTitle: "",
      cardTitle: ""
    };
    this.deleteList = this.deleteList.bind(this);
    this.moveAllCards = this.moveAllCards.bind(this);
    this.moveCard = this.moveCard.bind(this);
    this.common = new Common();
  }

  static contextType = AppContext;

  createList(e) {
    e.persist();
    e.preventDefault();
    this.common
      .post(`/list/createList`, {
        title: this.state.listTitle,
        board: this.props.boardId
      })
      .then(response => {
        this.common
          .get(`/board/findBoard/${this.props.boardId}`)
          .then(response => {
            this.context.manageBoard(response.data);
          });
      });
  }

  deleteList(id) {
    this.common
      .delete(`/list/deleteList/${id}/${this.props.boardId}`)
      .then(response => {
        this.common
          .get(`/board/findBoard/${this.props.boardId}`)
          .then(response => {
            this.context.manageBoard(response.data);
          });
      });
  }

  moveAllCards(id) {
    this.common
      .put(`/card/moveAllCards/${this.props.list._id}/${id}`)
      .then(response => {
        this.common
          .get(`/board/findBoard/${this.props.boardId}`)
          .then(response => {
            this.context.manageBoard(response.data);
            this.setState({ moveAllCards: false, editList: false });
          });
      });
  }

  moveCard(card, listId) {
    // drop()
    this.common
      .put(`/card/moveCard/${card._id}/${card.list}/${listId}`)
      .then(response => {
        this.common
          .get(`/board/findBoard/${this.props.boardId}`)
          .then(response => {
            this.context.manageBoard(response.data);
          });
      });
  }

  createCard(e) {
    e.persist();
    e.preventDefault();
    this.common
      .post(`/card/createCard/`, {
        title: this.state.cardTitle,
        list: this.props.list._id
      })
      .then(response => {
        this.common
          .get(`/board/findBoard/${this.props.boardId}`)
          .then(response => {
            this.context.manageBoard(response.data);
            this.setState({ cardTitle: "" });
          });
      });
  }

  render() {
    const {
      list,
      index,
      listLength,
      boardId,
      connectDropTarget,
      hovered,
      source
    } = this.props;
    return connectDropTarget(
      <div>
        {list.length !== 0 && (
          <div className="d-inline-block list mr-3 p-2">
            <div className="list-title-wrapper">
              <p className="m-0 ml-3 m-0 list-title">{list.title}</p>
              <i
                className="fa fa-ellipsis-h"
                onClick={() => {
                  this.setState(prevState => {
                    return {
                      editList: !prevState.editList,
                      moveAllCards: false
                    };
                  });
                }}
              />
            </div>
            {this.state.editList && (
              <div className="list-actions-wrapper">
                <div className="list-actions-header">
                  {!this.state.moveAllCards && (
                    <p className="font-weight-bold ml-2 mr-0 my-0 py-2 list-actions-heading">
                      List Actions
                    </p>
                  )}
                  {this.state.moveAllCards && (
                    <React.Fragment>
                      <i
                        className="fas fa-arrow-left ml-2"
                        onClick={() =>
                          this.setState(prevState => {
                            return { moveAllCards: !prevState.moveAllCards };
                          })
                        }
                      />
                      <p className="font-weight-bold ml-2 mr-0 my-0 py-2 list-actions-heading">
                        Move all cards
                      </p>
                    </React.Fragment>
                  )}
                  <i
                    className="mr-2 fas fa-times"
                    onClick={() =>
                      this.setState(prevState => {
                        return {
                          editList: !prevState.editList,
                          moveAllCards: !prevState.moveAllCards
                        };
                      })
                    }
                  />
                </div>
                {!this.state.moveAllCards && (
                  <div className="list-actions">
                    <p
                      className="ml-2 mb-1 mt-1 font-weight-normal"
                      onClick={() => {
                        this.context.manageBoard(list._id);
                        this.setState(prevState => {
                          return { editList: !prevState.editList };
                        });
                      }}
                    >
                      Add Card ...
                    </p>
                    {list.cards.length !== 0 && (
                      <p
                        className="ml-2 mb-1 mt-1 font-weight-normal"
                        onClick={() => {
                          this.setState(prevState => {
                            return { moveAllCards: !prevState.moveAllCards };
                          });
                        }}
                      >
                        Move all cards in this list
                      </p>
                    )}
                    <p
                      className="ml-2 mb-1 font-weight-normal"
                      onClick={() => this.deleteList(list._id)}
                    >
                      Delete list ...
                    </p>
                  </div>
                )}
                {this.state.moveAllCards && (
                  <div className="all-lists">
                    {this.context.currentBoard.lists.map(list => {
                      return (
                        <React.Fragment key={list._id}>
                          {list._id === this.props.list._id && (
                            <button
                              className="p-2 current-list"
                              disabled={true}
                              value={`${list._id} (current)`}
                            >
                              {list.title}
                            </button>
                          )}
                          {list._id !== this.props.list._id && (
                            <button
                              className="p-2"
                              onClick={() => this.moveAllCards(list._id)}
                            >
                              {list.title}
                            </button>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
            {list.cards.length !== 0 &&
              list.cards.map((card, index) => (
                <Cards
                  key={card._id}
                  card={card}
                  boardId={boardId}
                  listId={list._id}
                  handleDrop={(card, listId) => this.moveCard(card, listId)}
                />
              ))}
            {list.cards.length === 0 && (
              <Cards
                key={list._id}
                card={list.cards}
                boardId={boardId}
                listId={list._id}
                handleDrop={(card, listId) => this.moveCard(card, listId)}
              />
            )}
            {hovered && source.list !== list._id && (
              <div className="hovered col-md-12 px-0 py-1 mt-2" />
            )}
            <div className="col-md-12 px-0 py-1 add-card">
              {this.context.createCard !== list._id && (
                <p
                  className="m-0"
                  onClick={() => {
                    this.context.manageBoard(list._id);
                    this.setState({ cardTitle: "", editList: false });
                  }}
                >
                  <i className="fas fa-plus" />
                  <span>Add another card</span>
                </p>
              )}
              {this.context.createCard === list._id && (
                <form className="mt-3 card-form">
                  <input
                    type="text"
                    id="cardTitle"
                    name="cardTitle"
                    className="card-title d-block"
                    placeholder="Enter card title"
                    value={this.state.cardTitle}
                    onChange={this.common.handleChange.bind(this)}
                    autoFocus={true}
                    autoComplete="off"
                  />
                  <div>
                    <button
                      className="btn btn-success mt-2"
                      onClick={this.createCard.bind(this)}
                      disabled={this.state.cardTitle === "" ? true : false}
                    >
                      Add card
                    </button>
                    <i
                      className="mt-2 fas fa-times"
                      onClick={() => this.context.manageBoard(null)}
                    />
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
        {(index === listLength - 1) && (
          <div
            className="d-inline-block add-list p-2"
            onClick={() =>
              this.setState(prevState => {
                return { createList: !prevState.createList, listTitle: "" };
              })
            }
          >
            {!this.state.createList && listLength !== 0 && (
              <p className="m-0">
                <span> + </span>Add a list
              </p>
            )}
            {(this.state.createList || listLength === 0) && (
              <form className="mt-3 list-form">
                <input
                  type="text"
                  id="listTitle"
                  name="listTitle"
                  className="list-title"
                  placeholder="Enter list title"
                  value={this.state.listTitle}
                  onChange={this.common.handleChange.bind(this)}
                  onClick={e => e.stopPropagation()}
                  autoFocus={true}
                  autoComplete="off"
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
                    onClick={e => {
                      e.persist();
                      e.stopPropagation();
                      this.setState(prevState => {
                        return { createList: !prevState.createList };
                      });
                    }}
                  />
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default DropTarget(
  "cards",
  {
    drop({ list }) {
      return { list };
    },
    canDrop({ list }, monitor) {
      return monitor.getItem().list !== list._id;
    }
  },
  collect
)(Lists);
