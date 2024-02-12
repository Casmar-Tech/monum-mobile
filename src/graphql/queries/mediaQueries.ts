import {gql} from '@apollo/client';

export const GET_PLACE_MEDIA = gql`
  query Medias($placeId: ID!) {
    medias(placeId: $placeId) {
      id
      title
      rating
      audioUrl
      duration
    }
  }
`;
