import { USER_REGISTER_FAILED } from '../actions/signup'

export default function(state = null, action) {
  switch (action.type) {
      
    case USER_REGISTER_FAILED:
      return {
        error: action.payload
      }
 
    default:
      return state
  }
}