import {ADD_POST, SAVE_POST,DELETE_POST, EDIT_POST} from '../actions/types'

const intialState={
  postList:[]
}

const postReducer=(state=intialState,action)=>{
  //console.log(action.type)
  switch(action.type){
    case ADD_POST:
      return{ 
        ...state,
        postList:state.postList.concat(
            action.data
        )
      }
      case DELETE_POST:
        return{
          ...state,postList:state.postList.filter((item)=>item.id!==action.data.id)
        }
    case SAVE_POST:
        return{
            ...state,
            postList:action.data
        }
    case EDIT_POST:
      return{
        ...state,postList:state.postList.map(post=>(
          (post.id===action.data.id)?
          {...post,
          id:action.data.id,
          caption:action.data.caption,
          }:post
      ))
      }
    
      default:
        return state;
  }

}
export default postReducer;