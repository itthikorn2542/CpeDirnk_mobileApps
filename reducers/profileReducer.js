import{SAVE_PROFILE,EDIT_PROFILE} from '../actions/types';

const intialSate={
  profile:{
    avatar:null,
    caption:null,
    createdDate:null,
    fb:null,
    id:null,
    ig:null,
    line:null,
    name:null,
    status:null,
    type:null,
  }
}

const profileReducer = (state=intialSate,action)=>{
  switch(action.type){
    case SAVE_PROFILE:
      return{...state,profile:action.profile}
      
    case EDIT_PROFILE:
      return{...state,profile:action.profile}
    default:
      return state;
  }
}

export default profileReducer