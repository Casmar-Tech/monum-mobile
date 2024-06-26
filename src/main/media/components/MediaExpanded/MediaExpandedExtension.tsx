import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SharedValue, runOnJS, withTiming} from 'react-native-reanimated';
import {ScrollView} from 'react-native-gesture-handler';
import {useMainStore} from '../../../../zustand/MainStore';
import {useRef} from 'react';
import MediaPlayer from './MediaPlayer';
import place_pre_detail_arrow_top from '../../../../assets/images/icons/place_pre_detail_arrow_top.png';
import {useTranslation} from 'react-i18next';

const {height} = Dimensions.get('window');

interface MediaExpandedTextProps {
  position: SharedValue;
  extensionHeight: number;
  isFullExtended: boolean;
  setIsFullExtended: (isExtended: boolean) => void;
  setIsMain: (isMain: boolean) => void;
}

export default function MediaExpandedText({
  position,
  extensionHeight,
  isFullExtended,
  setIsFullExtended,
  setIsMain,
}: MediaExpandedTextProps) {
  const {t} = useTranslation();
  const currentTrack = useMainStore(state => state.main.currentTrack);
  const scrollRef = useRef<ScrollView>(null);
  return (
    <View style={styles.mediaOfPlaceGreatContainer}>
      <Pressable
        onPress={async () => {
          if (isFullExtended) {
            setIsFullExtended(false);
            position.value = withTiming(0, {duration: 300}, () => {
              runOnJS(setIsMain)(true);
            });
            scrollRef.current?.scrollTo({y: 0, animated: true});
          } else {
            setIsFullExtended(true);
            position.value = withTiming(
              -extensionHeight,
              {duration: 300},
              () => {
                runOnJS(setIsMain)(false);
              },
            );
          }
        }}
        style={{marginBottom: 10}}>
        <View
          style={{
            width: '100%',
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {isFullExtended && (
            <Image
              source={place_pre_detail_arrow_top}
              resizeMode="contain"
              style={{
                transform: [{rotate: '180deg'}],
                width: 24,
              }}
            />
          )}
        </View>
        <View
          style={{
            width: '100%',
            height: 20,
          }}>
          <Text style={styles.placeMediaIntroText}>
            {currentTrack?.mediaType === 'text'
              ? t('mediaDetailExpanded.introTextMediaType')
              : t('mediaDetailExpanded.introAudioMediaType')}
          </Text>
        </View>
      </Pressable>
      <View>
        <ScrollView
          style={{width: '100%', height: height * 0.6}}
          ref={scrollRef}
          scrollEnabled={isFullExtended}>
          <Text style={styles.descriptionText}>{currentTrack?.text}</Text>
        </ScrollView>
      </View>
      <View
        style={{
          marginBottom: 80,
          marginTop: 20,
        }}>
        <MediaPlayer />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mediaOfPlaceGreatContainer: {
    marginTop: 50,
    alignSelf: 'flex-start',
    backgroundColor: '#ECF3EC',
    paddingHorizontal: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    width: '100%',
    height: '100%',
    flex: 1,
  },
  mediaOfPlaceContainer: {
    alignSelf: 'flex-start',
    width: '100%',
    height: '65%',
  },
  placeMediaIntroText: {
    color: '#3F713B',
    fontSize: 12,
    fontFamily: 'Montserrat-SemiBold',
  },
  descriptionText: {
    color: '#032000',
    textAlign: 'justify',
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
  },
  infoContainer: {
    marginTop: 40,
    paddingHorizontal: 12,
  },
  basicInfoContainer: {
    paddingVertical: 10,
    height: 70,
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
});
