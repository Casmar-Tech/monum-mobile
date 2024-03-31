/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {Dimensions, Platform, StyleSheet, View} from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import place_pre_detail_importance_1 from '../../../../assets/images/icons/placeImportance/place_pre_detail_importance_1.png';
import place_pre_detail_importance_2 from '../../../../assets/images/icons/placeImportance/place_pre_detail_importance_2.png';
import place_pre_detail_importance_3 from '../../../../assets/images/icons/placeImportance/place_pre_detail_importance_3.png';

import MapPlaceDetailExpanded from './MapPlaceDetailExpanded';
import MapPlaceDetailReduced from './MapPlaceDetailReduced';
import MapServices from '../../services/MapServices';
import {useTabMapStore} from '../../../../zustand/TabMapStore';
import {useMainStore} from '../../../../zustand/MainStore';
import {useUserStore} from '../../../../zustand/UserStore';

const {height} = Dimensions.get('screen');

const BOTTOM_TAB_NAVIGATOR_HEIGHT = Platform.OS === 'android' ? 70 : 56;
const BOTTOM_TAB_HEIGHT = 130;
const MAX_MARGIN_TOP = 50;

type GestureContext = {
  startY: number;
};

export default function MapPlaceDetail() {
  const markerSelected = useTabMapStore(state => state.tabMap.markerSelected);
  const setMarkerSelected = useTabMapStore(state => state.setMarkerSelected);
  const place = useTabMapStore(state => state.tabMap.place);
  const setPlace = useTabMapStore(state => state.setPlace);
  const showPlaceDetailExpanded = useTabMapStore(
    state => state.tabMap.showPlaceDetailExpanded,
  );
  const setShowPlaceDetailExpanded = useTabMapStore(
    state => state.setShowPlaceDetailExpanded,
  );
  const mediasOfPlace = useTabMapStore(state => state.tabMap.mediasOfPlace);
  const setMediasOfPlace = useTabMapStore(state => state.setMediasOfPlace);

  const setTabBarVisible = useMainStore(state => state.setTabBarVisible);
  const language = useUserStore(state => state.user.language);

  const BOTTOM_TOTAL_TAB_HEIGHT =
    useSafeAreaInsets().bottom +
    BOTTOM_TAB_NAVIGATOR_HEIGHT +
    BOTTOM_TAB_HEIGHT;

  const [closeDetail, setCloseDetail] = useState(false);
  const position = useSharedValue(height);

  const importanceIcon = () => {
    switch (place?.importance) {
      case 1:
        return place_pre_detail_importance_1;
      case 2:
        return place_pre_detail_importance_2;
      case 3:
        return place_pre_detail_importance_3;
      default:
        return place_pre_detail_importance_1;
    }
  };

  const panGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    GestureContext
  >({
    onStart: (_, context) => {
      context.startY = position.value;
    },
    onActive: (event, context) => {
      const newPosition = context.startY + event.translationY;
      if (!showPlaceDetailExpanded) {
        if (height - newPosition >= BOTTOM_TOTAL_TAB_HEIGHT) {
          position.value = height - BOTTOM_TOTAL_TAB_HEIGHT;
        } else {
          position.value = newPosition;
        }
      } else {
        if (newPosition <= MAX_MARGIN_TOP) {
          position.value = MAX_MARGIN_TOP;
        } else {
          position.value = newPosition;
        }
      }
    },
    onEnd: event => {
      if (!showPlaceDetailExpanded) {
        if (
          position.value > height - BOTTOM_TOTAL_TAB_HEIGHT / 2 ||
          event.velocityY > 0
        ) {
          position.value = withTiming(height, {duration: 300}, () => {
            runOnJS(setCloseDetail)(true);
            runOnJS(setTabBarVisible)(true);
          });
        } else {
          position.value = withTiming(height - BOTTOM_TOTAL_TAB_HEIGHT);
        }
      } else {
        if (position.value > height / 2 || event.velocityY > 0) {
          position.value = withTiming(height, {duration: 300}, () => {
            runOnJS(setCloseDetail)(true);
            runOnJS(setShowPlaceDetailExpanded)(false);
            runOnJS(setTabBarVisible)(true);
          });
        } else {
          position.value = withTiming(MAX_MARGIN_TOP);
        }
      }
    },
  });
  const animatedStyle = useAnimatedStyle(() => {
    if (position.value === height && closeDetail === true) {
      runOnJS(setMarkerSelected)(null);
      runOnJS(setCloseDetail)(false);
    }
    if (showPlaceDetailExpanded) {
      return {
        marginTop: position.value,
        top: 0,
        height,
      };
    }
    return {
      top: position.value,
      height: height - position.value,
    };
  });

  useEffect(() => {
    if (markerSelected) {
      const fetchPlace = async () => {
        const placeData = await MapServices.getPlaceInfo(
          markerSelected,
          language,
        );
        setPlace(placeData);
        const mediasFetched = await MapServices.getPlaceMedia(
          markerSelected,
          language,
        );
        setMediasOfPlace(mediasFetched);
        position.value = withTiming(height - BOTTOM_TOTAL_TAB_HEIGHT, {
          duration: 300,
        });
      };
      fetchPlace();
    }
  }, [markerSelected]);

  useEffect(() => {
    if (place && showPlaceDetailExpanded) {
      position.value = withTiming(MAX_MARGIN_TOP, {duration: 300});
    }
  }, [showPlaceDetailExpanded, place]);

  const closePlaceDetail = () => {
    position.value = withTiming(height, {duration: 300}, () => {
      runOnJS(setCloseDetail)(true);
      runOnJS(setShowPlaceDetailExpanded)(false);
      runOnJS(setTabBarVisible)(true);
    });
  };

  return markerSelected ? (
    <View
      style={[
        styles.container,
        {
          backgroundColor: showPlaceDetailExpanded
            ? 'rgba(0, 0, 0, 0.8)'
            : 'rgba(0, 0, 0, 0)',
        },
      ]}>
      <PanGestureHandler onGestureEvent={panGestureEvent}>
        <Animated.View style={[styles.animatedContainer, animatedStyle]}>
          {showPlaceDetailExpanded && place && Array.isArray(mediasOfPlace) ? (
            <MapPlaceDetailExpanded
              importanceIcon={importanceIcon()}
              closePlaceDetail={closePlaceDetail}
            />
          ) : (
            <MapPlaceDetailReduced importanceIcon={importanceIcon()} />
          )}
        </Animated.View>
      </PanGestureHandler>
    </View>
  ) : null;
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    zIndex: 3,
  },
  animatedContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: 'white',
    flex: 1,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 10,
  },
});
