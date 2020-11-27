import {ADD_SONG,SAVE_SONG,DELETE_SONG,EDIT_SONG} from '../actions/types'

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
        console.log(" DELETE_SONG22222222")
      return{
        ...state,
        songList:state.songList.filter((item)=>item.id!==action.data.id)
      }
      case EDIT_SONG:
      return{
        ...state,
        songList:state.songList.map(song=>(
          (song.songID===action.data.songID)?
          {...song,
          status:action.data.status,
          }:song
      ))
      }
    
      default:
        return state;
  }

}
export default songReducer;