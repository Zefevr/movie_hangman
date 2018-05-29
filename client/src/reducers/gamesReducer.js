import { UPDATE_GAMES } from '../actions/games'

export default (state = null, { type, payload }) => {
  switch (type) {
    case UPDATE_GAMES:
      return payload.reduce((games, game) => {
        games[game.id] = game
        return games
      }, {})
    default:
      return state
  }
}
