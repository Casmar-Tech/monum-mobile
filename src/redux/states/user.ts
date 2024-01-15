import AsyncStorage from '@react-native-async-storage/async-storage';
import {createSlice} from '@reduxjs/toolkit';
import i18n from 'i18next';
import IUser from '../../shared/interfaces/IUser';

const initialState: IUser = {
  id: '',
  email: '',
  username: '',
  createdAt: new Date().toISOString(),
  name: '',
  photo: '',
  googleId: '',
  token: '',
  language: 'en_US',
  hasPassword: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    setAuthToken: (state, action) => {
      state.token = action.payload;
      AsyncStorage.setItem('authToken', action.payload);
    },
    removeAuthToken: state => {
      state.token = '';
      AsyncStorage.removeItem('authToken');
    },
    setUser: (state, action) => {
      state.id = action.payload?.id || initialState.id;
      state.email = action.payload?.email || initialState.email;
      state.username = action.payload?.username || initialState.username;
      state.createdAt = action.payload?.createdAt || initialState.createdAt;
      state.name = action.payload?.name || initialState.name;
      state.photo = action.payload?.photo || initialState.photo;
      state.hashedPassword =
        action.payload?.hashedPassword || initialState.hashedPassword;
      state.googleId = action.payload?.googleId || initialState.googleId;
      state.language = action.payload?.language || initialState.language;
      state.hasPassword =
        action.payload?.hasPassword || initialState.hasPassword;
      i18n.changeLanguage(state.language);
    },
  },
});

// Action creators are generated for each case reducer function
export const {setAuthToken, removeAuthToken, setUser} = userSlice.actions;

export default userSlice.reducer;
