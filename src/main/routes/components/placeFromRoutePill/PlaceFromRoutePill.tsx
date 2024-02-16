import {Image, ScrollView, Text, View, ViewStyle} from 'react-native';
import RatingPill from '../RatingPill';
import route_detail_contract_place from '../../../../assets/images/icons/route_detail_contract_place.png';
import route_detail_expand_place from '../../../../assets/images/icons/route_detail_expand_place.png';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  Dispatch,
  SetStateAction,
  forwardRef,
  useImperativeHandle,
  useState,
} from 'react';
import {StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native';
import RoutePlaceMediaPill from './RoutePlaceMediaPill';
import IMedia from '../../../../shared/interfaces/IMedia';
import {t} from 'i18next';
import IPlace from '../../../../shared/interfaces/IPlace';
import IStop from '../../../../shared/interfaces/IStop';
import {SheetManager} from 'react-native-actions-sheet';
import place_detail_direction_white from '../../../../assets/images/icons/place_detail_direction_white.png';
import {ImportanceIcon} from './ImportanceIcon';

type PlaceFromRoutePillProps = IStop & {
  style?: ViewStyle;
  setMediaPlace: Dispatch<SetStateAction<IPlace | null>>;
};

// Aquí definimos el tipo de la referencia, si tienes métodos específicos que quieres exponer, los añades aquí
export type PlaceFromRoutePillRef = {
  isExpanded: boolean;
  expandPill: () => void;
  highlightPill: () => void;
  reducePill: () => void;
  getLayout: () => {height: number};
};

const PlaceFromRoutePill = forwardRef<
  PlaceFromRoutePillRef,
  PlaceFromRoutePillProps
>(({place, medias, style, setMediaPlace}, ref) => {
  const [expandedPill, setExpandedPill] = useState<boolean>(false);
  const [highlightedPill, setHighlightedPill] = useState<boolean>(false);
  const animationValue = useSharedValue(0);

  useImperativeHandle(ref, () => ({
    isExpanded: expandedPill,
    expandPill: () => {
      expandPill();
    },
    highlightPill: () => {
      highlightPill();
    },
    reducePill: () => {
      reducePill();
    },
    getLayout: () => {
      return {
        height: animationValue.value * 150 + 60,
      };
    },
  }));

  const toggleExpanded = () => {
    expandedPill ? reducePill() : expandPill();
  };

  const expandPill = () => {
    animationValue.value = withTiming(1, {
      duration: 300,
      easing: Easing.bezier(0.5, 0.01, 0, 1),
    });
    setExpandedPill(true);
  };

  const reducePill = () => {
    animationValue.value = withTiming(0, {
      duration: 300,
      easing: Easing.bezier(0.5, 0.01, 0, 1),
    });
    setExpandedPill(false);
  };

  const highlightPill = () => {
    setHighlightedPill(true);
    setTimeout(() => {
      setHighlightedPill(false);
    }, 2000);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: animationValue.value * 150 + 60, // Interpolación manual entre 60 y 210
    };
  });
  return (
    <View
      style={[
        {
          width: '100%',
          elevation: 10,
        },
        style,
      ]}>
      <Animated.View
        style={[
          styles.placeMediaPillAnimated,
          animatedStyle,
          {backgroundColor: highlightedPill ? '#D6E5D6' : '#ECF3EC'},
        ]}>
        <View style={{flex: 1}}>
          <TouchableOpacity onPress={toggleExpanded}>
            <View
              style={[
                styles.placeMediaPillContainer,
                {marginBottom: expandedPill ? 10 : 17.5},
                {height: expandedPill ? 32.5 : 25},
                {backgroundColor: highlightedPill ? '#D6E5D6' : '#ECF3EC'},
              ]}>
              <View style={{width: '55%'}}>
                <Text numberOfLines={1} style={styles.placeNameText}>
                  {place.name}
                </Text>
                <Text
                  style={styles.placeDescriptionText}
                  numberOfLines={expandedPill ? 3 : 2}>
                  {place.description}
                </Text>
              </View>
              <View
                style={{
                  width: '45%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingLeft: 10,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'flex-end',
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
                        width: 30 * 0.9,
                        height: 30 * 0.9,
                        marginRight: 10,
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          width: 30 * 0.9,
                          height: 30 * 0.9,
                          backgroundColor: '#3F713B',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 30 * 0.9,
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
                      source={ImportanceIcon(place.importance)}
                      style={styles.importanceIcon}
                      resizeMode="contain"
                    />
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                  }}>
                  <Text style={styles.audiosNumberText}>
                    {`${medias?.length} ${
                      medias.length > 1 ? t('routes.audios') : t('routes.audio')
                    }`}
                  </Text>
                  <Image
                    source={
                      expandedPill
                        ? route_detail_contract_place
                        : route_detail_expand_place
                    }
                    style={{height: 6, width: 10.5, marginHorizontal: 10}}
                    resizeMode="contain"
                  />
                </View>
              </View>
            </View>
          </TouchableOpacity>
          {expandedPill && (
            <View style={{flex: 1}}>
              <View
                style={{
                  borderWidth: 0.5,
                  borderColor: '#BDBDBD',
                  borderRadius: 0,
                  marginHorizontal: -8,
                  marginBottom: 10,
                }}
              />
              <View
                style={[
                  styles.placeMediaContainer,
                  {backgroundColor: highlightedPill ? '#D6E5D6' : '#ECF3EC'},
                ]}>
                <View style={styles.placeMediaIntroContainer}>
                  <Text style={styles.placeMediaIntroText}>
                    {t('placeDetailExpanded.mediaIntro')}
                  </Text>
                </View>
                <ScrollView style={{width: '100%', marginTop: 8}}>
                  {medias?.map((media: IMedia, i: number) => (
                    <RoutePlaceMediaPill
                      key={i}
                      media={media}
                      place={place}
                      placeMedia={medias}
                      setMediaPlace={setMediaPlace}
                      style={
                        i === 0
                          ? {
                              paddingTop: -8,
                            }
                          : {}
                      }
                    />
                  ))}
                </ScrollView>
              </View>
            </View>
          )}
        </View>
      </Animated.View>
      <RatingPill
        number={place.rating || 0}
        additionalStyle={{position: 'absolute', top: 0, left: 10}}
      />
    </View>
  );
});

export default PlaceFromRoutePill;

const styles = StyleSheet.create({
  placeMediaPillAnimated: {
    borderRadius: 12,
    backgroundColor: '#ECF3EC',
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    shadowColor: '#C0DCBE',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 5,
    flex: 1,
  },
  placeMediaPillContainer: {
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 17.5,
  },
  placeNameText: {
    fontSize: 12,
    color: '#3F713B',
    fontFamily: 'Montserrat-Regular',
  },
  placeDescriptionText: {
    fontSize: 8,
    color: '#3F713B',
    fontFamily: 'Montserrat-Regular',
  },
  directionIcon: {width: 16, height: 16},
  importanceIcon: {width: 30, height: 30},
  audiosNumberText: {
    fontSize: 10,
    color: '#3F713B',
    fontFamily: 'Montserrat-Regular',
  },
  placeMediaContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#ECF3EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeMediaIntroContainer: {
    alignSelf: 'flex-start',
  },
  placeMediaIntroText: {
    color: '#3F713B',
    fontSize: 8,
    fontFamily: 'Montserrat-SemiBold',
  },
});
