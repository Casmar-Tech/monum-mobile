import IPlace from './IPlace';

export default interface IMedia {
  id: string;
  duration?: number;
  position?: number;
  title: string;
  rating: number;
  audioUrl: string;
  place?: IPlace;
}
