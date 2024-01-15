import React from 'react';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import map_center_coordinates from '../../../assets/images/icons/map_center_coordinates.png';

interface CenterCoordinatesButtonProps {
  setCenterCamera: any;
}

export default function CenterCoordinatesButton({
  setCenterCamera,
}: CenterCoordinatesButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.centerCoordinatesContainer,
        {bottom: useSafeAreaInsets().bottom + 80},
      ]}
      onPress={() => {
        setCenterCamera(true);
      }}>
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
    width: 48,
    height: 48,
    borderRadius: 10,
    right: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  centerCoordinatesIcon: {
    width: 32,
    height: 32,
  },
});
