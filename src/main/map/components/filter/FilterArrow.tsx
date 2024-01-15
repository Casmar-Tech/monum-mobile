import React from 'react';
import {
  Dimensions,
  GestureResponderEvent,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import map_filter_arrow from '../../../assets/images/icons/map_filter_arrow.png';

interface FilterArrowProps {
  onPress?: (event: GestureResponderEvent) => void;
  direction: 'right' | 'left';
}

export default function FilterArrow({onPress, direction}: FilterArrowProps) {
  return (
    <TouchableOpacity
      style={[
        styles.filterArrow,
        direction === 'right' ? {left: 10} : {right: -10},
        {top: useSafeAreaInsets().top},
      ]}
      onPress={onPress}>
      <Image
        source={map_filter_arrow}
        style={[
          styles.filterArrowIcon,
          {transform: [{rotate: direction === 'right' ? '180deg' : '0deg'}]},
        ]}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  filterArrow: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 30,
    paddingVertical: 5,
    height: 30,
    width: 30,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 10,
    marginVertical: 30,
    marginRight: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterArrowIcon: {
    width: '65%',
    height: '65%',
  },
});
