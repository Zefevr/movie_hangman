import React, { Component } from 'react'
import './App.css'
import LoginForm from './components/LoginForm'
import SignUpForm from './components/SignUpForm'
import Game from './components/Game'
import GameBoard from './components/GameBoard'
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Link
} from 'react-router-dom'
import styled from 'styled-components'

const Root = styled.div`
  height: 100vh;
  width: 100vw;
  display: grid;
  grid-template-columns: 1fr 10fr 1fr;
  grid-template-rows: 60px 1fr;
  font-family: 'Space Mono', monospace;
`
const AppWrapper = styled.div`
  grid-column-start: 2;
  grid-column-end: 3;
  grid-row-start: 2;
  grid-row-end: 3;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Header = styled.div`
  grid-column-start: 1;
  grid-column-end: 4;
  background-color: #98dbc6;
  color: #336b87;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 2rem;
  padding: 0 2rem;
  border-bottom: 1px solid #5bc8ac;
  > img {
    height: 35px;
  }
  > a,
  a:hover,
  a:active {
    color: #336b87;
    text-decoration: none;
  }
`

class App extends Component {
  render() {
    return (
      <Router>
        <Root>
          <Header>
            <Link to="/">Hangman</Link>
            <img
              src="https://www.themoviedb.org/static_cache/v4/logos/powered-by-rectangle-blue-61ce76f69ce1e4f68a6031d975df16cc184d5f04fa7f9f58ae6412646f2481c1.svg"
              alt=""
            />
          </Header>
          <AppWrapper className="App">
            <Route exact path="/" render={() => <Redirect to="/game" />} />
            <Route exact path="/login" component={LoginForm} />
            <Route exact path="/SignUpForm" component={SignUpForm} />
            <Route exact path="/game" component={Game} />
            <Route exact path="/games/:id" component={GameBoard} />
          </AppWrapper>
        </Root>
      </Router>
    )
  }
}

export default App
