import * as request from 'superagent'
import { BASE_URL } from '../constants'

export const UPDATE_USERS = 'UPDATE_USERS'
export const ADD_USER = 'ADD_USER'

export const getUsers = () => (dispatch, getState) => {
  const state = getState()
  if (!state.currentUser) return null
  const jwt = state.currentUser.jwt

  request
    .get(`${BASE_URL}/users`)
    .set('Authorization', `Bearer ${jwt}`)
    .then(response => {
      dispatch({
        type: UPDATE_USERS,
        payload: response.body
      })
    })
    .catch(error => console.log(error))
}
