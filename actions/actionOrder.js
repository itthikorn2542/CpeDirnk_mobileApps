import {SAVE_ORDER,ADD_ORDER,DELETE_ORDER} from './types';

export const saveOrder=(data)=>({
    type:SAVE_ORDER,
    data:data
});
export const addOrder=(data)=>({
    type:ADD_ORDER,
    data:data
});
export const deleteOrder=(data)=>({
    type:DELETE_ORDER,
    data:data
});