import { applyMiddleware, createStore, compose, combineReducers } from 'redux'
import ReduxThunk from 'redux-thunk'
import io from 'socket.io-client'
import reducers from './reducers'

const socket = io.connect('http://localhost:4000')

const reducer = combineReducers(reducers)

socket.on('action', payload => store.dispatch(payload))

const devTools = window.devToolsExtension ? window.devToolsExtension() : f => f
const enhancer = compose(applyMiddleware(ReduxThunk), devTools)

const store = createStore(reducer, enhancer)

export default store