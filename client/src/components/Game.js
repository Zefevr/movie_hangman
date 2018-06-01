import React, { PureComponent } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { getGames, createGame } from '../actions/games'
import { getUsers } from '../actions/users'
import styled from 'styled-components'
import { userId } from '../jwt'

const GamesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  > h2 {
    margin: 1rem;
    padding: 0.5rem;
  }
  > th,
  td {
    border: 1px solid #98dbc6;
    width: 200px;
    text-align: center;
    color: #336b87;
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
  width: 200px;
  height: 225px;
  justify-content: space-between;
  padding: 1rem;
  margin: 1rem;
  border: 1px solid #98dbc6;
  > h3 {
    padding: 0;
    margin: 0;
  }
  > p {
    padding: 0;
    margin: 0;
  }
  > .center {
    padding: 0;
    display: flex;
    margin: 0;
    align-items: center;
    justify-content: center;
  }
`

const Button = styled.button`
  padding: 1rem;
  margin: 1rem;
  color: #336b87;
  background-color: #98dbc6;
  font-weight: strong;
  font-size: 1rem;
  border: 1px solid #5bc8ac;
`

class Game extends PureComponent {

  renderGame(game) {
    const { history, userId } = this.props
    const gamePlayers = game.players.map(player => player.user.id)

    return (
      <GameCard key={game.id}>
        <div className="center">
          <h3>Game #{game.id}</h3>
        </div>
        {game.players.map(player => player.user.firstName).length < 2 && (
          <p>Waiting for players...</p>
        )}
        {game.players.map(player => player.user.firstName).length === 2 && (
          <p>
            {game.players.map(player => player.user.firstName).join(' vs. ')}
          </p>
        )}
        <p>Status: {game.status}</p>
        <div className="center">
          <Button
            size="small"
            onClick={() => history.push(`/games/${game.id}`)}>
            {gamePlayers.includes(userId) && 'Start'}
            {!gamePlayers.includes(userId) && 'Watch'}
          </Button>
        </div>
      </GameCard>
    )
  }

  componentWillMount() {
    this.props.getGames()
    this.props.getUsers()
  }

  render() {
    const { games, users, createGame } = this.props

    if (!this.props.currentUser) return <Redirect to="/login" />

    if (games === null || users === null) return null

    return (
      <GamesWrapper>
        <h2>LEADERBOARD:</h2>
        <table>
          <tbody>
            <tr>
              <th>User</th>
              <th>Points</th>
            </tr>
            {Object.values(users)
              .sort((a, b) => b.points - a.points)
              .slice(0, 5)
              .map(user => {
                return (
                  <tr key={user.id}>
                    <td>{user.firstName}</td>
                    <td>{user.points}</td>
                  </tr>
                )
              })}
          </tbody>
        </table>
        <h2>GAME BOARD:</h2>
        <GamesList>
          {games.map(
            game => (game.status !== 'finished' ? this.renderGame(game) : null)
          )}
        </GamesList>
        <Button onClick={createGame}>Create Game</Button>
      </GamesWrapper>
    )
  }
}

const mapStateToProps = state => ({
  currentUser: state.currentUser,
  userId: state.currentUser && userId(state.currentUser.jwt),
  users: state.users === null ? null : state.users,
  games:
    state.games === null
      ? null
      : Object.values(state.games).sort((a, b) => b.id - a.id)
})

export default connect(mapStateToProps, { getGames, getUsers, createGame })(
  Game
)
