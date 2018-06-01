import { UPDATE_USERS, ADD_USER, UPDATE_USER } from '../actions/users'

export default (state = null, { type, payload }) => {
  switch (type) {
    case ADD_USER:
      return {
        ...state,
        [payload.id]: payload
      }
    case UPDATE_USERS:
      return payload.reduce((users, user) => {
        users[user.id] = user
        return users
      }, {})
    case UPDATE_USER:
      return {
        ...state,
        [payload.id]: payload
      }
    default:
      return state
  }
}
