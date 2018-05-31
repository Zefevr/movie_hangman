import * as request from 'superagent'
import { BASE_URL } from '../constants'

export const USER_SIGNUP_SUCCESS = 'USER_SIGNUP_SUCCESS'
export const USER_SIGNUP_FAILED = 'USER_SIGNUP_FAILED'

export const signup = (firstName, lastName, email, password) => (dispatch) =>
	request
		.post(`${BASE_URL}/users`)
		.send({ firstName: firstName, lastName: lastName, email, password })
		.then(result => {
			dispatch({
				type: USER_SIGNUP_SUCCESS
			})
		})
		.catch(err => {
			if (err.status === 400) {
				dispatch({
					type: USER_SIGNUP_FAILED,
					payload: err.response.body.message || 'Unknown error'
				})
			}
			else {
				console.error(err)
			}
		})