import {ADD_SONG,SAVE_SONG} from './types';

export const addSong=(data)=>({
    type:ADD_SONG,
    data:data
});
export const saveSong=(data)=>({
    type:SAVE_SONG,
    data:data
});