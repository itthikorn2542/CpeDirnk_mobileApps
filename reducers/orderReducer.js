import {SAVE_ORDER,ADD_ORDER} from '../actions/types'

const intialState={
  orderList:[]
}

const orderReducer=(state=intialState,action)=>{
  //console.log(action.type)
  switch(action.type){
    case SAVE_ORDER:
        return{
            ...state,
            orderList:action.data
        }
        case ADD_ORDER:
        return{
            ...state,
            orderList:state.orderList.concat(
                action.data
            )
        }
        default:
        return state;
  }

}
export default orderReducer;