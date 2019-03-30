import React, { Component } from "react";
import "./Cards.scss";
import Comments from "./Comments/Comments";
import AppContext from "../../../App.context";
import Textarea from "react-textarea-autosize";
import Common from "../../../Common";
import classnames from "classnames";

export default class Cards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createCard: false,
      deleteCard: false,
      saveDescription: false,
      cancelSave: false,
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
        this.setState(
          prevState => {
            return {
              createCard: !prevState.createCard
            };
          },
          () => {
            this.common
              .get(`/board/findBoard/${this.props.boardId}`)
              .then(response => {
                this.context.manageBoard(response.data);
              });
          }
        );
      });
  }

  updateCard() {
    console.log(this.state)
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
              });
          });
      } else if (!this.state.cardTitle || this.state.cancelSave) {
        console.log('not updating', this.props)
        this.setState({
          cardTitle: this.props.card.title,
          cardDescription: this.props.card.description? this.props.card.description : ''
        });
      }
      this.setState({ saveDescription: false });
    }, 100);
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

  render() {
    const { card, index, cardsLength, boardId } = this.props;
    return (
      <React.Fragment>
        {card.length !== 0 && (
          <div className="card-wrapper row mt-2 mb-0 mx-0">
            <div
              className="col-md-12 p-2 card"
              data-toggle="modal"
              data-target={`#card${card._id}`}
              onClick={() =>
                this.setState({
                  cardTitle: card.title,
                  cardDescription: card.description,
                  deleteCard: false
                })
              }
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
                        className="card-title m-0"
                        value={this.state.cardTitle}
                        onChange={this.common.handleChange.bind(this)}
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
                      </h5>
                      <Textarea
                        id="cardDescription"
                        className={classnames({
                          "card-description": true,
                          hasDescription:
                            this.state.cardDescription &&
                            !this.state.saveDescription,
                          focus: this.state.saveDescription
                        })}
                        placeholder="Add a more detailed description ..."
                        value={this.state.cardDescription}
                        onChange={this.common.handleChange.bind(this)}
                        onFocus={() => this.setState({ saveDescription: true })}
                        onBlur={this.updateCard.bind(this)}
                      />
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
                                saveDescription: false,
                                cancelSave: true
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
                        <button className="move-btn btn mb-3">Move</button>
                        <button
                          className="delete-btn btn btn-danger"
                          onClick={() =>
                            this.setState(prevState => {
                              return { deleteCard: !prevState.deleteCard };
                            })
                          }
                        >
                          Delete
                        </button>
                      </div>
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
            {!this.state.createCard && (
              <p
                className="m-0"
                onClick={() =>
                  this.setState(prevState => {
                    return { createCard: !prevState.createCard, cardTitle: "" };
                  })
                }
              >
                <i className="fas fa-plus" />
                <span>Add card</span>
              </p>
            )}
            {this.state.createCard && (
              <div className="mt-3 card-form">
                <input
                  type="text"
                  id="cardTitle"
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
                    onClick={() =>
                      this.setState(prevState => {
                        return { createCard: !prevState.createCard };
                      })
                    }
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
