import {create} from 'zustand';
import IPlace from '../shared/interfaces/IPlace';
import IMedia from '../shared/interfaces/IMedia';
import {IMarker} from '../shared/interfaces/IMarker';

export interface ITabMap {
  markerSelected: string | null;
  place: IPlace | null;
  showPlaceDetailExpanded: boolean;
  mediasOfPlace: IMedia[] | undefined;
  expandedMediaDetail: boolean;
  markers: IMarker[];
  mapCameraCoordinates: [number, number];
  forceUpdateMapCamera: boolean;
}

export const defaultTabMap: ITabMap = {
  markerSelected: null,
  place: null,
  showPlaceDetailExpanded: false,
  mediasOfPlace: undefined,
  expandedMediaDetail: false,
  markers: [],
  mapCameraCoordinates: [0, 0],
  forceUpdateMapCamera: false,
};

interface TabMapState {
  tabMap: ITabMap;
  setMarkerSelected: (markerSelected: string | null) => void;
  setPlace: (place: IPlace | null) => void;
  setShowPlaceDetailExpanded: (showPlaceDetailExpanded: boolean) => void;
  setMediasOfPlace: (mediasOfPlace: IMedia[] | undefined) => void;
  setExpandedMediaDetail: (expandedMediaDetail: boolean) => void;
  setMarkers: (markers: IMarker[]) => void;
  setMapCameraCoordinates: (mapCameraCoordinates: [number, number]) => void;
  setForceUpdateMapCamera: (forceUpdateMapCamera: boolean) => void;
  setDefaultTabMap: () => void;
}

export const useTabMapStore = create<TabMapState>(set => ({
  tabMap: defaultTabMap,
  setMarkerSelected: (markerSelected: string | null) => {
    set(state => ({tabMap: {...state.tabMap, markerSelected}}));
  },
  setPlace: (place: IPlace | null) => {
    set(state => ({tabMap: {...state.tabMap, place}}));
  },
  setShowPlaceDetailExpanded: (showPlaceDetailExpanded: boolean) => {
    set(state => ({
      tabMap: {...state.tabMap, showPlaceDetailExpanded},
    }));
  },
  setMediasOfPlace: (mediasOfPlace: IMedia[] | undefined) => {
    set(state => ({tabMap: {...state.tabMap, mediasOfPlace}}));
  },
  setExpandedMediaDetail: (expandedMediaDetail: boolean) => {
    set(state => ({tabMap: {...state.tabMap, expandedMediaDetail}}));
  },
  setMarkers: (markers: IMarker[]) => {
    set(state => ({tabMap: {...state.tabMap, markers}}));
  },
  setMapCameraCoordinates: (mapCameraCoordinates: [number, number]) => {
    set(state => ({tabMap: {...state.tabMap, mapCameraCoordinates}}));
  },
  setForceUpdateMapCamera: (forceUpdateMapCamera: boolean) => {
    set(state => ({tabMap: {...state.tabMap, forceUpdateMapCamera}}));
  },
  setDefaultTabMap: () => {
    set(() => ({tabMap: defaultTabMap}));
  },
}));
