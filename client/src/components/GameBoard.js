import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { getGames, joinGame, updateGame } from '../actions/games'
import { getUsers } from '../actions/users'
import { userId } from '../jwt'
import styled from 'styled-components'

const GameCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  margin: 1rem;
`

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
    > input {
    padding: 1rem;
    margin: 1rem;
    border: 1px solid #5bc8ac;
  }
}
`

const StatusBox = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  > h1 {
    border: 1px dashed green;
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
    background-color: #98dbc6;
    font-weight: strong;
    font-size: 1rem;
    border: 1px solid #5bc8ac;
  }
  .noGuess {
    padding: 0.5rem 1rem;
    margin: 0.5rem;
    color: #336b87;
    border: 1px solid #5bc8ac;
    font-size: 1rem;
  }
`

const AlertWrapper = styled.div`
  display: flex;
  height: 50px;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  margin: 1rem;
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

class GameBoard extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      guess: ''
    }
  }

  static propTypes = {}

  componentWillMount() {
    if (this.props.currentUser) {
      if (this.props.game === null) this.props.getGames()
      if (this.props.users === null) this.props.getUsers()
    }
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleSubmit(event) {
    event.preventDefault()
    this.props.updateGame(this.props.game.id, this.state.guess)
    this.setState({ guess: '' })
  }

  findWinner() {
    const result = this.props.game.players
      .filter(player => {
        return player.symbol === this.props.game.winner
      })
      .map(player => {
        return player.user.firstName
      })
    console.log(`Result: ${result}`)
  }

  renderKeyboard(keyboard) {
    let keysArray = Object.keys(keyboard)
    return keysArray.map(key => {
      if (keyboard[key] === 'false') {
        return (
          <div
            key={key}
            value={key}
            className="guess"
            onClick={() => this.props.updateGame(this.props.game.id, key)}>
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

    const player = game.players.find(p => p.user.id === userId)

    const winner = game.players
      .filter(p => p.symbol === game.winner)
      .map(p => p.user.id)[0]

    return (
      <GameCard>
        <StatusBox>
          <h2>Game#{game.id}</h2>
          <p>Status: {game.status}</p>
          <p>Points: {game.score}</p>
        </StatusBox>

        <h3>{game.movie}</h3>

        <Form onSubmit={this.handleSubmit.bind(this)}>
          <input
            type="text"
            name="guess"
            placeholder="guess movie..."
            value={this.state.guess}
            onChange={this.handleChange.bind(this)}
          />
        </Form>
        <KeyboardWrapper>{this.renderKeyboard(game.keyboard)}</KeyboardWrapper>
        <AlertWrapper className="status">
          {game.status === 'started' &&
            player &&
            player.symbol === game.turn && <div>It's your turn!</div>}

            {game.status === 'started' &&
            player &&
            player.symbol !== game.turn && <div>Please wait for your turn</div>}

          {game.status === 'pending' &&
            game.players.map(p => p.user.id).indexOf(userId) === -1 && (
              <button onClick={this.joinGame}>Join Game</button>
            )}

          {winner && <p>Winner: {users[winner].firstName}</p>}
        </AlertWrapper>
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

export default connect(mapStateToProps, {
  getGames,
  getUsers,
  joinGame,
  updateGame
})(GameBoard)
