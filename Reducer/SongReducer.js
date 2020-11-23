import {ADD_SONG} from '../Actions/Types'

const intialState={
  songList:[]
}

const SongReducer=(state=intialState,action)=>{
  //console.log(action.type)
  switch(action.type){
    case ADD_SONG:
      return{
        ...state,
        songList:state.songList.concat(
          action.data
        )
      }
      default:
        return state;
    }
}
export default SongReducer