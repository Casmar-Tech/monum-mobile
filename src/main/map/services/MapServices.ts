import IPlace from '../../../shared/interfaces/IPlace';
import {MarkerResponse} from './MapServicesInterfaces';
import client from '../../../graphql/connection';
import {
  GET_MARKERS,
  GET_PLACE_INFO,
  GET_PLACE_SEARCHER_SUGGESTIONS,
} from '../../../graphql/queries/placeQueries';
import {GET_PLACE_MEDIA} from '../../../graphql/queries/mediaQueries';
import {Language} from '../../../shared/types/Language';

class MapServices {
  public async getMarkers(
    textSearch: string | undefined,
    centerCoordinates: [number, number],
    sortField: 'importance' | 'name' | 'rating',
    sortOrder: 'asc' | 'desc',
  ): Promise<MarkerResponse[]> {
    try {
      const response = await client.query({
        query: GET_MARKERS,
        variables: {
          textSearch: textSearch,
          centerCoordinates,
          sortField,
          sortOrder,
        },
      });
      return response.data.places || [];
    } catch (error) {
      console.error('Error trying to get markers:', error);
      return [];
    }
  }

  public async getPlaceInfo(
    placeId: string,
    language: Language,
  ): Promise<IPlace | null> {
    try {
      const response = await client.query({
        query: GET_PLACE_INFO,
        variables: {placeId, imageSize: 'original', language: language},
      });
      return response.data?.place || null;
    } catch (error) {
      console.error('Error trying to get place info:', error);
      return null;
    }
  }

  public async getPlaceMedia(placeId: string) {
    try {
      const response = await client.query({
        query: GET_PLACE_MEDIA,
        variables: {placeId},
      });
      return response.data?.medias || [];
    } catch (error) {
      console.error('Error trying to get place media:', error);
      return [];
    }
  }

  public async getPlaceSearcherSuggestions(textSearch: string) {
    try {
      const response = await client.query({
        query: GET_PLACE_SEARCHER_SUGGESTIONS,
        variables: {textSearch},
      });
      return response.data?.placeSearcherSuggestions || [];
    } catch (error) {
      console.error('Error trying to get place searcher suggestions:', error);
      return [];
    }
  }
}

export default new MapServices();
