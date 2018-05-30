import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { getGames, createGame } from '../actions/games'
import { getUsers } from '../actions/users'
import styled from 'styled-components'

const GamesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  > h1 {
    margin: 2rem 0 0 0;
  }
`

const GamesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
`

const GameCard = styled.div`
  display: flex;
  flex-direction: column;
  width: 250px;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  margin: 1rem;
  border: 1px solid #98dbc6;
`

const Button = styled.button`
  padding: 1rem;
  margin-top: 1rem;
  color: #336b87;
  background-color: #98dbc6;
  font-weight: strong;
  font-size: 1rem;
  border: 1px solid #5bc8ac;
`

class Game extends PureComponent {
  static propTypes = {}

  renderGame(game) {
    const { users, history } = this.props

    return (
      <GameCard key={game.id}>
        <div className="content">
          <p>
            This game is being played by{' '}
            {game.players
              .map(player => users[player.user.id].firstName)
              .join(' and ')}
          </p>
          <h2>Game #{game.id}</h2>
          <p>Status: {game.status}</p>
        </div>
        <div className="actions">
          <Button
            size="small"
            onClick={() => history.push(`/games/${game.id}`)}>
            Watch
          </Button>
        </div>
      </GameCard>
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
      <GamesWrapper>
        <h1>GAME BOARD</h1>
        <Button onClick={createGame}>Create Game</Button>
        <GamesList>
          {games.map(
            game => (game.status !== 'finished' ? this.renderGame(game) : null)
          )}
        </GamesList>
      </GamesWrapper>
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

export default connect(mapStateToProps, { getGames, getUsers, createGame })(
  Game
)
