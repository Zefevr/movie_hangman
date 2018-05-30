import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { getGames, joinGame } from '../actions/games'
import { getUsers } from '../actions/users'
import { userId } from '../jwt'
import styled from 'styled-components'

const GameCard = styled.div`
  display: flex;
  flex-direction: column;
  /* width: 250px; */
  justify-content: center;
  align-items: center;
  padding: 1rem;
  margin: 1rem;
  /* border: 1px solid #98dbc6; */
  > button {
    padding: 1rem;
    margin-top: 1rem;
    color: #336b87;
    background-color: #98dbc6;
    font-weight: strong;
    font-size: 1rem;
    border: 1px solid #5bc8ac;
  }
`

const KeyboardWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  margin: 1rem;
  .guess {
    padding: 0.5rem 1rem;
    margin: 0.5rem;
    color: #336b87;
    border: 1px solid #5bc8ac;
    font-size: 1rem;
  }
  .noGuess {
    padding: 0.5rem 1rem;
    margin: 0.5rem;
    color: #336b87;
    background-color: grey;
    border: 1px solid #5bc8ac;
    font-size: 1rem;
  }
`

class GameBoard extends PureComponent {
  static propTypes = {}

  componentWillMount() {
    if (this.props.currentUser) {
      if (this.props.game === null) this.props.getGames()
      if (this.props.users === null) this.props.getUsers()
    }
  }

  handleGuess() {
    console.log('clicked')
    // DO SOMETHING
  }

  renderKeyboard(keyboard) {
    let keysArray = Object.keys(keyboard)
    console.log(keyboard)
    console.log(keysArray)
    return keysArray.map(key => {
      if (keyboard[key] === false) {
        return (
          <div
            key={key}
            className="guess"
            onClick={this.handleGuess.bind(this)}>
            {key}
          </div>
        )
      } else {
        return (
          <div key={key} className="noGuess">
            {key}
          </div>
        )
      }
    })
  }

  joinGame = () => this.props.joinGame(this.props.game.id)

  render() {
    const { game, users, authenticated, userId, currentUser } = this.props

    if (!currentUser) return <Redirect to="/login" />

    if (game === null || users === null) return 'Loading...'
    if (!game) return 'Not found'

    const player = game.players.find(p => p.userId === userId)

    const winner = game.players
      .filter(p => p.symbol === game.winner)
      .map(p => p.userId)[0]

    return (
      <GameCard className="outer-paper">
        <h1>Game #{game.id}</h1>

        <p>Status: {game.status}</p>

        <h1>{game.movie}</h1>

        <KeyboardWrapper>{this.renderKeyboard(game.keyboard)}</KeyboardWrapper>

        {game.status === 'started' &&
          player &&
          player.symbol === game.turn && <div>It's your turn!</div>}

        {game.status === 'pending' &&
          game.players.map(p => p.userId).indexOf(userId) === -1 && (
            <button onClick={this.joinGame}>Join Game</button>
          )}

        {winner && <p>Winner: {users[winner].firstName}</p>}

        <hr />

        {/* {
        game.status !== 'pending' &&
        <Board board={game.board} makeMove={this.makeMove} />
      } */}
      </GameCard>
    )
  }
}

const mapStateToProps = (state, props) => ({
  currentUser: state.currentUser,
  authenticated: state.currentUser !== null,
  userId: state.currentUser && userId(state.currentUser.jwt),
  game: state.games && state.games[props.match.params.id],
  users: state.users
})

export default connect(mapStateToProps, { getGames, getUsers, joinGame })(
  GameBoard
)
