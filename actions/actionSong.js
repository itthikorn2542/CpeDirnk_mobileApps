import {ADD_SONG,SAVE_SONG,DELETE_SONG,EDIT_SONG} from './types';

export const addSong=(data)=>({
    type:ADD_SONG,
    data:data
});
export const saveSong=(data)=>({
    type:SAVE_SONG,
    data:data
});
export const deletedSong=(id)=>({
    type:DELETE_SONG,
    id:id
});

export const editSong=(data)=>({
    type:EDIT_SONG,
    data:data
});
