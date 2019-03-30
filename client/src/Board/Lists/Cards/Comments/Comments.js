import React, { Component } from "react";
import "./Comments.scss";
import AppContext from "../../../../App.context";
import Textarea from "react-textarea-autosize";
import Common from "../../../../Common";
import classnames from "classnames";

export default class Comments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      commentBody: "",
      editComment: this.props.comment.body,
      saveComment: false,
      deleteComment: false
    };
    this.common = new Common();
  }

  static contextType = AppContext;

  createComment() {
    this.setState({ commentBody: "" });
    this.common
      .post(`/comment/createComment`, {
        body: this.state.commentBody,
        card: this.props.cardId
      })
      .then(response => {
        this.common
          .get(`/board/findBoard/${this.props.boardId}`)
          .then(response => {
            this.context.manageBoard(response.data);
          });
      });
  }

  updateComment() {
    this.common
      .put(`/comment/updateComment/${this.props.comment._id}`, {
        body: this.state.editComment
      })
      .then(response => {
        this.common
          .get(`/board/findBoard/${this.props.boardId}`)
          .then(response => {
            this.context.manageBoard(response.data);
            this.setState({ saveComment: false });
          });
      });
  }

  deleteComment() {
    this.common
      .delete(
        `/comment/deleteComment/${this.props.comment._id}/${this.props.cardId}`
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
    const { comment, index } = this.props;
    return (
      <div className="comments-wrapper pb-2">
        {(index === 0 || comment.length === 0) && (
          <div className="col-md-12 px-0 py-1 add-comment">
            {
              <div className="comment-form">
                <h5 className="my-3 mx-0 font-weight-bold">Add Comment</h5>
                <Textarea
                  id="commentBody"
                  name="commentBody"                  
                  className="comment-title"
                  placeholder="Enter comment body ..."
                  value={this.state.commentBody}
                  onChange={this.common.handleChange.bind(this)}
                />
                <div>
                  <button
                    className="btn btn-success mt-2"
                    onClick={this.createComment.bind(this)}
                    disabled={this.state.commentBody === "" ? true : false}
                  >
                    Save
                  </button>
                </div>
              </div>
            }
          </div>
        )}
        {comment.length !== 0 && (
          <React.Fragment>
            {comment.length !== 0 && index === 0 && (
              <h5 className="activity my-3 mx-0 font-weight-bold">Activity</h5>
            )}
            <div className="comment my-2 py-2 px-0">
              {!this.state.saveComment && (
                <span className="m-0 p-2">{comment.body}</span>
              )}
              {this.state.saveComment && (
                <Textarea
                  className={classnames({
                    "m-0 p-2 edit-comment": true,
                    focus: this.state.saveComment
                  })}
                  id="editComment"
                  name="editComment"
                  value={this.state.editComment}
                  onChange={this.common.handleChange.bind(this)}
                />
              )}
            </div>
            {this.state.saveComment && (
              <div className="comments-btn-wrapper my-2">
                <button
                  className="btn btn-success"
                  onClick={this.updateComment.bind(this)}
                  disabled={this.state.editComment === "" ? true : false}
                >
                  Save
                </button>
                <i
                  className="fas fa-times ml-3"
                  onClick={() =>
                    this.setState({
                      saveComment: false,
                      cancelSave: true,
                      editComment: comment.body
                    })
                  }
                />
              </div>
            )}
            <div className="comment-actions">
              <span
                className="mr-1"
                onClick={() => this.setState({ saveComment: true })}
              >
                Edit
              </span>
              <span className="mr-1">-</span>
              <span
                className="mr-1"
                onClick={() => this.setState({ deleteComment: true })}
              >
                Delete
              </span>
            </div>
          </React.Fragment>
        )}
        {this.state.deleteComment && (
          <div className="delete-comment-confirmation row">
            <div className="col-12 delete-header mb-3 p-2">
              <p className="m-0 font-weight-light">Delete Comment?</p>
              <i
                className="fas fa-times"
                onClick={() =>
                  this.setState(prevState => {
                    return { deleteComment: !prevState.deleteComment };
                  })
                }
              />
            </div>
            <div className="col-12 mb-3">
              <p className="m-0 delete-content">
                Deleting a comment is forever. There is no undo.
              </p>
            </div>
            <div className="col-12 pb-2">
              <button
                className="btn btn-danger w-100"
                onClick={this.deleteComment.bind(this)}
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}
