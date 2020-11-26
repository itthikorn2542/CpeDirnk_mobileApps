import profileReducer from './reducers/profileReducer'
import songReducer from './reducers/songReducer'
import postReducer from './reducers/postReducer'
import { createStore, combineReducers } from 'redux';

const rootReducer = combineReducers({
  profileReducer:profileReducer,
  songReducer:songReducer,
  postReducer:postReducer,
})


const configureStore = createStore(rootReducer);

export default configureStore;