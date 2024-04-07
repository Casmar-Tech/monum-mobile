import {create} from 'zustand';
import {State, Track} from 'react-native-track-player';
import {MapView, Camera} from '@rnmapbox/maps';
import IPlace from '../shared/interfaces/IPlace';
import Geolocation from '@react-native-community/geolocation';

export interface IMain {
  isTabBarVisible: boolean;
  activeTab: string;
  statePlayer: State;
  mapRef: React.RefObject<MapView> | null;
  cameraRef: React.RefObject<Camera> | null;
  placeOfMedia: IPlace | null;
  currentUserLocation: [number, number] | null;
  hasInitByUrl: boolean;
  watchId: number | null;
  videoPlayer: boolean;
  videoUrl: string;
  currentTrack: Track | undefined;
  currentTrackIndex: number | undefined;
}

export const defaultMain: IMain = {
  isTabBarVisible: true,
  activeTab: 'Map',
  statePlayer: State.Paused,
  mapRef: null,
  cameraRef: null,
  placeOfMedia: null,
  currentUserLocation: null,
  hasInitByUrl: false,
  watchId: null,
  videoPlayer: false,
  videoUrl: '',
  currentTrack: undefined,
  currentTrackIndex: undefined,
};

interface MainState {
  main: IMain;
  setTabBarVisible: (isTabBarVisible: boolean) => void;
  setActiveTab: (activeTab: string) => void;
  setStatePlayer: (statePlayer: State) => void;
  setMapRef: (mapRef: React.RefObject<MapView> | null) => void;
  setCameraRef: (cameraRef: React.RefObject<Camera> | null) => void;
  setPlaceOfMedia: (placeOfMedia: IPlace | null) => void;
  setCurrentUserLocation: (currentUserLocation: [number, number]) => void;
  setHasInitByUrl: (hasInitByUrl: boolean) => void;
  setDefaultMain: () => void;
  startWatchingLocation: () => void;
  stopWatchingLocation: () => void;
  setVideoPlayer: (videoPlayer: boolean) => void;
  setVideoUrl: (videoUrl: string) => void;
  setCurrentTrack: (currentTrack: Track | undefined) => void;
  setCurrentTrackIndex: (currentTrackIndex: number | undefined) => void;
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
  setCurrentUserLocation: (currentUserLocation: [number, number]) => {
    set(state => ({main: {...state.main, currentUserLocation}}));
  },
  setHasInitByUrl: (hasInitByUrl: boolean) => {
    set(state => ({main: {...state.main, hasInitByUrl}}));
  },
  setDefaultMain: () => {
    set(() => ({main: defaultMain}));
  },
  startWatchingLocation: () => {
    const watchId = Geolocation.watchPosition(
      (position: any) => {
        const {longitude, latitude} = position.coords;
        set(state => {
          return {
            main: {...state.main, currentUserLocation: [longitude, latitude]},
          };
        });
      },
      (error: any) => {
        console.error('Error watching position:', error);
      },
      {enableHighAccuracy: true, distanceFilter: 1, interval: 1000},
    );
    set(state => ({main: {...state.main, watchId}}));
  },
  stopWatchingLocation: () => {
    set(state => {
      if (state.main.watchId !== null) {
        Geolocation.clearWatch(state.main.watchId);
      }
      return {main: {...state.main, watchId: null}};
    });
  },
  setVideoPlayer: (videoPlayer: boolean) => {
    set(state => ({main: {...state.main, videoPlayer}}));
  },
  setVideoUrl: (videoUrl: string) => {
    set(state => ({main: {...state.main, videoUrl}}));
  },
  setCurrentTrack: (currentTrack: Track | undefined) => {
    set(state => ({main: {...state.main, currentTrack}}));
  },
  setCurrentTrackIndex: (currentTrackIndex: number | undefined) => {
    set(state => ({main: {...state.main, currentTrackIndex}}));
  },
}));
