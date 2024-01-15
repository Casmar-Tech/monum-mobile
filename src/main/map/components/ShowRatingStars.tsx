import React from 'react';
import {Image, View} from 'react-native';

import rating_star_1 from '../../../assets/images/icons/ratingStars/rating_star_1.png';
import rating_star_10 from '../../../assets/images/icons/ratingStars/rating_star_10.png';
import rating_star_11 from '../../../assets/images/icons/ratingStars/rating_star_11.png';
import rating_star_12 from '../../../assets/images/icons/ratingStars/rating_star_12.png';
import rating_star_13 from '../../../assets/images/icons/ratingStars/rating_star_13.png';
import rating_star_14 from '../../../assets/images/icons/ratingStars/rating_star_14.png';
import rating_star_15 from '../../../assets/images/icons/ratingStars/rating_star_15.png';
import rating_star_16 from '../../../assets/images/icons/ratingStars/rating_star_16.png';
import rating_star_17 from '../../../assets/images/icons/ratingStars/rating_star_17.png';
import rating_star_18 from '../../../assets/images/icons/ratingStars/rating_star_18.png';
import rating_star_2 from '../../../assets/images/icons/ratingStars/rating_star_2.png';
import rating_star_3 from '../../../assets/images/icons/ratingStars/rating_star_3.png';
import rating_star_4 from '../../../assets/images/icons/ratingStars/rating_star_4.png';
import rating_star_5 from '../../../assets/images/icons/ratingStars/rating_star_5.png';
import rating_star_6 from '../../../assets/images/icons/ratingStars/rating_star_6.png';
import rating_star_7 from '../../../assets/images/icons/ratingStars/rating_star_7.png';
import rating_star_8 from '../../../assets/images/icons/ratingStars/rating_star_8.png';
import rating_star_9 from '../../../assets/images/icons/ratingStars/rating_star_9.png';
import rating_star_empty from '../../../assets/images/icons/ratingStars/rating_star_empty.png';
import rating_star_filled from '../../../assets/images/icons/ratingStars/rating_star_filled.png';

interface ShowRatingStarsProps {
  rating: number; // [0,5]
}

export default function ShowRatingStars({rating}: ShowRatingStarsProps) {
  const filledStars = Math.floor(rating); // Estrellas llenas
  const partialStarRating = rating - filledStars; // Estrella parcial
  const emptyStars = 5 - filledStars - Math.ceil(partialStarRating); // Estrellas vacías

  const renderFilledStars = () => {
    const stars = [];
    for (let i = 0; i < filledStars; i++) {
      stars.push(
        <Image
          key={i}
          source={rating_star_filled}
          resizeMode="contain"
          style={{width: 20, height: 20}}
        />,
      );
    }
    return stars;
  };

  const renderPartialStar = () => {
    const fractionRating = Math.round(partialStarRating * 19);
    const fractionSource = () => {
      switch (fractionRating) {
        case 0:
          return rating_star_empty;
        case 1:
          return rating_star_1;
        case 2:
          return rating_star_2;
        case 3:
          return rating_star_3;
        case 4:
          return rating_star_4;
        case 5:
          return rating_star_5;
        case 6:
          return rating_star_6;
        case 7:
          return rating_star_7;
        case 8:
          return rating_star_8;
        case 9:
          return rating_star_9;
        case 10:
          return rating_star_10;
        case 11:
          return rating_star_11;
        case 12:
          return rating_star_12;
        case 13:
          return rating_star_13;
        case 14:
          return rating_star_14;
        case 15:
          return rating_star_15;
        case 16:
          return rating_star_16;
        case 17:
          return rating_star_17;
        case 18:
          return rating_star_18;
        case 19:
          return rating_star_filled;
        default:
          return rating_star_empty;
      }
    };
    return (
      <Image
        source={fractionSource()}
        resizeMode="contain"
        style={{width: 20, height: 20}}
      />
    );
  };

  const renderEmptyStars = () => {
    const stars = [];
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Image
          key={i}
          source={rating_star_empty}
          resizeMode="contain"
          style={{width: 20, height: 20}}
        />,
      );
    }
    return stars;
  };

  return (
    <View style={{flexDirection: 'row'}}>
      {filledStars > 0 && renderFilledStars()}
      {partialStarRating > 0 && renderPartialStar()}
      {emptyStars > 0 && renderEmptyStars()}
    </View>
  );
}
