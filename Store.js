import SongReducer from './Reducer/SongReducer'
import {createStore,combineReducers} from 'redux'
const rootReducer = combineReducers({
  SongReducer:SongReducer
})
const configureStore = createStore(rootReducer);
export default configureStore;