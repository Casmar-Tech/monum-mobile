import {MarkerView} from '@rnmapbox/maps';
import {useState} from 'react';
import React, {useEffect} from 'react';
import {Image, TouchableOpacity} from 'react-native';

import map_marker_importance_1 from '../../../assets/images/icons/map_marker_importance_1.png';
import map_marker_importance_2 from '../../../assets/images/icons/map_marker_importance_2.png';
import map_marker_importance_3 from '../../../assets/images/icons/map_marker_importance_3.png';
import map_marker_importance_1_selected from '../../../assets/images/icons/map_marker_importance_1_selected.png';
import map_marker_importance_2_selected from '../../../assets/images/icons/map_marker_importance_2_selected.png';
import map_marker_importance_3_selected from '../../../assets/images/icons/map_marker_importance_3_selected.png';
import {IMarker} from '../../../shared/interfaces/IMarker';
import {useTabMapStore} from '../../../zustand/TabMapStore';

export function MarkerComponent({id, coordinates, importance}: IMarker) {
  const setMarkerSelected = useTabMapStore(state => state.setMarkerSelected);
  const markerSelected = useTabMapStore(state => state.tabMap.markerSelected);
  const [icon, setIcon] = useState(map_marker_importance_1);
  const [dimensions, setDimensions] = useState(30);
  // const [backgroundColor, setBackgroundColor] = useState('white');
  const chooseIcon = () => {
    const selected = markerSelected === id;
    switch (importance) {
      case 1:
        setIcon(
          selected ? map_marker_importance_1_selected : map_marker_importance_1,
        );
        setDimensions(50);
        break;
      case 2:
        setIcon(
          selected ? map_marker_importance_2_selected : map_marker_importance_2,
        );
        setDimensions(50);
        break;
      case 3:
        setIcon(
          selected ? map_marker_importance_3_selected : map_marker_importance_3,
        );
        setDimensions(50);
        break;
      default:
        setIcon(
          selected ? map_marker_importance_1_selected : map_marker_importance_1,
        );
        setDimensions(50);
        break;
    }
  };

  useEffect(() => {
    chooseIcon();
  }, [markerSelected]);

  return (
    <MarkerView id={id} key={id} coordinate={coordinates}>
      <TouchableOpacity
        onPress={() => {
          setMarkerSelected(id);
        }}
        style={{
          width: dimensions,
          height: dimensions,
        }}>
        <Image
          source={icon}
          style={{width: '100%', height: '100%'}}
          resizeMode={'contain'}
        />
      </TouchableOpacity>
    </MarkerView>
  );
}
