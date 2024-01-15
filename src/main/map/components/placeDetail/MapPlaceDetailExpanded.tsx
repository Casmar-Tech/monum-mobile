import {t} from 'i18next';
import React, {Dispatch, SetStateAction, useRef} from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SheetManager} from 'react-native-actions-sheet';
import {ScrollView} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import place_detail_arrow_bottom_white from '../../../../assets/images/icons/place_detail_arrow_bottom_white.png';
import place_detail_direction_white from '../../../../assets/images/icons/place_detail_direction_white.png';
import IMedia from '../../../../shared/interfaces/IMedia';
import IPlace from '../../../../shared/interfaces/IPlace';
import ShowRatingStars from '../ShowRatingStars';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import PlaceMediaPill from './PlaceMediaPill';

const BORDER_RADIUS = 24;

interface MapPlaceDetailExpandedProps {
  placeMedia: IMedia[];
  importanceIcon: ImageSourcePropType;
  place: IPlace;
  setPlace: Dispatch<SetStateAction<IPlace | null>>;
  setShowPlaceDetailExpanded: Dispatch<SetStateAction<boolean>>;
}

export default function MapPlaceDetailExpanded({
  placeMedia,
  importanceIcon,
  place,
  setPlace,
}: MapPlaceDetailExpandedProps) {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: Array.isArray(place.imagesUrl)
              ? `${place.imagesUrl[0]}?auto=compress&cs=tinysrgb&dpr=2&h=500&w=500}`
              : '',
          }}
          resizeMode="cover"
          style={styles.image}
        />
      </View>
      <View style={styles.arrowContainer}>
        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}
          colors={['rgba(3, 32, 0, 1)', 'rgba(3, 32, 0, 0)']}
          style={styles.linearGradient}
        />
        <Image
          source={place_detail_arrow_bottom_white}
          style={styles.arrowIcon}
          resizeMode="contain"
        />
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.basicInfoConatiner}>
          <View>
            <Text style={styles.placeName}>{place?.name}</Text>
            <Text
              style={
                styles.placeAddress
              }>{`${place?.address.city}, ${place?.address.country}`}</Text>
            <ShowRatingStars rating={place?.rating || 0} />
          </View>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <TouchableOpacity
              onPress={() => {
                SheetManager.show('direction-sheet', {
                  payload: {
                    coordinates: place?.address?.coordinates,
                    label: place?.name,
                  },
                });
              }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  marginRight: 10,

                  justifyContent: 'flex-end',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    width: 36,
                    height: 36,
                    backgroundColor: '#3F713B',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 20,
                  }}>
                  <Image
                    source={place_detail_direction_white}
                    style={styles.directionIcon}
                    resizeMode="contain"
                  />
                </View>
              </View>
            </TouchableOpacity>
            <View>
              <Image
                source={importanceIcon}
                style={styles.importanceIcon}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>{place?.description}</Text>
        </View>
      </View>
      <View style={styles.placeMediaContainer}>
        <View style={styles.placeMediaIntroContainer}>
          <Text style={styles.placeMediaIntroText}>
            {t('placeDetailExpanded.mediaIntro')}
          </Text>
        </View>
        <ScrollView
          scrollEventThrottle={16}
          style={{width: '100%', marginBottom: useSafeAreaInsets().bottom + 30}}
          showsVerticalScrollIndicator={false}>
          {placeMedia?.map((media, i) => (
            <PlaceMediaPill
              key={i}
              media={media}
              place={place}
              setPlace={setPlace}
              placeMedia={placeMedia}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    height: 200,
    borderTopLeftRadius: BORDER_RADIUS,
    borderTopRightRadius: BORDER_RADIUS,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: BORDER_RADIUS,
    borderTopRightRadius: BORDER_RADIUS,
  },
  arrowContainer: {
    position: 'absolute',
    width: '100%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linearGradient: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: BORDER_RADIUS,
    borderTopRightRadius: BORDER_RADIUS,
  },
  arrowIcon: {
    height: 30,
    width: 30,
  },
  infoContainer: {backgroundColor: 'white', paddingHorizontal: 15},
  basicInfoConatiner: {
    paddingVertical: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  placeName: {
    fontSize: 14,
    color: '#032000',
    fontFamily: 'Montserrat-SemiBold',
  },
  placeAddress: {
    fontSize: 14,
    color: '#032000',
    fontFamily: 'Montserrat-Regular',
    paddingVertical: 5,
  },
  directionIcon: {width: 22, height: 22},
  importanceIcon: {width: 40, height: 40},
  descriptionContainer: {paddingBottom: 20},
  descriptionText: {
    color: '#032000',
    textAlign: 'justify',
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
  },
  placeMediaContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#ECF3EC',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  placeMediaIntroContainer: {
    paddingVertical: 10,
    alignSelf: 'flex-start',
  },
  placeMediaIntroText: {
    color: '#3F713B',
    fontSize: 12,
    fontFamily: 'Montserrat-SemiBold',
  },
});
