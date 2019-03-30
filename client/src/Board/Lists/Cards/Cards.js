import React, { Component } from "react";
import "./Cards.scss";
import Comments from "./Comments/Comments";
import AppContext from "../../../App.context";
import Textarea from "react-textarea-autosize";
import Common from "../../../Common";
import classnames from "classnames";
import { DragSource } from "react-dnd";

const itemSource = {
  beginDrag(props) {
    return props.card;
  },
  endDrag(props, monitor, component) {
    if (!monitor.didDrop()) {
      return;
    }

    return props.handleDrop(props.card, monitor.getDropResult().list._id);
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  };
}

class Cards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteCard: false,
      saveDescription: false,
      cancelSave: false,
      moveCard: false,
      toList: null,
      cardTitle: "",
      cardDescription: ""
    };

    this.common = new Common();
  }

  static contextType = AppContext;

  createCard() {
    this.common
      .post(`/card/createCard/`, {
        title: this.state.cardTitle,
        list: this.props.listId
      })
      .then(response => {
        this.common
          .get(`/board/findBoard/${this.props.boardId}`)
          .then(response => {
            this.context.manageBoard(response.data);
          });
      });
  }

  updateCard() {
    setTimeout(() => {
      if (this.state.cardTitle && !this.state.cancelSave) {
        this.common
          .put(`/card/updateCard/${this.props.card._id}`, {
            title: this.state.cardTitle,
            description: this.state.cardDescription
          })
          .then(response => {
            this.common
              .get(`/board/findBoard/${this.props.boardId}`)
              .then(response => {
                this.context.manageBoard(response.data);
                this.setState({ saveDescription: false });
              });
          });
      } else if (!this.state.cardTitle || this.state.cancelSave) {
        this.setState({
          cardTitle: this.props.card.title,
          cardDescription: this.props.card.description
            ? this.props.card.description
            : ""
        });
      }
    }, 250);
  }

  deleteCard() {
    this.common
      .delete(`/card/deleteCard/${this.props.card._id}/${this.props.listId}`)
      .then(response => {
        this.common
          .get(`/board/findBoard/${this.props.boardId}`)
          .then(response => {
            this.context.manageBoard(response.data);
          });
      });
  }

  moveCard() {
    this.setState({ moveCard: false });
    this.common
      .put(
        `/card/moveCard/${this.props.card._id}/${this.props.listId}/${
          this.state.toList
        }`
      )
      .then(response => {
        this.common
          .get(`/board/findBoard/${this.props.boardId}`)
          .then(response => {
            this.context.manageBoard(response.data);
          });
      });
  }

  render() {
    const { card, index, cardsLength, boardId, listId, isDragging, connectDragSource } = this.props;
    const opacity = isDragging ? 0 : 1;
    return  connectDragSource(
      <div style={{ opacity }}>
        {card.length !== 0 && (
          <div className="card-wrapper row mt-2 mb-0 mx-0">
            <div
              className="col-md-12 p-2 card"
              data-toggle="modal"
              data-target={`#card${card._id}`}
              onClick={() => {
                this.setState({
                  cardTitle: card.title,
                  cardDescription: card.description,
                  deleteCard: false
                });
                this.context.manageBoard(null);
              }}
            >
              <p className="m-0">{card.title}</p>
            </div>
            <div
              id={`card${card._id}`}
              className="modal fade mt-2 py-0 comments"
            >
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header row m-0">
                    <div className="col-12">
                      <Textarea
                        id="cardTitle"
                        name="cardTitle"
                        className="card-title m-0"
                        value={this.state.cardTitle}
                        onChange={this.common.handleChange.bind(this)}
                        onFocus={() => this.setState({ cancelSave: false })}
                        onBlur={this.updateCard.bind(this)}
                      />
                      <button
                        type="button"
                        className="close"
                        data-dismiss="modal"
                        aria-label="Close"
                      >
                        <i className="fas fa-times" />
                      </button>
                    </div>
                  </div>
                  <div className="modal-body row m-0">
                    <div className="col-12 col-sm-12 col-md-10 card-section">
                      <h5 className="my-3 mx-0 font-weight-bold">
                        Description
                        {card.description && (
                          <small
                            style={{
                              fontSize: "14px",
                              fontWeight: "500",
                              paddingLeft: "10px"
                            }}
                          >
                            (Click on the description to edit)
                          </small>
                        )}
                      </h5>
                      {!this.state.saveDescription && (
                        <p
                          className="m-0 description"
                          onClick={() =>
                            this.setState({
                              saveDescription: true,
                              cancelSave: false
                            })
                          }
                        >
                          {card.description}
                        </p>
                      )}
                      {(this.state.saveDescription ||
                        !this.props.card.description) && (
                        <Textarea
                          autoFocus={true}
                          id="cardDescription"
                          name="cardDescription"
                          className={classnames({
                            "card-description": true,
                            focus: this.state.saveDescription
                          })}
                          placeholder="Add a more detailed description ..."
                          value={this.state.cardDescription}
                          onChange={this.common.handleChange.bind(this)}
                          onFocus={() =>
                            this.setState({ saveDescription: true })
                          }
                          onBlur={this.updateCard.bind(this)}
                        />
                      )}
                      {this.state.saveDescription && (
                        <div className="description-btn-wrapper mt-2">
                          <button
                            className="btn btn-success"
                            onClick={this.updateCard.bind(this)}
                            disabled={
                              !this.state.cardDescription ? true : false
                            }
                          >
                            Save
                          </button>
                          <i
                            className="fas fa-times ml-3"
                            onClick={() =>
                              this.setState({
                                cancelSave: true,
                                saveDescription: false
                              })
                            }
                          />
                        </div>
                      )}
                      {card.comments.length !== 0 &&
                        card.comments.map((comment, index) => (
                          <Comments
                            key={comment._id}
                            comment={comment}
                            index={index}
                            boardId={boardId}
                            cardId={card._id}
                          />
                        ))}
                      {card.comments.length === 0 && (
                        <Comments
                          key={card._id}
                          comment={card.comments}
                          index={-1}
                          boardId={boardId}
                          cardId={card._id}
                        />
                      )}
                    </div>
                    <div className="col-12 col-sm-12 col-md-2 actions-section">
                      <h5 className="font-weight-bold my-3">Actions</h5>
                      <div className="actions-btn-wrapper">
                        <button
                          className="move-btn btn mb-3"
                          onClick={() =>
                            this.setState(prevState => {
                              return {
                                moveCard: !prevState.moveCard,
                                deleteCard: false
                              };
                            })
                          }
                        >
                          Move
                        </button>
                        <button
                          className="delete-btn btn btn-danger"
                          onClick={() =>
                            this.setState(prevState => {
                              return {
                                deleteCard: !prevState.deleteCard,
                                moveCard: false
                              };
                            })
                          }
                        >
                          Delete
                        </button>
                      </div>
                      {this.state.moveCard && (
                        <div className="move-content">
                          <div className="col-12 delete-header mb-3 p-2">
                            <p className="m-0 font-weight-light text-center">
                              Move Card
                            </p>
                            <i
                              className="fas fa-times"
                              onClick={() =>
                                this.setState(prevState => {
                                  return { moveCard: !prevState.moveCard };
                                })
                              }
                            />
                          </div>
                          <div className="col-12 mb-3">
                            <select
                              id="toList"
                              name="toList"
                              onChange={this.common.handleChange.bind(this)}
                            >
                              <option defaultValue="Choose a list">
                                Choose a list
                              </option>
                              {this.context.currentBoard.lists.map(list => (
                                <option key={list._id} value={list._id}>
                                  {list.title}
                                  {list._id !== listId ? null : " (current)"}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="col-12 pb-2">
                            <button
                              className="btn btn-success w-100"
                              data-dismiss="modal"
                              onClick={this.moveCard.bind(this)}
                            >
                              Move
                            </button>
                          </div>
                        </div>
                      )}
                      {this.state.deleteCard && (
                        <div className="delete-confirmation row">
                          <div className="col-12 delete-header mb-3 p-2">
                            <p className="m-0 font-weight-light">
                              Delete Card?
                            </p>
                            <i
                              className="fas fa-times"
                              onClick={() =>
                                this.setState(prevState => {
                                  return { deleteCard: !prevState.deleteCard };
                                })
                              }
                            />
                          </div>
                          <div className="col-12 mb-3">
                            <p className="m-0 delete-content">
                              All actions will be removed from the activity feed
                              and you won’t be able to re-open the card. There
                              is no undo.
                            </p>
                          </div>
                          <div className="col-12 pb-2">
                            <button
                              className="btn btn-danger w-100"
                              data-dismiss="modal"
                              onClick={this.deleteCard.bind(this)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {index === cardsLength - 1 && (
          <div className="col-md-12 px-0 py-1 add-card">
            {this.context.createCard !== listId && (
              <p
                className="m-0"
                onClick={() => {
                  this.context.manageBoard(listId);
                  this.setState({ cardTitle: "" });
                }}
              >
                <i className="fas fa-plus" />
                <span>Add card</span>
              </p>
            )}
            {this.context.createCard === listId && (
              <div className="mt-3 card-form">
                <input
                  type="text"
                  id="cardTitle"
                  name="cardTitle"
                  className="card-title d-block"
                  placeholder="Enter card title"
                  value={this.state.cardTitle}
                  onChange={this.common.handleChange.bind(this)}
                />
                <div>
                  <button
                    className="btn btn-success mt-2"
                    onClick={this.createCard.bind(this)}
                    disabled={this.state.cardTitle === "" ? true : false}
                  >
                    Add another card
                  </button>
                  <i
                    className="mt-2 fas fa-times"
                    onClick={() => this.context.manageBoard(null)}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default DragSource("cards", itemSource, collect)(Cards);
