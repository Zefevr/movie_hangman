import { USER_REGISTER_SUCCESS } from '../actions/signup'

export default function(state = false, action) {
  switch (action.type) {

    case USER_REGISTER_SUCCESS:
      return true

    default:
      return state
  }
}