import {StyleSheet, Text, TouchableOpacity, View, Image} from 'react-native';
import React, {useRef, useState} from 'react';
import IMedia from '../../../../shared/interfaces/IMedia';
import place_detail_media_rating_star from '../../../../assets/images/icons/place_detail_media_rating_star.png';
import place_detail_play_media from '../../../../assets/images/icons/place_detail_play_media.png';
import TrackPlayer, {RepeatMode} from 'react-native-track-player';
import {useTabMapStore} from '../../../../zustand/TabMapStore';
import {useMainStore} from '../../../../zustand/MainStore';
import Video, {VideoRef} from 'react-native-video';
import background from '../../../../assets/videos/background.mp4';

interface MediaOfPlacePillProps {
  index: number;
  media: IMedia;
}

export default function MediaOfPlacePill({
  index,
  media,
}: MediaOfPlacePillProps) {
  const videoRef = useRef<VideoRef>(null);
  const place = useTabMapStore(state => state.tabMap.place);
  const setPlaceOfMedia = useMainStore(state => state.setPlaceOfMedia);
  const mediasOfPlace = useTabMapStore(state => state.tabMap.mediasOfPlace);
  const [videoPlayer, setVideoPlayer] = useState(false);
  if (!mediasOfPlace || !Array.isArray(mediasOfPlace)) {
    return null;
  }
  const isLastPill =
    Array.isArray(mediasOfPlace) && index === mediasOfPlace.length - 1;

  if (videoPlayer) {
    console.log('videoPlayer', videoPlayer);
    return (
      <Video
        source={background}
        ref={videoRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
        }}
      />
    );
  }
  return (
    <TouchableOpacity
      onPress={async () => {
        try {
          setVideoPlayer(true);
          // setPlaceOfMedia(place);
          // await TrackPlayer.reset();
          // await TrackPlayer.add(
          //   mediasOfPlace.map(mediaOfPlace => ({
          //     id: mediaOfPlace.id,
          //     url: mediaOfPlace.audioUrl,
          //     title: mediaOfPlace.title,
          //     artist: 'Monum',
          //     rating: mediaOfPlace.rating,
          //   })),
          // );
          // await TrackPlayer.skip(index);
          // await TrackPlayer.setRepeatMode(RepeatMode.Queue);
          // await TrackPlayer.play();
        } catch (e) {
          console.log(e);
        }
      }}>
      <View
        style={[
          styles.placeMediaPillContainer,
          {marginBottom: isLastPill ? 100 : 0},
        ]}>
        <View style={styles.placeMediaPill}>
          <View style={{width: '90%'}}>
            <Text style={styles.placeMediaPillTitle} numberOfLines={1}>
              {media.title}
            </Text>
            <Text style={styles.placeMediaPillDuration}>
              {`${(media.duration ? media.duration / 60 : 0).toFixed(0)} min`}
            </Text>
          </View>
          <View>
            <Image
              source={place_detail_play_media}
              style={styles.placeMediaPillPlayIcon}
              resizeMode="contain"
            />
          </View>
        </View>
        <View style={styles.mediaPillRatingContainer}>
          <Text style={styles.mediaPillRatingText}>
            {`${media.rating.toFixed(1)}`}
          </Text>
          <View>
            <Image
              source={place_detail_media_rating_star}
              style={styles.mediaPillRatingImage}
              resizeMode="contain"
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  placeMediaPillContainer: {
    width: '100%',
    height: 70,
    shadowColor: '#C0DCBE',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 5,
  },
  placeMediaPill: {
    height: 50,
    borderRadius: 12,
    backgroundColor: 'white',
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingBottom: 5,
    paddingTop: 10,
  },
  placeMediaPillTitle: {
    fontSize: 12,
    color: '#3F713B',
    fontFamily: 'Montserrat-Regular',
  },
  placeMediaPillDuration: {
    fontSize: 10,
    color: '#3F713B',
    fontFamily: 'Montserrat-Regular',
  },
  placeMediaPillPlayIcon: {width: 24, height: 24},
  mediaPillRatingContainer: {
    position: 'absolute',
    top: 0,
    left: 10,
    height: 20,
    width: 30,
    backgroundColor: '#3F713B',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
  },
  mediaPillRatingText: {
    fontSize: 8,
    color: 'white',
    fontFamily: 'Montserrat-Regular',
  },
  mediaPillRatingImage: {width: 8, height: 8},
});
