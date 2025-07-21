import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  email: string;
  role: 'candidate' | 'recruiter' | 'admin';
  name: string;
  token: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      
      localStorage.setItem('user', JSON.stringify(action.payload));
      localStorage.setItem('token', action.payload.token);
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
      state.user = null;
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    loadUserFromStorage(state) {
      const user = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (user && token) {
        state.user = JSON.parse(user);
        state.isAuthenticated = true;
      }
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, loadUserFromStorage } = userSlice.actions;
export default userSlice.reducer;