import {ADD_SONG,SAVE_SONG} from '../actions/types'

const intialState={
  songList:[]
}

const songReducer=(state=intialState,action)=>{
  //console.log(action.type)
  switch(action.type){
    case ADD_SONG:
      return{ 
        ...state,
        songList:state.songList.concat(action.data)
      }
      case SAVE_SONG:
      return{ 
        ...state,
        songList:action.data
      }
    
      default:
        return state;
  }

}
export default songReducer;