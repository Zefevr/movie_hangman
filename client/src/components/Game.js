import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { getGames } from '../actions/games'
import { getUsers } from '../actions/users'

class Game extends PureComponent {
  static propTypes = {}

  renderGame(game) {
    const { users, history } = this.props

    return (
      <div key={game.id}>
        <div className="content">
          <p>
            This game is being played by{' '}
            {game.players
              .map(player => users[player.userId].firstName)
              .join(' and ')}
          </p>
          <h2>Game #{game.id}</h2>
          <p>Status: {game.status}</p>
        </div>
        <div className="actions">
          <button
            size="small"
            onClick={() => history.push(`/games/${game.id}`)}>
            Watch
          </button>
        </div>
      </div>
    )
  }

  componentWillMount() {
    if (this.props.games === null) {
      this.props.getGames()
    }
    if (this.props.users === null) {
      this.props.getUsers()
    }
  }

  render() {
    const { games, users, createGame } = this.props

    if (!this.props.currentUser) return <Redirect to="/login" />

    if (games === null || users === null) return null

    return (
      <div>
        <h1>GAME BOARD</h1>
        <button onClick={createGame}>Create Game</button>
        <div>{games.map(game => this.renderGame(game))}</div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  currentUser: state.currentUser,
  users: state.users === null ? null : state.users,
  games:
    state.games === null
      ? null
      : Object.values(state.games).sort((a, b) => b.id - a.id)
})

export default connect(mapStateToProps, { getGames, getUsers })(Game)

// getGames, getUsers, createGame
