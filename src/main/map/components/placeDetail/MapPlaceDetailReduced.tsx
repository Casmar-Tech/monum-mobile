import React, {Dispatch, SetStateAction} from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import IPlace from '../../../../shared/interfaces/IPlace';

import place_pre_detail_arrow_top from '../../../../assets/images/icons/place_pre_detail_arrow_top.png';
import ShowRatingStars from '../ShowRatingStars';

interface MapPlaceDetailReducedProps {
  place: IPlace | null;
  importanceIcon: ImageSourcePropType;
  setTabBarVisible: Dispatch<SetStateAction<boolean>>;
  setShowPlaceDetailExpanded: Dispatch<SetStateAction<boolean>>;
}

export default function MapPlaceDetailReduced({
  place,
  importanceIcon,
  setTabBarVisible,
  setShowPlaceDetailExpanded,
}: MapPlaceDetailReducedProps) {
  return (
    <View style={styles.container}>
      <LinearGradient
        start={{x: 0, y: 1}}
        end={{x: 0, y: 0}}
        colors={['#0002', '#0000']}
        style={[styles.linearGradient, {height: '100%'}]}
      />
      <TouchableWithoutFeedback
        onPress={() => {
          setShowPlaceDetailExpanded(true);
          setTabBarVisible(false);
        }}
        style={{zIndex: 999}}>
        <View>
          <View style={styles.arrowContainer}>
            <Image
              source={place_pre_detail_arrow_top}
              style={[styles.arrowIcon]}
              resizeMode="cover"
            />
          </View>
          <View style={styles.informationContainer}>
            <View style={styles.imageContainer}>
              {place?.imagesUrl && (
                <Image
                  source={{
                    uri: Array.isArray(place.imagesUrl)
                      ? `${place.imagesUrl[0]}`
                      : '',
                  }}
                  style={styles.image}
                  resizeMode="cover"
                />
              )}
            </View>
            <View style={styles.textInformationContainer}>
              <Text style={styles.textPlaceName}>{place?.name}</Text>
              <Text
                style={
                  styles.textPlaceAddress
                }>{`${place?.address.city}, ${place?.address.country}`}</Text>
              <ShowRatingStars rating={place?.rating || 0} />
            </View>
            <View style={styles.importanceIconContainer}>
              <Image
                source={importanceIcon}
                resizeMode="contain"
                style={styles.importanceIconImage}
              />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 999,
  },
  arrowContainer: {
    width: '100%',
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  arrowIcon: {
    height: 24,
    width: 24,
  },
  informationContainer: {
    width: '100%',
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  imageContainer: {
    flex: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    paddingHorizontal: 12,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textInformationContainer: {
    flex: 4,
    justifyContent: 'space-between',
    height: '100%',
  },
  textPlaceName: {
    fontSize: 14,
    color: '#032000',
    fontFamily: 'Montserrat-SemiBold',
  },
  textPlaceAddress: {
    fontSize: 14,
    color: '#032000',
    fontFamily: 'Montserrat-Regular',
  },
  importanceIconContainer: {flex: 1, marginHorizontal: '6%'},
  importanceIconImage: {width: 40, height: 40},
  linearGradient: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
});
