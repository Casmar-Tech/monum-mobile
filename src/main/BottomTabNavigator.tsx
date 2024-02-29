import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect, useRef} from 'react';
import {StyleSheet, Image, StatusBar, Platform} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import bottom_bar_list_inactive from '../assets/images/icons/bottom_bar_list_inactive.png';
import bottom_bar_map_inactive from '../assets/images/icons/bottom_bar_map_inactive.png';
import bottom_bar_config_inactive from '../assets/images/icons/bottom_bar_config_inactive.png';
import MapScreen from './map/screens/MapScreen';

import MediaComponent from './media/components/MediaComponent';
import RoutesNavigator from './routes/navigator/RoutesNavigator';
import ProfileNavigator from './profile/navigator/ProfileNavigator';
import {Camera, MapView} from '@rnmapbox/maps';
import {Event, State, useTrackPlayerEvents} from 'react-native-track-player';
import {useApplicationStore} from '../zustand/ApplicationStore';

const BOTTOM_TAB_NAVIGATOR_HEIGHT = Platform.OS === 'android' ? 70 : 56;

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
  const bottomSafeArea = useSafeAreaInsets().bottom;
  const isTabBarVisible = useApplicationStore(
    state => state.application.isTabBarVisible,
  );
  const markerSelected = useApplicationStore(
    state => state.application.markerSelected,
  );
  const mediaPlace = useApplicationStore(state => state.application.mediaPlace);
  const showPlaceDetailExpanded = useApplicationStore(
    state => state.application.showPlaceDetailExpanded,
  );
  const activeTab = useApplicationStore(state => state.application.activeTab);
  const setActiveTab = useApplicationStore(state => state.setActiveTab);
  const statePlayer = useApplicationStore(
    state => state.application.statePlayer,
  );
  const setStatePlayer = useApplicationStore(state => state.setStatePlayer);
  useTrackPlayerEvents([Event.PlaybackState], async event => {
    setStatePlayer(event.state);
  });

  const mapRef = useRef<MapView>(null);
  const cameraRef = useRef<Camera>(null);
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

  useEffect(() => {}, []);

  return (
    <NavigationContainer independent={true}>
      <StatusBar translucent barStyle="dark-content" />
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
          tabBarHideOnKeyboard: true,
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
          {() => <RoutesNavigator cameraRef={cameraRef} mapRef={mapRef} />}
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
                display: isTabBarVisible ? 'flex' : 'none',
                height: bottomSafeArea + BOTTOM_TAB_NAVIGATOR_HEIGHT,
              },
            ],
          }}>
          {() => <MapScreen cameraRef={cameraRef} mapRef={mapRef} />}
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
      {mediaPlace &&
        statePlayer !== State.None &&
        (activeTab === 'Map'
          ? (markerSelected && showPlaceDetailExpanded) || !markerSelected
          : true) && <MediaComponent />}
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
