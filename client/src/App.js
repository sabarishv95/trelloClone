import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Boards from "./Boards/Boards";
import Board from "./Board/Board";
import "./App.scss";
import AppContext from "./App.context";
import "jquery/dist/jquery.min.js";
import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap/dist/css/bootstrap.min.css";

class App extends Component {
  state = {
    currentBoard: null
  };
  static contextType = AppContext;

  manageBoard(board) {
    this.setState({
      currentBoard: board
    });
  }

  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <AppContext.Provider
            value={{
              currentBoard: this.state.currentBoard,
              manageBoard: this.manageBoard.bind(this)
            }}
          >
            <Switch>
              <Route exact path="/" component={Boards} />
              <Route exact path="/board/:id" component={Board} />
            </Switch>
          </AppContext.Provider>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
