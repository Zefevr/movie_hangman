import { UPDATE_GAMES, UPDATE_GAME, ADD_GAME } from '../actions/games'

export default (state = null, { type, payload }) => {
  switch (type) {
    case UPDATE_GAMES:
      return payload.reduce((games, game) => {
        games[game.id] = game
        return games
      }, {})
    case UPDATE_GAME:
      return { ...state, [payload.id]: payload }
    case ADD_GAME:
      return { ...state, [payload.id]: payload }
    default:
      return state
  }
}
