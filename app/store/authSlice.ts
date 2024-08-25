// src/store/authSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  jwtToken: string | null;
}

const initialAuthState: AuthState = {
  jwtToken: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    setJwtToken: (state, action: PayloadAction<string>) => {
      console.log('[AuthSlice] Setting JWT token:', action.payload); // Log when JWT token is set
      state.jwtToken = action.payload;
    },
    clearJwtToken: (state) => {
      console.log('[AuthSlice] Clearing JWT token'); // Log when JWT token is cleared
      state.jwtToken = null;
    },
  },
});

export const { setJwtToken, clearJwtToken } = authSlice.actions;

export default authSlice.reducer;
