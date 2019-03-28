import React, { Component } from "react";
import "./Comments.scss";
import axios from 'axios'
import AppContext from '../../../../App.context'

export default class Comments extends Component {
    constructor(props) {
        super(props)
        this.state = {
            createComment: false,
            commentBody: '',
        }
    }

    static contextType = AppContext;

    handleChange(e) {
        e.persist();
        this.setState({
                [e.target.id]: e.target.value
        });
    }

    createComment(e) {
        e.persist();
        e.stopPropagation();
        axios.post(`http://localhost:4000/comment/createComment`, { body: this.state.commentBody, card: this.props.cardId }, {
            header: {
                "content-type": "application/json"
            }
        }).then(response => {
            console.log(response);
            this.setState(prevState => {
                return {
                    createComment: false,
                    commentBody: ''
                }
            }, () => {
                axios.get(`http://localhost:4000/board/findBoard/${this.props.boardId}`, {
                    header: {
                        "content-type": "application/json"
                    }
                }).then(response => {
                    this.context.manageBoard(response.data)
                });
            });
        });
    }

    addComment(e) {
        e.stopPropagation();
        this.setState(prevState => {
            return { createComment: !prevState.createComment }
        })
    }

    render() {
        const { comment, index, commentsLength } = this.props;
        return (
            <div className="comments-wrapper">
                {comment.length !== 0 && <div className="comment mt-2 px-2">
                    <p className="m-0">{comment.body}</p>
                </div>}
                {index === commentsLength - 1 && (
                    <div className="col-md-12 px-0 py-1 add-comment">
                        {!this.state.createComment && <p className="m-0" onClick={this.addComment.bind(this)}>
                            <i className="fas fa-plus" />
                            <span>Add Comment</span>
                        </p>}
                        {this.state.createComment && <div className="mt-3 comment-form">
                            <input type="text" id="commentBody" className="comment-title" placeholder="Enter comment body" value={this.state.commentBody} onChange={this.handleChange.bind(this)} onClick={ e => e.stopPropagation()} autoFocus={true}></input>
                            <div>
                                <button className="btn btn-success mt-2" onClick={this.createComment.bind(this)} disabled={this.state.commentBody === '' ? true : false}>Add comment</button>
                                <i className="mt-2 fas fa-times" onClick={this.addComment.bind(this)}></i>
                            </div>
                        </div>}
                    </div>
                )}
            </div>
        );
    }
}