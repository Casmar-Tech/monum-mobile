import {create} from 'zustand';
import IUser from '../shared/interfaces/IUser';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserState {
  user: IUser;
  setAuthToken: (token: string) => Promise<void>;
  removeAuthToken: () => Promise<void>;
  setUser: (user: IUser) => void;
  updatePhoto: (photo: string) => void;
  updateUsername: (username: string) => void;
}

export const undefinedUser: IUser = {
  id: '',
  email: '',
  username: '',
  createdAt: new Date().toISOString(),
  name: '',
  photo: '',
  googleId: '',
  token: '',
  hasPassword: false,
  permissions: [],
};

export const useUserStore = create<UserState>(set => ({
  user: undefinedUser,
  setAuthToken: async (token: string) => {
    await AsyncStorage.setItem('authToken', token);
    set(state => ({user: {...state.user, token}}));
  },
  removeAuthToken: async () => {
    await AsyncStorage.removeItem('authToken');
    set(state => ({user: {...state.user, token: ''}}));
  },
  setUser: (user: IUser) => {
    set(state => ({user: {...state.user, ...user}}));
  },
  updatePhoto: (photo: string) => {
    set(state => ({user: {...state.user, photo}}));
  },
  updateUsername: (username: string) => {
    set(state => ({user: {...state.user, username}}));
  },
}));