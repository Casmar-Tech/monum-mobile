import IRouteOfCity from './IRouteOfCity.js';
import IStop from './IStop.js';

export default interface IFullRoute extends IRouteOfCity {
  duration: number;
  optimizedDuration: number;
  distance: number;
  optimizedDistance: number;
  stops: IStop[];
  language: string;
}
