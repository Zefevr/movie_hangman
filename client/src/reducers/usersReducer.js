import { UPDATE_USERS } from '../actions/users'

export default (state = null, { type, payload }) => {
  switch (type) {
    case UPDATE_USERS:
      return payload.reduce((users, user) => {
        users[user.id] = user
        return users
      }, {})
    default:
      return state
  }
}
