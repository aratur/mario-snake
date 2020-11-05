import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from './store';

const guiSlice = createSlice({
  name: 'gui',
  initialState: {
    isScreenLocked: false
  },
  reducers: {
    setIsScreenLocked: (state, action: PayloadAction<boolean>) => {
      if (action.payload !== state.isScreenLocked){
        state.isScreenLocked = action.payload;
      }
    }
  }
});


export const getIsScreenLocked = (state: RootState) => state.gui.isScreenLocked;
export const { setIsScreenLocked } = guiSlice.actions;
export default guiSlice.reducer;
