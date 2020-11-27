import {SAVE_ORDER,ADD_ORDER,DELETE_ORDER} from '../actions/types'

const intialState={
  orderList:[]
}

const orderReducer=(state=intialState,action)=>{
  console.log('ttttttttttttt')
  console.log(action.type)
  switch(action.type){
    case SAVE_ORDER:
      console.log('SAVE_ORDER')
        return{
            ...state,
            orderList:action.data
        }
        case ADD_ORDER:
          console.log('ADD_ORDER')
        return{
            ...state,
            orderList:state.orderList.concat(
                action.data
            )
        }
        case DELETE_ORDER:
          console.log('DELETE_ORDER')
            return{
                ...state,
                orderList:state.orderList.filter((item)=>item.id!==action.data.id)
              }
        default:
        return state;
  }

}
export default orderReducer;