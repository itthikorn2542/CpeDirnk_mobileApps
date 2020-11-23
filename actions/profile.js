import {SAVE_PROFILE, EDIT_PROFILE} from './types'

export const saveProfile=(profile)=>(
  {
    type:SAVE_PROFILE,
    profile:profile
  }
);

export const editProfile=(profile)=>(
  {
    type:EDIT_PROFILE,
    profile:profile
  }
);
