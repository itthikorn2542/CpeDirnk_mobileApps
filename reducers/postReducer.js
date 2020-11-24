import {ADD_POST} from '../actions/types'

const intialState={
  postList:[]
}

const postReducer=(state=intialState,action)=>{
  //console.log(action.type)
  switch(action.type){
    case ADD_POST:
      return{ 
        ...state,
        postList:action.data
      }
    
      default:
        return state;
  }

}
export default postReducer;