import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  user: any | null;
  isAuthenticated: boolean;
  rememberMe: boolean;
}

const initialState: AuthState = {
  token: null,
  user: null,
  isAuthenticated: false,
  rememberMe: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user: any; rememberMe?: boolean }>,
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      if (action.payload.rememberMe !== undefined) {
        state.rememberMe = action.payload.rememberMe;
      }
    },
    updateUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
    logout: state => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.rememberMe = true;
    },
  },
});

export const { setCredentials, updateUser, logout } = authSlice.actions;

export default authSlice.reducer;
