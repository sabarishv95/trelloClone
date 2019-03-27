import React, { Component } from 'react'
import axios from 'axios'
import './Boards.scss'
import AppContext from '../App.context'

export default class Boards extends Component {
    constructor(props) {
        super(props)
        this.state = {
            boards: []
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

    render() {
        return (
            <div className="container-fluid boards-wrapper">
                <h5 className="text-center pt-5">Personal Boards</h5>
                <div className="boards-list container mt-5">
                    <div className="row board-container">
                        {this.state.boards.length > 0 && this.state.boards.map(board =>
                            <div key={board._id} className="board-item nav-link p-0 col-md-2 mr-3 mb-3" onClick={() => this.goToBoard(board._id)}>
                                <p className="m-0">{board.name}</p>
                            </div>
                        )}
                        <div className="board-item col-md-2">
                            <p className="m-0">create new board...</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}