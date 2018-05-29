import { LOGIN_SUCCESS } from '../actions/login'

export default (state = {}, { type, payload }) => {
  switch (type) {
    case LOGIN_SUCCESS:
      return payload
    default:
      return state
  }
}
