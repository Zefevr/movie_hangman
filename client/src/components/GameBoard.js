import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { getGames, joinGame } from '../actions/games'
import { getUsers } from '../actions/users'
import { userId } from '../jwt'

class GameBoard extends PureComponent {
  static propTypes = {}

  componentWillMount() {
    if (this.props.currentUser) {
      if (this.props.game === null) this.props.getGames()
      if (this.props.users === null) this.props.getUsers()
    }
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
      <div className="outer-paper">
        <h1>Game #{game.id}</h1>

        <p>Status: {game.status}</p>

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
      </div>
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
