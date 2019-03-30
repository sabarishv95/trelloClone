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
    currentBoard: null,
    createCard: null
  };
  static contextType = AppContext;

  manageBoard(data) {
    if (typeof data === 'object' && data) {
      this.setState({
        currentBoard: data,
        createCard: null
      });
    }
    else {
      this.setState({ createCard: data })
    }
  }

  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <AppContext.Provider
            value={{
              currentBoard: this.state.currentBoard,
              manageBoard: this.manageBoard.bind(this),
              createCard: this.state.createCard
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
