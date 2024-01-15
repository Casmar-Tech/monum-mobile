import {MarkerView} from '@rnmapbox/maps';
import {View} from 'react-native';

interface CurrentPositionMarkerProps {
  centerCoordinates: [number, number];
}

export default function CurrentPositionMarker({
  centerCoordinates,
}: CurrentPositionMarkerProps) {
  return (
    <MarkerView id={'center'} key={'center'} coordinate={centerCoordinates}>
      <View
        style={{
          backgroundColor: 'rgba(114,154,255,0.2)',
          width: 30,
          height: 30,
          borderRadius: 15,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            backgroundColor: 'white',
            width: 16,
            height: 16,
            borderRadius: 9,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              backgroundColor: '#2F69FF',
              width: 13,
              height: 13,
              borderRadius: 7.5,
            }}
          />
        </View>
      </View>
    </MarkerView>
  );
}
