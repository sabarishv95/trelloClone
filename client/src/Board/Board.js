import React, { Component } from 'react'
import Lists from './Lists/Lists'
import './Board.scss'
import AppContext from '../App.context'

export default class Board extends Component {
    constructor(props) {
        super(props);
        this.state = {
            board: null
        }
    }
    static contextType = AppContext;

    componentDidMount() {
        this.setState({
            board: this.context.currentBoard ? this.context.currentBoard : JSON.parse(localStorage.getItem('currentBoard'))
        })
    }

    componentWillUnmount() {
        localStorage.clear();
    }

    render() {
        return (
            <div className="container-fluid board-wrapper p-4">
                {this.state.board !== null &&
                    <React.Fragment>
                        <h5 className="board-name">{this.state.board.name}</h5>
                        <div className="board mt-5">
                                {this.state.board.lists.map((list,index) =>
                                    <Lists key={list._id} list={list} index={index} listLength = {this.state.board.lists.length}/>                                    
                                )}
                        </div>
                    </React.Fragment>
                }
            </div>
        )
    }
}