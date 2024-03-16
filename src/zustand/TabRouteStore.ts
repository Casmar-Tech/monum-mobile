import {create} from 'zustand';
import IRouteComplete from '../shared/interfaces/IRouteComplete';
import ICity from '../shared/interfaces/ICity';
import IRouteOfCity from '../shared/interfaces/IRouteOfCity';
import {IMarker} from '../shared/interfaces/IMarker';

export interface TabRouteState {
  routeOfCity: IRouteOfCity;
  routeComplete: IRouteComplete;
  city: ICity;
  markerSelected: string | null;
  markers: IMarker[];
  routeCameraCoordinates: [number, number];
  forceUpdateRouteCamera: boolean;
  setRouteOfCity: (route: IRouteOfCity) => void;
  setRouteComplete: (route: IRouteComplete) => void;
  setCity: (city: ICity) => void;
  setMarkerSelected: (markerSelected: string | null) => void;
  setMarkers: (markers: IMarker[]) => void;
  setDefaultTabRoute: () => void;
  setRouteCameraCoordinates: (routeCameraCoordinates: [number, number]) => void;
  setForceUpdateRouteCamera: (forceUpdateRouteCamera: boolean) => void;
}

const defaultRouteOfCity: IRouteOfCity = {
  id: '',
  title: '',
  description: '',
  rating: 0,
  stopsCount: 0,
  cityId: '',
};

const defaultRouteComplete: IRouteComplete = {
  ...defaultRouteOfCity,
  duration: 0,
  optimizedDuration: 0,
  distance: 0,
  optimizedDistance: 0,
  stops: [],
};

const defaultCity: ICity = {
  id: '',
  name: '',
  imageUrl: '',
};

export const useTabRouteStore = create<TabRouteState>(set => ({
  routeOfCity: defaultRouteOfCity,
  routeComplete: defaultRouteComplete,
  city: defaultCity,
  markerSelected: null,
  markers: [],
  routeCameraCoordinates: [0, 0],
  forceUpdateRouteCamera: false,
  setRouteOfCity: (routeOfCity: IRouteOfCity) => {
    set(state => ({routeOfCity: {...state.routeOfCity, ...routeOfCity}}));
  },
  setRouteComplete: (routeComplete: IRouteComplete) => {
    set(state => ({routeComplete: {...state.routeComplete, ...routeComplete}}));
  },
  setCity: (city: ICity) => {
    set(state => ({city: {...state.city, ...city}}));
  },
  setMarkerSelected: (markerSelected: string | null) => {
    set(() => ({markerSelected}));
  },
  setMarkers: (markers: IMarker[]) => {
    set(() => ({markers}));
  },
  setForceUpdateRouteCamera: (forceUpdateRouteCamera: boolean) => {
    set(() => ({forceUpdateRouteCamera}));
  },
  setDefaultTabRoute: () => {
    set(() => ({
      routeOfCity: defaultRouteOfCity,
      routeComplete: defaultRouteComplete,
      city: defaultCity,
      markerSelected: null,
      markers: [],
      routeCameraCoordinates: [0, 0],
      forceUpdateRouteCamera: false,
    }));
  },
  setRouteCameraCoordinates: (routeCameraCoordinates: [number, number]) => {
    set(() => ({routeCameraCoordinates}));
  },
}));
