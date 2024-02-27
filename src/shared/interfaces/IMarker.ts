import {Dispatch, SetStateAction} from 'react';

export interface IMarker {
  id: string;
  coordinates: [number, number];
  importance: number;
  selected?: boolean;
}
