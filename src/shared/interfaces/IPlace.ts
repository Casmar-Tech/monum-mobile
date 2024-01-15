export default interface IPlace {
  id: string;
  name: string;
  description: string;
  rating: number;
  importance: number;
  address: {
    city: string;
    province: string;
    country: string;
    street: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  imagesUrl?: string[];
}
