import profileReducer from './reducers/profileReducer'
import songReducer from './reducers/songReducer'
import { createStore, combineReducers } from 'redux';

const rootReducer = combineReducers({
  profileReducer:profileReducer,
  songReducer:songReducer
})


const configureStore = createStore(rootReducer);

export default configureStore;