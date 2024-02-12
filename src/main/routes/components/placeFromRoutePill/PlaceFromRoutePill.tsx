import {Image, ScrollView, Text, View, ViewStyle} from 'react-native';
import IPlaceFromRoute from '../../../../shared/interfaces/IPlaceFromRoute';
import RatingPill from '../RatingPill';
import route_detail_contract_place from '../../../../assets/images/icons/route_detail_contract_place.png';
import route_detail_expand_place from '../../../../assets/images/icons/route_detail_expand_place.png';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {forwardRef, useEffect, useImperativeHandle, useState} from 'react';
import {StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native';
import RoutePlaceMediaPill from './RoutePlaceMediaPill';
import IMedia from '../../../../shared/interfaces/IMedia';
import {t} from 'i18next';

type PlaceFromRoutePillProps = IPlaceFromRoute & {
  style?: ViewStyle;
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
>(({place, medias, style}, ref) => {
  const [expandedPill, setExpandedPill] = useState<boolean>(false);
  const [highlightedPill, setHighlightedPill] = useState<boolean>(false);
  const animationValue = useSharedValue(0);
  const [mediasToTry, setMediasToTry] = useState<IMedia[]>([]);

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

  useEffect(() => {
    const m = [];
    for (let i = 0; i < 5; i++) {
      m.push(medias[0]);
    }
    setMediasToTry(m);
  }, [medias]);

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
              <View style={{width: '75%'}}>
                <Text style={styles.placeNameText}>{place.name}</Text>
                <Text
                  style={styles.placeDescriptionText}
                  numberOfLines={expandedPill ? 3 : 2}>
                  {place.description}
                </Text>
              </View>
              <View
                style={{
                  width: '25%',
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
                  {mediasToTry?.map((media, i) => (
                    <RoutePlaceMediaPill
                      key={i}
                      media={media}
                      place={place}
                      setPlace={() => {}}
                      placeMedia={mediasToTry}
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
