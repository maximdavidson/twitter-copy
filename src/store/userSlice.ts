import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from 'firebase/auth';

export interface UserState {
  user: User | null;
  userName: string | null;
  userNickname: string;
  avatarUrl: string;
}

const initialState: UserState = {
  user: null,
  userName: null,
  userNickname: '',
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
    setUserNickname(state, action: PayloadAction<string>) {
      state.userNickname = action.payload;
    },
    setAvatarUrl(state, action: PayloadAction<string>) {
      state.avatarUrl = action.payload;
    },
  },
});

export const { setUser, setUserName, setUserNickname, setAvatarUrl } = userSlice.actions;

export default userSlice.reducer;
