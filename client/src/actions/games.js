import * as request from 'superagent'
import { BASE_URL } from '../constants'

export const UPDATE_GAMES = 'UPDATE_GAMES'

const updateGames = games => ({
  type: UPDATE_GAMES,
  payload: games
})

export const getGames = () => (dispatch, getState) => {
  const state = getState()
  if (!state.currentUser) return null
  const jwt = state.currentUser.jwt

  request
    .get(`${BASE_URL}/games`)
    .set('Authorization', `Bearer ${jwt}`)
    .then(response => {
      dispatch(updateGames(response.body))
    })
    .catch(error => console.log(error))
}
