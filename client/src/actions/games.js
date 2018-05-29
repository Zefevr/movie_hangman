import * as request from 'superagent'
import { BASE_URL } from '../constants'

export const ADD_GAME = 'ADD_GAME'
export const UPDATE_GAMES = 'UPDATE_GAMES'
export const JOIN_GAME_SUCCESS = 'JOIN_GAME_SUCCESS'

const updateGames = games => ({
  type: UPDATE_GAMES,
  payload: games
})

const addGame = game => ({
  type: ADD_GAME,
  payload: game
})

const joinGameSuccess = () => ({
  type: JOIN_GAME_SUCCESS
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

export const joinGame = gameId => (dispatch, getState) => {
  const state = getState()
  const jwt = state.currentUser.jwt

  request
    .post(`${BASE_URL}/games/${gameId}/players`)
    .set('Authorization', `Bearer ${jwt}`)
    .then(() => dispatch(joinGameSuccess()))
    .catch(error => console.log(error))
}

export const createGame = () => (dispatch, getState) => {
  const state = getState()
  const jwt = state.currentUser.jwt

  request
    .post(`${BASE_URL}/games`)
    .set('Authorization', `Bearer ${jwt}`)
    .then(response => dispatch(addGame(response.body)))
    .catch(error => console.log(error))
}
