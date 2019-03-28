import React, { Component } from 'react'
import axios from 'axios'
import './Boards.scss'
import AppContext from '../App.context'

export default class Boards extends Component {
    constructor(props) {
        super(props)
        this.state = {
            boards: [],
            boardName: ''
        }
        this.goToBoard = this.goToBoard.bind(this)
    }
    static contextType = AppContext;

    componentDidMount() {
        axios.get("http://localhost:4000/board/findAllBoards", {
            header: {
                "content-type": "application/json"
            }
        }).then(response => {
            this.setState({ boards: response.data }, () => {
                console.log(this.state.boards);
            })
        });
    }

    goToBoard(id) {
        axios.get(`http://localhost:4000/board/findBoard/${id}`, {
            header: {
                "content-type": "application/json"
            }
        }).then(response => {
            this.context.manageBoard(response.data)
            this.props.history.push(`/board/${id}`);
        });
    }

    handleChange(e) {
        e.persist();
        this.setState(prevState => {
            return {
                [e.target.id]: e.target.value
            };
        });
    }

    createBoard() {
        axios.post(`http://localhost:4000/board/createBoard`, { name: this.state.boardName }, {
            header: {
                "content-type": "application/json"
            }
        }).then(response => {
            this.setState(prevState => {
                return {
                    boards: [...prevState.boards, response.data]
                }
            }, () => {
                this.context.manageBoard(response.data)
                this.props.history.push(`/board/${response.data._id}`);
            });
        });
    }

    render() {
        return (
            <div className="container-fluid boards-wrapper">
                <h5 className="text-center pt-5">Personal Boards</h5>
                <div className="boards-list container mt-5">
                    <div className="row board-container">
                        {this.state.boards.length > 0 && this.state.boards.map(board =>
                            <div key={board._id} className="board-item nav-link p-0 col-md-2 mr-3 mb-3" onClick={(e) => this.goToBoard(board._id)}>
                                <p className="m-0">{board.name}</p>
                            </div>
                        )}
                        <div className="board-item col-md-2" data-toggle="modal" data-target="#createBoard">
                            <p className="m-0">create new board...</p>
                        </div>
                    </div>
                </div>
                <div className="modal fade" id="createBoard" role="dialog" aria-labelledby="ModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="ModalLabel">Create Board</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form className="create-board-form">
                                    <input type="text" id="boardName" className="board-name" placeholder="Enter board name" value={this.state.boardName} onChange={this.handleChange.bind(this)}></input>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={this.createBoard.bind(this)} data-dismiss="modal">Create board</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}