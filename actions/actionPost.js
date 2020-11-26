import {SAVE_POST,ADD_POST,DELETE_POST,EDIT_POST} from './types';

export const addPost=(data)=>({
    type:ADD_POST,
    data:data
});
export const savePost=(data)=>({
    type:SAVE_POST,
    data:data
});
export const deletePost=(data)=>({
    type:DELETE_POST,
    data:data
});
export const editPost=(data)=>({
    type:EDIT_POST,
    data:data
});