import React, { Component } from "react";
import "./Comments.scss";
import axios from "axios";
import AppContext from "../../../../App.context";
import Textarea from 'react-textarea-autosize';

export default class Comments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      commentBody: "",
    };
  }

  static contextType = AppContext;

  handleChange(e) {
    e.persist();
    this.setState({
      [e.target.id]: e.target.value
    });
  }

  createComment(e) {
    axios
      .post(
        `/comment/createComment`,
        { body: this.state.commentBody, card: this.props.cardId },
        {
          header: {
            "content-type": "application/json"
          }
        }
      )
      .then(response => {
        this.setState(
          prevState => {
            return {
              commentBody: ""
            };
          },
          () => {
            axios
              .get(
                `/board/findBoard/${this.props.boardId}`,
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
        );
      });
  }

  render() {
    const { comment, index } = this.props;
    return (
      <div className="comments-wrapper">
        {(index === 0 || comment.length === 0) && (
          <div className="col-md-12 px-0 py-1 add-comment">
            {
              <div className="comment-form">
                <h5 className="my-3 mx-0 font-weight-bold">Add Comment</h5>
                <Textarea
                  id="commentBody"
                  className="comment-title"
                  placeholder="Enter comment body ..."
                  value={this.state.commentBody}
                  onChange={this.handleChange.bind(this)}
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
            <div className="comment mt-2 px-2">
              <p className="m-0">{comment.body}</p>
            </div>
          </React.Fragment>
        )}
      </div>
    );
  }
}
