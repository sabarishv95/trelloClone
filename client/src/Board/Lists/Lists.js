import React, { Component } from 'react'
import './Lists.scss'
import Cards from './Cards/Cards'
import axios from 'axios'
import AppContext from '../../App.context'


class Lists extends Component {
    constructor(props) {
        super(props)
        this.state = {
            createList: false,
            listTitle: ''
        }
    }

    static contextType = AppContext;

    handleChange(e) {
        e.persist();
        this.setState(prevState => {
            return {
                [e.target.id]: e.target.value
            };
        });
    }

    createList() {
        axios.post(`http://localhost:4000/list/createList`, { title: this.state.listTitle, board: this.props.boardId }, {
            header: {
                "content-type": "application/json"
            }
        }).then(response => {
            console.log(response);
            this.setState(prevState => {
                return {
                    listTitle: '',
                    createList: false
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

    render() {
        const { list, index, listLength, boardId } = this.props;
        return (
            <React.Fragment>
                {list.length !== 0 && <div className="d-inline-block list mr-3 p-2">
                    <p className="m-0 ml-3 mb-2">{list.title}</p>
                    {list.cards.length !== 0 && list.cards.map((card, index) =>
                        <Cards key={card._id} card={card} index={index} cardsLength={list.cards.length} boardId={boardId} listId={list._id}/>
                    )}
                    {list.cards.length === 0 &&
                        <Cards key={list._id} card={list.cards} index={-1} cardsLength={list.cards.length} boardId={boardId} listId={list._id}/>
                    }
                </div>}
                {index === listLength - 1 && <div className="d-inline-block add-list p-2">
                    {!this.state.createList && <p className="m-0" onClick={() => this.setState((prevState) => { return { createList: !prevState.createList } })}><span> + </span>Add another list</p>}
                    {this.state.createList && <div className="mt-3 list-form">
                        <input type="text" id="listTitle" className="list-title" placeholder="Enter list title" value={this.state.listTitle} onChange={this.handleChange.bind(this)}></input>
                        <div>
                            <button className="btn btn-success mt-2" onClick={this.createList.bind(this)} disabled={this.state.listTitle === '' ? true : false}>Add list</button>
                            <i className="mt-2 fas fa-times" onClick={() => this.setState((prevState) => { return { createList: !prevState.createList } })}></i>
                        </div>
                    </div>}
                </div>}
            </React.Fragment>
        )
    }
}

export default Lists;