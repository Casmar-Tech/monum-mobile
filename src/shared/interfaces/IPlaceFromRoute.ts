import IMedia from './IMedia';
import IPlace from './IPlace';

export default interface IPlaceFromRoute {
  place: IPlace;
  medias: IMedia[];
}
