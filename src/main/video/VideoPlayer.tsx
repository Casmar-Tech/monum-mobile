import Orientation, {
  useOrientationChange,
} from 'react-native-orientation-locker';
import {useEffect, useRef, useState} from 'react';
import {useMainStore} from '../../zustand/MainStore';
import {
  BackHandler,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Video, {VideoRef} from 'react-native-video';
import video_player_close from '../../assets/images/icons/video_player_close.png';

export default function VideoPlayer() {
  const ref = useRef<VideoRef>(null);
  const setVideoPlayer = useMainStore(state => state.setVideoPlayer);
  const setVideoUrl = useMainStore(state => state.setVideoUrl);
  const videoUrl = useMainStore(state => state.main.videoUrl);
  const [deviceOrientation, setDeviceOrientation] = useState('');

  useOrientationChange(orientation => {
    setDeviceOrientation(orientation);
  });

  const closeVideoPlayerAction = () => {
    Orientation.lockToPortrait();
    setVideoPlayer(false);
    setVideoUrl('');
    return true;
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      closeVideoPlayerAction,
    );
    return () => {
      backHandler.remove();
    };
  }, []);

  return (
    <View style={styles.backgroundVideo}>
      <Video
        ref={ref}
        source={{uri: videoUrl}}
        fullscreenAutorotate={true}
        fullscreenOrientation="all"
        resizeMode="contain"
        style={{width: '100%', height: '100%'}}
        controls={true}
        ignoreSilentSwitch="ignore"
      />
      {(deviceOrientation === 'PORTRAIT' && Platform.OS === 'android') ||
      Platform.OS === 'ios' ? (
        <TouchableOpacity
          style={[
            styles.closeButton,
            {top: deviceOrientation !== 'PORTRAIT' ? 60 : 120},
          ]}
          onPress={closeVideoPlayerAction}>
          <Image source={video_player_close} style={{height: 28, width: 20}} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundVideo: {
    position: 'absolute',
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0,1)',
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 120 : 50,
    left: 20,
    zIndex: 100,
  },
});
