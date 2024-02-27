import React, {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import IMedia from '../../../../shared/interfaces/IMedia';
import IPlace from '../../../../shared/interfaces/IPlace';
import {Image} from 'react-native';
import place_detail_media_rating_star from '../../../../assets/images/icons/place_detail_media_rating_star.png';
import place_detail_play_media from '../../../../assets/images/icons/place_detail_play_media.png';
import TrackPlayer, {RepeatMode} from 'react-native-track-player';
import {useApplicationStore} from '../../../../zustand/ApplicationStore';

interface RoutePlaceMediaPillProps {
  media: IMedia;
  place: IPlace;
}

export default function RoutePlaceMediaPill({
  media,
  place,
  style,
}: RoutePlaceMediaPillProps & {style?: ViewStyle}) {
  const mediasOfPlace = useApplicationStore(
    state => state.application.mediasOfPlace,
  );
  const setMediaPlace = useApplicationStore(state => state.setMediaPlace);
  return (
    <TouchableOpacity
      onPress={async () => {
        try {
          setMediaPlace(place);
          console.log('mediaOfPlace', place);
          await TrackPlayer.reset();
          Array.isArray(mediasOfPlace) &&
            (await TrackPlayer.add(
              mediasOfPlace.map(eachMedia => ({
                id: eachMedia.id,
                url: eachMedia.audioUrl,
                title: eachMedia.title,
                artist: 'Monum',
                rating: eachMedia.rating,
              })),
            ));
          await TrackPlayer.setRepeatMode(RepeatMode.Queue);
          await TrackPlayer.play();
        } catch (e) {
          console.log(e);
        }
      }}
      style={style}>
      <View style={styles.placeMediaPillContainer}>
        <View style={styles.placeMediaPill}>
          <View style={{maxWidth: '85%'}}>
            <Text numberOfLines={1} style={styles.placeMediaPillTitle}>
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
