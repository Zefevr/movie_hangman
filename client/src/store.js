import { applyMiddleware, createStore, compose, combineReducers } from 'redux'
import ReduxThunk from 'redux-thunk'
import io from 'socket.io-client'
import currentUserReducer from './reducers/currentUserReducer'
import gamesReducer from './reducers/gamesReducer'
import usersReducer from './reducers/usersReducer'
import signUpReducer from './reducers/signUpReducer'

const socket = io.connect('http://localhost:4000')

const rootReducer = combineReducers({
  currentUser: currentUserReducer,
  games: gamesReducer,
  users: usersReducer,
  signup: signUpReducer
})

socket.on('action', payload => store.dispatch(payload))

const devTools = window.devToolsExtension ? window.devToolsExtension() : f => f
const enhancer = compose(applyMiddleware(ReduxThunk), devTools)

export const store = createStore(rootReducer, enhancer)
