import React from 'react';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';

import map_center_coordinates from '../../../assets/images/icons/map_center_coordinates.png';

interface CenterCoordinatesButtonProps {
  onPress: () => void;
}

export default function CenterCoordinatesButton({
  onPress,
}: CenterCoordinatesButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.centerCoordinatesContainer, {bottom: 10}]}
      onPress={onPress}>
      <Image
        source={map_center_coordinates}
        style={styles.centerCoordinatesIcon}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  centerCoordinatesContainer: {
    position: 'absolute',
    backgroundColor: 'white',
    width: 40,
    height: 40,
    borderRadius: 10,
    right: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  centerCoordinatesIcon: {
    width: 28,
    height: 28,
  },
});
