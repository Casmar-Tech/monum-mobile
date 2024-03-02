import {create} from 'zustand';
import IPlace from '../shared/interfaces/IPlace';
import IMedia from '../shared/interfaces/IMedia';
import {IMarker} from '../shared/interfaces/IMarker';

export interface ITabMap {
  markerSelected: string | null;
  place: IPlace | null;
  showPlaceDetailExpanded: boolean;
  mediasOfPlace: IMedia[] | undefined;
  centerCoordinates: [number, number];
  expandedMediaDetail: boolean;
  markers: IMarker[];
}

export const defaultTabMap: ITabMap = {
  markerSelected: null,
  place: null,
  showPlaceDetailExpanded: false,
  mediasOfPlace: undefined,
  centerCoordinates: [0, 0],
  expandedMediaDetail: false,
  markers: [],
};

interface TabMapState {
  tabMap: ITabMap;
  setMarkerSelected: (markerSelected: string | null) => void;
  setPlace: (place: IPlace | null) => void;
  setShowPlaceDetailExpanded: (showPlaceDetailExpanded: boolean) => void;
  setMediasOfPlace: (mediasOfPlace: IMedia[] | undefined) => void;
  setCenterCoordinates: (centerCoordinates: [number, number]) => void;
  setExpandedMediaDetail: (expandedMediaDetail: boolean) => void;
  setMarkers: (markers: IMarker[]) => void;
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
  setCenterCoordinates: (centerCoordinates: [number, number]) => {
    set(state => ({tabMap: {...state.tabMap, centerCoordinates}}));
  },
  setExpandedMediaDetail: (expandedMediaDetail: boolean) => {
    set(state => ({tabMap: {...state.tabMap, expandedMediaDetail}}));
  },
  setMarkers: (markers: IMarker[]) => {
    set(state => ({tabMap: {...state.tabMap, markers}}));
  },
}));
