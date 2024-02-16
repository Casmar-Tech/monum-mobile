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
  query Routes($cityId: ID!) {
    routes(cityId: $cityId) {
      id
      title
      description
      rating
      duration
      optimizedDuration
      distance
      optimizedDistance
      stopsCount
      cityId
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
          googleId
          googleMapsUri
          internationalPhoneNumber
          nationalPhoneNumber
          types
          primaryType
          userRatingCount
          websiteUri
        }
        medias {
          id
          title
          text
          rating
          audioUrl
          voiceId
          duration
        }
        order
        optimizedOrder
      }
      stopsCount
      cityId
    }
  }
`;
