import {ADD_SONG,SAVE_SONG,DELETE_SONG} from '../actions/types'

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
      case DELETE_SONG:
      return{
        ...state,
        songList:state.songList.filter((item)=>item.id!==action.data.id)
      }
    
      default:
        return state;
  }

}
export default songReducer;