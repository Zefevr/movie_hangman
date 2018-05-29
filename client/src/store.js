import { applyMiddleware, createStore, compose, combineReducers } from 'redux'
import ReduxThunk from 'redux-thunk'
import io from 'socket.io-client'
import loginReducer from './reducers/loginReducer'

// const socket = io.connect('http://localhost:3002')

const rootReducer = combineReducers({
  currentUser: loginReducer
})

// socket.on('action', payload => store.dispatch(payload))

const devTools = window.devToolsExtension ? window.devToolsExtension() : f => f
const enhancer = compose(applyMiddleware(ReduxThunk), devTools)

export const store = createStore(rootReducer, enhancer)
