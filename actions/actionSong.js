import {ADD_SONG} from './types';

export const addSong=(data)=>({
    type:ADD_SONG,
    data:data
});