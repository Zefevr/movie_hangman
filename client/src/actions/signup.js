import * as request from 'superagent'
import { BASE_URL } from '../constants'

export const USER_SIGNUP_SUCCESS = 'USER_SIGNUP_SUCCESS'
export const USER_SIGNUP_FAILED = 'USER_SIGNUP_FAILED'
export const USER_REGISTER_SUCCESS = 'USER_REGISTER_SUCCESS'
export const USER_REGISTER_FAILED = 'USER_REGISTER_FAILED'

// export const signup = (firstName, lastName, email, password) => (dispatch) =>
// 	request
// 		.post(`${BASE_URL}/users`)
// 		.send({ firstName: firstName, lastName: lastName, email, password })
// 		.then(result => {
// 			dispatch({
// 				type: USER_SIGNUP_SUCCESS
// 			})
// 		})
// 		.catch(err => {
// 			if (err.status === 400) {
// 				dispatch({
// 					type: USER_SIGNUP_FAILED,
// 					payload: err.response.body.message || 'Unknown error'
// 				})
// 			}
// 			else {
// 				console.error(err)
// 			}
// 		})

export const register = (
  firstName,
  lastName,
  email,
  password,
  confirmPassword
) => dispatch => {
  if (password === confirmPassword) {
    request
      .post(`${BASE_URL}/users`)
      .send({ firstName, lastName, email, password })
      .then(result => {
        dispatch({
          type: USER_REGISTER_SUCCESS,
          payload: result.body
        })
      })
      .catch(err => {
        console.log('Catch error: ', err)
        dispatch({
          type: USER_REGISTER_FAILED,
          payload: err.response.body.message || 'Unknown error'
        })
      })
  } else {
    dispatch({
      type: USER_REGISTER_FAILED,
      payload: "Passwords don't match. Please try again"
    })
  }
}
