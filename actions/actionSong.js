import {ADD_SONG,SAVE_SONG,DELETE_SONG,UPDATE_SONG} from './types';

export const addSong=(data)=>({
    type:ADD_SONG,
    data:data
});
export const saveSong=(data)=>({
    type:SAVE_SONG,
    data:data
});
export const deleteSong=(data)=>({
    type:DELETE_SONG,
    data:data
});
export const updateSong=(data)=>({
    type:UPDATE_SONG,
    data:data
});