import {create} from 'zustand';
import {State} from 'react-native-track-player';
import {MapView, Camera} from '@rnmapbox/maps';
import IPlace from '../shared/interfaces/IPlace';
import {Language} from '../shared/types/Language';

export interface IMain {
  isTabBarVisible: boolean;
  activeTab: string;
  statePlayer: State;
  mapRef: React.RefObject<MapView> | null;
  cameraRef: React.RefObject<Camera> | null;
  placeOfMedia: IPlace | null;
  language: Language;
}

export const defaultMain: IMain = {
  isTabBarVisible: true,
  activeTab: 'Map',
  statePlayer: State.Paused,
  mapRef: null,
  cameraRef: null,
  placeOfMedia: null,
  language: 'en_US',
};

interface MainState {
  main: IMain;
  setTabBarVisible: (isTabBarVisible: boolean) => void;
  setActiveTab: (activeTab: string) => void;
  setStatePlayer: (statePlayer: State) => void;
  setMapRef: (mapRef: React.RefObject<MapView> | null) => void;
  setCameraRef: (cameraRef: React.RefObject<Camera> | null) => void;
  setPlaceOfMedia: (placeOfMedia: IPlace | null) => void;
  setLanguage: (language: Language) => void;
}

export const useMainStore = create<MainState>(set => ({
  main: defaultMain,
  setTabBarVisible: (isTabBarVisible: boolean) => {
    set(state => ({main: {...state.main, isTabBarVisible}}));
  },
  setActiveTab: (activeTab: string) => {
    set(state => ({main: {...state.main, activeTab}}));
  },
  setStatePlayer: (statePlayer: State) => {
    set(state => ({main: {...state.main, statePlayer}}));
  },
  setMapRef: (mapRef: React.RefObject<MapView> | null) => {
    set(state => ({main: {...state.main, mapRef}}));
  },
  setCameraRef: (cameraRef: React.RefObject<Camera> | null) => {
    set(state => ({main: {...state.main, cameraRef}}));
  },
  setPlaceOfMedia: (placeOfMedia: IPlace | null) => {
    set(state => ({main: {...state.main, placeOfMedia}}));
  },
  setLanguage: (language: Language) => {
    set(state => ({main: {...state.main, language}}));
  },
}));
