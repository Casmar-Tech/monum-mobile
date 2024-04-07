import {SheetDefinition, registerSheet} from 'react-native-actions-sheet';
import DirectionSheet from './DirectionSheet';

registerSheet('direction-sheet', DirectionSheet);
declare module 'react-native-actions-sheet' {
  interface Sheets {
    'direction-sheet': SheetDefinition<{
      payload: {
        coordinates: {
          lat: number;
          lng: number;
        };
        label: string;
      };
    }>;
  }
}

export {};
