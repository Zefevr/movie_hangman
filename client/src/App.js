import React, { Component } from 'react'
import './App.css'
import LoginForm from './components/LoginForm'
import Game from './components/Game'
import GameBoard from './components/GameBoard'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Route exact path="/" render={() => <Redirect to="/game" />} />
          <Route exact path="/login" component={LoginForm} />
          <Route exact path="/game" component={Game} />
          <Route exact path="/games/:id" component={GameBoard} />
        </div>
      </Router>
    )
  }
}

export default App
