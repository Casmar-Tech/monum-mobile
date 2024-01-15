import {t} from 'i18next';
import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import place_detail_arrow_bottom_white from '../../../assets/images/icons/place_detail_arrow_bottom_white.png';
import place_detail_media_rating_star from '../../../assets/images/icons/place_detail_media_rating_star.png';
import media_expanded_back from '../../../assets/images/icons/media_expanded_back.png';
import media_expanded_forward from '../../../assets/images/icons/media_expanded_forward.png';
import media_expanded_play from '../../../assets/images/icons/media_expanded_play.png';
import media_expanded_pause from '../../../assets/images/icons/media_expanded_pause.png';
import IPlace from '../../../shared/interfaces/IPlace';
import {Slider} from '@rneui/themed';
import TrackPlayer, {Progress, State} from 'react-native-track-player';

export function secondsToMinutes(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const paddedMinutes = String(minutes);
  const paddedSeconds = String(remainingSeconds.toFixed(0)).padStart(2, '0');

  return `${paddedMinutes}.${paddedSeconds}`;
}

const {height} = Dimensions.get('window');

interface MediaExpandedProps {
  place: IPlace;
  setExpandedDetail: Dispatch<SetStateAction<boolean>>;
  statePlayer: State;
  currentTrack: number;
  trackRating: number;
  trackTitle: string;
  progress: Progress;
}

type GestureContext = {
  startY: number;
};

export default function MediaExpanded({
  place,
  setExpandedDetail,
  statePlayer,
  currentTrack,
  trackRating,
  trackTitle,
  progress,
}: MediaExpandedProps) {
  const position = useSharedValue(height);
  const panGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    GestureContext
  >({
    onStart: (_, context) => {
      context.startY = position.value;
    },
    onActive: (event, context) => {
      const newPosition = context.startY + event.translationY;
      if (newPosition <= 0) {
        position.value = 0;
      } else {
        position.value = newPosition;
      }
    },
    onEnd: event => {
      if (position.value > height / 2 || event.velocityY > 0) {
        position.value = withTiming(height);
        runOnJS(setExpandedDetail)(false);
      } else {
        position.value = withTiming(0);
      }
    },
  });
  const animatedStyle = useAnimatedStyle(() => {
    return {
      marginTop: position.value,
    };
  });

  useEffect(() => {
    position.value = withTiming(0, {duration: 300});
  }, []);

  return (
    statePlayer !== State.None && (
      <View style={styles.container}>
        <PanGestureHandler onGestureEvent={panGestureEvent}>
          <Animated.View style={[styles.animatedContainer, animatedStyle]}>
            <View style={{flex: 1}}>
              <View style={[styles.imageContainer, {height: height * 0.65}]}>
                <Image
                  source={{
                    uri: Array.isArray(place.imagesUrl)
                      ? place.imagesUrl[0]
                      : '',
                  }}
                  resizeMode="cover"
                  style={styles.image}
                />
                <View style={styles.arrowContainer}>
                  <LinearGradient
                    start={{x: 0, y: 0}}
                    end={{x: 0, y: 1}}
                    colors={['rgba(3, 32, 0, 1)', 'rgba(3, 32, 0, 0)']}
                    style={styles.linearGradient}
                  />
                  <Image
                    source={place_detail_arrow_bottom_white}
                    style={[
                      styles.arrowIcon,
                      {top: 10 + useSafeAreaInsets().top},
                    ]}
                    resizeMode="contain"
                  />
                </View>
                <View style={styles.mediaPillRatingContainer}>
                  <Text style={styles.mediaPillRating}>
                    {`${trackRating.toFixed(1)}`}
                  </Text>
                  <View>
                    <Image
                      source={place_detail_media_rating_star}
                      style={{width: 10, height: 10}}
                      resizeMode="contain"
                    />
                  </View>
                </View>
              </View>
              <View style={styles.infoContainer}>
                <View style={styles.basicInfoConatiner}>
                  <Text style={styles.mediaTitle}>{trackTitle}</Text>
                  <Text style={styles.placeName}>{place.name}</Text>
                </View>
              </View>
              <View style={styles.mediaPlayerContainer}>
                <Slider
                  onSlidingComplete={value => {
                    TrackPlayer.seekTo(value * progress.duration);
                  }}
                  value={
                    progress.duration === 0
                      ? 0
                      : progress.position / progress.duration
                  }
                  style={{
                    height: 16,
                    width: '100%',
                  }}
                  minimumValue={0}
                  maximumTrackTintColor="grey"
                  minimumTrackTintColor="#3F713B"
                  thumbStyle={{width: 16, height: 16}}
                  trackStyle={{height: 8}}
                  thumbTintColor="#3F713B"
                />
                <View style={styles.mediaPlayerButtonsContainer}>
                  <TouchableOpacity
                    style={styles.mediaPlayerButtons}
                    onPress={async () => {
                      try {
                        if (currentTrack === 0) {
                          await TrackPlayer.seekTo(0);
                        } else {
                          await TrackPlayer.skipToPrevious();
                        }
                        await TrackPlayer.play();
                      } catch (e) {
                        console.log(e);
                      }
                    }}>
                    <Image
                      source={media_expanded_back}
                      style={styles.mediaPlayerButtonsImage}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.mediaPlayerButtons}
                    onPress={async () =>
                      statePlayer === State.Paused
                        ? await TrackPlayer.play()
                        : await TrackPlayer.pause()
                    }>
                    <Image
                      source={
                        statePlayer === State.Paused
                          ? media_expanded_play
                          : media_expanded_pause
                      }
                      style={styles.mediaPlayerButtonsPlayImage}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.mediaPlayerButtons}
                    onPress={async () => {
                      try {
                        await TrackPlayer.skipToNext();
                        await TrackPlayer.play();
                      } catch (e) {
                        console.log(e);
                      }
                    }}>
                    <Image
                      source={media_expanded_forward}
                      style={styles.mediaPlayerButtonsImage}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.durationMediaContainer}>
                  <Text style={styles.durationMediaText}>
                    {secondsToMinutes(progress.position)}
                  </Text>
                  <Text style={styles.durationMediaText}>
                    -{secondsToMinutes(progress.duration - progress.position)}
                  </Text>
                </View>
              </View>
              <View style={styles.placeMediaIntroContainer}>
                <Text style={styles.placeMediaIntroText}>
                  {t('placeDetailExpanded.mediaIntro')}
                </Text>
                <Text style={styles.descriptionText}>{place.description}</Text>
              </View>
            </View>
          </Animated.View>
        </PanGestureHandler>
      </View>
    )
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  animatedContainer: {
    backgroundColor: 'white',
    flex: 1,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 10,
  },
  imageContainer: {
    marginBottom: 13,
  },
  image: {
    top: 0,
    width: '100%',
    height: '100%',
    bottom: 0,
    paddingBottom: 13,
  },
  arrowContainer: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linearGradient: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  arrowIcon: {
    position: 'absolute',
    height: 30,
    width: 30,
  },
  mediaPillRatingContainer: {
    position: 'absolute',
    bottom: -13,
    left: 12,
    height: 26,
    width: 44,
    backgroundColor: '#3F713B',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    borderColor: 'white',
    borderWidth: 1,
  },
  mediaPillRating: {
    fontSize: 14,
    color: 'white',
  },
  infoContainer: {backgroundColor: 'white', paddingHorizontal: 12},
  basicInfoConatiner: {
    paddingVertical: 10,
    justifyContent: 'space-between',
    height: 50,
  },
  mediaTitle: {
    fontSize: 16,
    color: '#032000',
    fontFamily: 'Montserrat-SemiBold',
  },
  placeName: {
    fontSize: 14,
    color: '#032000',
    fontFamily: 'Montserrat-Regular',
  },
  mediaPlayerContainer: {
    marginVertical: 15,
    justifyContent: 'space-between',
    height: 60,
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  mediaPlayerButtonsContainer: {flexDirection: 'row', width: 140},
  mediaPlayerButtons: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaPlayerButtonsImage: {width: 10, height: 14},
  mediaPlayerButtonsPlayImage: {width: 30, height: 30},
  durationMediaContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  durationMediaText: {
    fontSize: 12,
    color: '#032000',
    fontFamily: 'Montserrat-Regular',
  },
  placeMediaIntroContainer: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    backgroundColor: '#ECF3EC',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    width: '100%',
    height: '100%',
  },
  placeMediaIntroText: {
    color: '#3F713B',
    fontSize: 12,
    fontFamily: 'Montserrat-SemiBold',
  },
  descriptionText: {
    color: '#032000',
    textAlign: 'justify',
    paddingTop: 20,
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
  },
});
