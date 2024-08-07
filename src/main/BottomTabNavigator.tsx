import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Orientation from 'react-native-orientation-locker';
import {
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import {useEffect, useRef, useState} from 'react';
import {StyleSheet, Image, StatusBar, Platform} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import bottom_bar_list_inactive from '../assets/images/icons/bottom_bar_list_inactive.png';
import bottom_bar_map_inactive from '../assets/images/icons/bottom_bar_map_inactive.png';
import bottom_bar_config_inactive from '../assets/images/icons/bottom_bar_config_inactive.png';

import MediaComponent from './media/components/MediaComponent';
import RoutesNavigator from './routes/navigator/RoutesNavigator';
import ProfileNavigator from './profile/navigator/ProfileNavigator';
import TrackPlayer, {
  Event,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import {useTabMapStore} from '../zustand/TabMapStore';
import {useMainStore} from '../zustand/MainStore';
import VideoPlayer from './video/VideoPlayer';
import MapNavigator from './map/navigator/MapNavigator';

export const BOTTOM_TAB_NAVIGATOR_HEIGHT = Platform.OS === 'android' ? 70 : 60;

// Define un tipo para las rutas
export type RootBottomTabList = {
  Routes: undefined;
  Map: undefined;
  Profile: undefined;
};

// Define un tipo para los Bottom Tab Icons
export type BottomTabBarIconProps = {
  focused: boolean;
  name?: string;
};

const Tab = createBottomTabNavigator<RootBottomTabList>();

function BottomTabNavigator() {
  const navigationRef = useRef<NavigationContainerRef<RootBottomTabList>>(null);
  const bottomSafeArea = useSafeAreaInsets().bottom;
  const markerSelected = useTabMapStore(state => state.tabMap.markerSelected);
  const placeOfMedia = useMainStore(state => state.main.placeOfMedia);
  const showPlaceDetailExpanded = useTabMapStore(
    state => state.tabMap.showPlaceDetailExpanded,
  );
  const activeTab = useMainStore(state => state.main.activeTab);
  const setActiveTab = useMainStore(state => state.setActiveTab);
  const setStatePlayer = useMainStore(state => state.setStatePlayer);
  const currentTrack = useMainStore(state => state.main.currentTrack);
  const setCurrentTrack = useMainStore(state => state.setCurrentTrack);
  const setCurrentTrackIndex = useMainStore(
    state => state.setCurrentTrackIndex,
  );

  const [showMedia, setShowMedia] = useState(false);

  useTrackPlayerEvents([Event.PlaybackState], async event => {
    setStatePlayer(event.state);
  });

  useTrackPlayerEvents([Event.PlaybackActiveTrackChanged], async event => {
    if (
      event.type === Event.PlaybackActiveTrackChanged &&
      event.track !== null
    ) {
      try {
        const track = await TrackPlayer.getActiveTrack();
        const index = await TrackPlayer.getActiveTrackIndex();

        if (track !== null && index !== null) {
          setCurrentTrack(track);
          setCurrentTrackIndex(index);
        }
      } catch (e) {
        console.log(e);
      }
    }
  });

  const videoPlayer = useMainStore(state => state.main.videoPlayer);

  useEffect(() => {
    if (navigationRef.current) {
      if (
        activeTab === 'Routes' ||
        activeTab === 'Map' ||
        activeTab === 'Profile'
      ) {
        navigationRef.current.navigate(activeTab);
      }
    }
  }, [activeTab]);

  const renderTabBarIcon = ({focused, name}: BottomTabBarIconProps) => {
    let source;
    switch (name) {
      case 'Routes':
        source = bottom_bar_list_inactive;
        break;
      case 'Map':
        source = bottom_bar_map_inactive;
        break;
      case 'Profile':
        source = bottom_bar_config_inactive;
        break;
      default:
        source = bottom_bar_config_inactive;
        break;
    }
    return (
      <Image
        source={source}
        style={[
          styles.bottom_bar_logo_image,
          {
            tintColor: focused ? '#3F713B' : '#BDBDBD',
          },
        ]}
        resizeMode="contain"
      />
    );
  };

  useEffect(() => {
    if (videoPlayer) {
      Orientation.unlockAllOrientations();
    } else {
      Orientation.lockToPortrait();
    }
  }, [videoPlayer]);

  useEffect(() => {
    if (!placeOfMedia) {
      setShowMedia(false);
      return;
    }
    if (activeTab !== 'Map') {
      setShowMedia(true);
    } else {
      if (!markerSelected) {
        setShowMedia(true);
      } else if (markerSelected && showPlaceDetailExpanded) {
        setShowMedia(true);
      } else {
        setShowMedia(false);
      }
    }
  }, [
    placeOfMedia,
    activeTab,
    markerSelected,
    showPlaceDetailExpanded,
    currentTrack,
  ]);

  return (
    <NavigationContainer independent={true} ref={navigationRef}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <Tab.Navigator
        initialRouteName="Map"
        screenOptions={{
          tabBarStyle: [
            styles.map,
            {
              height: bottomSafeArea + BOTTOM_TAB_NAVIGATOR_HEIGHT,
            },
          ],
          tabBarShowLabel: false,
          headerShown: false,
        }}>
        <Tab.Screen
          name="Routes"
          listeners={{
            focus: () => setActiveTab('Routes'),
          }}
          options={{
            tabBarIcon: ({focused}) =>
              renderTabBarIcon({focused, name: 'Routes'}),
          }}>
          {() => <RoutesNavigator />}
        </Tab.Screen>
        <Tab.Screen
          name="Map"
          listeners={{
            focus: () => setActiveTab('Map'),
          }}
          options={{
            tabBarIcon: ({focused}) => renderTabBarIcon({focused, name: 'Map'}),
            tabBarStyle: [
              styles.map,
              {
                display: 'flex',
                height: bottomSafeArea + BOTTOM_TAB_NAVIGATOR_HEIGHT,
              },
            ],
          }}>
          {() => <MapNavigator />}
        </Tab.Screen>
        <Tab.Screen
          name="Profile"
          listeners={{
            focus: () => setActiveTab('Profile'),
          }}
          options={{
            tabBarIcon: ({focused}) =>
              renderTabBarIcon({focused, name: 'Profile'}),
          }}>
          {() => <ProfileNavigator />}
        </Tab.Screen>
      </Tab.Navigator>
      {showMedia && <MediaComponent />}
      {videoPlayer && <VideoPlayer />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  bottom_bar_logo_image: {
    width: 30,
    height: 30,
  },
  map: {
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 10,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: -30,
  },
});

export default BottomTabNavigator;
