import {create} from 'zustand';
import IUser from '../shared/interfaces/IUser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Language} from '../shared/types/Language';

interface UserState {
  user: IUser;
  isAuthenticated: boolean;
  setAuthToken: (token: string) => Promise<void>;
  removeAuthToken: () => Promise<void>;
  setUser: (user: IUser) => void;
  updatePhoto: (photo: string) => void;
  updateUsername: (username: string) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setDefaultUser: () => Promise<void>;
  setLanguage: (language: Language) => void;
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
  language: 'en_US',
  permissions: [],
};

export const useUserStore = create<UserState>(set => ({
  user: undefinedUser,
  isAuthenticated: false,
  setAuthToken: async (token: string) => {
    try {
      await AsyncStorage.setItem('authToken', token);
      set(state => ({user: {...state.user, token}}));
    } catch (error) {
      console.error('Error saving authentication token:', error);
    }
  },
  removeAuthToken: async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      set(state => ({user: {...state.user, token: ''}}));
    } catch (error) {
      console.error('Error removing authentication token:', error);
    }
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
  setDefaultUser: async () => {
    set(state => ({user: {...undefinedUser, language: state.user.language}}));
    set(() => ({isAuthenticated: false}));
  },
  setIsAuthenticated: (isAuthenticated: boolean) => {
    set(() => ({isAuthenticated}));
  },
  setLanguage: (language: Language) => {
    set(state => ({user: {...state.user, language}}));
  },
}));
