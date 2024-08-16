import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from 'firebase/auth';

export interface UserState {
  user: User | null;
  userName: string | null;
  userTelegram: string;
  gender: string;
  avatarUrl: string;
}

const initialState: UserState = {
  user: null,
  userName: null,
  userTelegram: '',
  gender: '',
  avatarUrl: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
    setUserName(state, action: PayloadAction<string>) {
      state.userName = action.payload;
    },
    setUserTelegram(state, action: PayloadAction<string>) {
      state.userTelegram = action.payload;
    },
    setGender(state, action: PayloadAction<string>) {
      state.gender = action.payload;
    },
    setAvatarUrl(state, action: PayloadAction<string>) {
      state.avatarUrl = action.payload;
    },
  },
});

export const { setUser, setUserName, setUserTelegram, setGender, setAvatarUrl } = userSlice.actions;

export default userSlice.reducer;
