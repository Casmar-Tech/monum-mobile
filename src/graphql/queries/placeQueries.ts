import {gql} from '@apollo/client';

export const GET_MARKERS = gql`
  query Places(
    $textSearch: String
    $centerCoordinates: [Float]
    $sortOrder: SortOrder
    $sortField: SortField
    $language: Language
  ) {
    places(
      textSearch: $textSearch
      centerCoordinates: $centerCoordinates
      sortOrder: $sortOrder
      sortField: $sortField
      language: $language
    ) {
      id
      address {
        coordinates {
          lat
          lng
        }
      }
      importance
    }
  }
`;

export const GET_PLACE_INFO = gql`
  query Place($placeId: ID!, $imageSize: ImageSize, $language: Language) {
    place(id: $placeId, imageSize: $imageSize, language: $language) {
      address {
        city
        coordinates {
          lat
          lng
        }
        country
        postalCode
        province
        street
      }
      description
      id
      importance
      name
      rating
      imagesUrl
    }
  }
`;

export const GET_PLACE_SEARCHER_SUGGESTIONS = gql`
  query Query($textSearch: String!) {
    placeSearcherSuggestions(textSearch: $textSearch)
  }
`;
