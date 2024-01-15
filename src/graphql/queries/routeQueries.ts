import {gql} from '@apollo/client';

export const GET_CITIES = gql`
  query Cities($textSearch: String) {
    cities(textSearch: $textSearch) {
      id
      translations {
        es_ES
        en_US
        ca_ES
        fr_FR
      }
      imageUrl
    }
  }
`;

export const GET_ROUTES_OF_CITY = gql`
  query Routes($cityId: ID!, $language: String, $textSearch: String) {
    routes(cityId: $cityId, language: $language, textSearch: $textSearch) {
      id
      title
      description
      rating
      cityId
      language
      stopsCount
    }
  }
`;

export const GET_ROUTE_DETAIL = gql`
  query Route($routeId: ID!) {
    route(id: $routeId) {
      id
      title
      description
      rating
      duration
      optimizedDuration
      distance
      optimizedDistance
      stops {
        media {
          id
          place {
            id
            name
            address {
              coordinates {
                lat
                lng
              }
              street
              city
              postalCode
              province
              country
            }
            description
            importance
            rating
            imagesUrl
          }
          title
          language
          rating
          audioUrl
          duration
        }
        order
        optimizedOrder
      }
      stopsCount
      cityId
      language
    }
  }
`;
