import {SAVE_POST,ADD_POST} from './types';

export const addPost=(data)=>({
    type:ADD_POST,
    data:data
});
export const savePost=(data)=>({
    type:SAVE_POST,
    data:data
});