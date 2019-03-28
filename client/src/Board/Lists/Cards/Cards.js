import React, { Component } from "react";
import "./Cards.scss";
import Comments from './Comments/Comments'
import axios from 'axios'
import AppContext from '../../../App.context'
import * as $ from 'jquery'

export default class Cards extends Component {
    constructor(props) {
        super(props)
        this.state = {
            createCard: false,
            cardTitle: '',
            cardDescription: ''
        }
        this.collapse = this.collapse.bind(this)
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

    createCard() {
        axios.post(`http://localhost:4000/card/createCard`, { title: this.state.cardTitle, description: this.state.cardDescription, list: this.props.listId }, {
            header: {
                "content-type": "application/json"
            }
        }).then(response => {
            console.log(response);
            this.setState(prevState => {
                return {
                    cardTitle: '',
                    cardDescription: '',
                    createCard: false
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

    collapse(id) {
        $(`#${id}`).toggle('fast');
    }

    render() {
        const { card, index, cardsLength, boardId } = this.props;
        return (
            <React.Fragment>
                {card.length !== 0 && <div className="card-wrapper row m-0">
                    <div
                        className="col-md-12 p-2 card mb-2"
                        onClick={() => this.collapse(`card${card._id}`)}
                    >
                        <p className="m-0">{card.title}</p>
                        <p className="m-0">{card.description}</p>
                        <div id={`card${card._id}`} className="collapse mt-2 py-0 comments" onMouseEnter={($event) => { $event.stopPropagation() }}>
                            {card.comments.length !== 0 && card.comments.map((comment, index) =>
                                <Comments key={comment._id} comment={comment} index={index} commentsLength={card.comments.length} boardId={boardId} cardId={card._id}/>
                            )}
                            {card.comments.length === 0 &&
                                <Comments key={card._id} comment={card.comments} index={-1} commentsLength={card.comments.length} boardId={boardId} cardId={card._id}/>
                            }
                        </div>
                    </div>
                </div>}
                {index === cardsLength - 1 && (
                    <div className="col-md-12 px-0 py-1 add-card">
                        {!this.state.createCard && <p className="m-0" onClick={() => this.setState((prevState) => { return { createCard: !prevState.createCard } })}>
                            <i className="fas fa-plus" />
                            <span>Add card</span>
                        </p>}
                        {this.state.createCard && <div className="mt-3 card-form">
                            <input type="text" id="cardTitle" className="card-title d-block" placeholder="Enter card title" value={this.state.cardTitle} onChange={this.handleChange.bind(this)}></input>
                            <input type="text" id="cardDescription" className="card-description d-block" placeholder="Enter card description" value={this.state.cardDescription} onChange={this.handleChange.bind(this)}></input>
                            <div>
                                <button className="btn btn-success mt-2" onClick={this.createCard.bind(this)} disabled={this.state.cardTitle === '' &&  this.state.cardDescription === '' ? true : false}>Add another card</button>
                                <i className="mt-2 fas fa-times" onClick={() => this.setState((prevState) => { return { createCard: !prevState.createCard } })}></i>
                            </div>
                        </div>}
                    </div>
                )}
            </React.Fragment>
        );
    }
}