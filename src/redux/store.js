import {createStore, combineReducers} from 'redux'
import SessionReducer from './SessionReducer'
// import View from './framework/reducers/View'

export default createStore(
	combineReducers({
		SessionReducer
	},{})
)