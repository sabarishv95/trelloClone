import React, { Component } from 'react'
import './Lists.scss'

class Lists extends Component {
    render() {
        const { list, index, listLength } = this.props;
        console.log(list);
        return (
            <React.Fragment>
                <div className="d-inline-block list mr-3 p-2">
                    <p className="m-0 ml-3">{list.title}</p>
                    {/* {list.cards.map((card,index) =>   
                        <Cards card={card} index={index} cardsLength={list.cards.length}/>
                    )} */}
                </div>
                {index === listLength-1 && <div className="d-inline-block add-list p-2">
                    <p className="m-0"><span> + </span>Add another list</p>
                </div>}
            </React.Fragment>
        )
    }
}

export default Lists;