import {create} from 'zustand';
import {State} from 'react-native-track-player';
import IPlace from '../shared/interfaces/IPlace';
import IMedia from '../shared/interfaces/IMedia';

export interface IApplication {
  isTabBarVisible: boolean;
  markerSelected: string | null;
  place: IPlace | null;
  mediaPlace: IPlace | null;
  showPlaceDetailExpanded: boolean;
  activeTab: string;
  statePlayer: State;
  mediasOfPlace: IMedia[] | undefined;
  centerCoordinates: [number, number];
  expandedMediaDetail: boolean;
}

export const defaultApplication: IApplication = {
  isTabBarVisible: true,
  markerSelected: null,
  place: null,
  mediaPlace: null,
  showPlaceDetailExpanded: false,
  activeTab: 'Map',
  statePlayer: State.Paused,
  mediasOfPlace: undefined,
  centerCoordinates: [0, 0],
  expandedMediaDetail: false,
};

interface ApplicationState {
  application: IApplication;
  setTabBarVisible: (isTabBarVisible: boolean) => void;
  setMarkerSelected: (markerSelected: string | null) => void;
  setPlace: (place: IPlace | null) => void;
  setMediaPlace: (mediaPlace: IPlace | null) => void;
  setShowPlaceDetailExpanded: (showPlaceDetailExpanded: boolean) => void;
  setActiveTab: (activeTab: string) => void;
  setStatePlayer: (statePlayer: State) => void;
  setMediasOfPlace: (mediasOfPlace: IMedia[] | undefined) => void;
  setCenterCoordinates: (centerCoordinates: [number, number]) => void;
  setExpandedMediaDetail: (expandedMediaDetail: boolean) => void;
}

export const useApplicationStore = create<ApplicationState>(set => ({
  application: defaultApplication,
  setTabBarVisible: (isTabBarVisible: boolean) => {
    set(state => ({application: {...state.application, isTabBarVisible}}));
  },
  setMarkerSelected: (markerSelected: string | null) => {
    set(state => ({application: {...state.application, markerSelected}}));
  },
  setPlace: (place: IPlace | null) => {
    set(state => ({application: {...state.application, place}}));
  },
  setMediaPlace: (mediaPlace: IPlace | null) => {
    set(state => ({application: {...state.application, mediaPlace}}));
  },
  setShowPlaceDetailExpanded: (showPlaceDetailExpanded: boolean) => {
    set(state => ({
      application: {...state.application, showPlaceDetailExpanded},
    }));
  },
  setActiveTab: (activeTab: string) => {
    set(state => ({application: {...state.application, activeTab}}));
  },
  setStatePlayer: (statePlayer: State) => {
    set(state => ({application: {...state.application, statePlayer}}));
  },
  setMediasOfPlace: (mediasOfPlace: IMedia[] | undefined) => {
    set(state => ({application: {...state.application, mediasOfPlace}}));
  },
  setCenterCoordinates: (centerCoordinates: [number, number]) => {
    set(state => ({application: {...state.application, centerCoordinates}}));
  },
  setExpandedMediaDetail: (expandedMediaDetail: boolean) => {
    set(state => ({application: {...state.application, expandedMediaDetail}}));
  },
}));
