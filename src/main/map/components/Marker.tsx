import {MarkerView} from '@rnmapbox/maps';
import {useState} from 'react';
import React, {useEffect} from 'react';
import {Image, TouchableOpacity} from 'react-native';

import map_marker_importance_1 from '../../../assets/images/icons/map_marker_importance_1.png';
import map_marker_importance_2 from '../../../assets/images/icons/map_marker_importance_2.png';
import map_marker_importance_3 from '../../../assets/images/icons/map_marker_importance_3.png';
import map_marker_importance_4 from '../../../assets/images/icons/map_marker_importance_4.png';
import map_marker_importance_5 from '../../../assets/images/icons/map_marker_importance_5.png';
import map_marker_importance_star from '../../../assets/images/icons/map_marker_importance_star.png';
import map_marker_importance_star_selected from '../../../assets/images/icons/map_marker_importance_star_selected.png';
import map_marker_importance_selected from '../../../assets/images/icons/map_marker_importance_selected.png';
import {IMarker} from '../../../shared/interfaces/IMarker';
import {useApplicationStore} from '../../../zustand/ApplicationStore';

export function MarkerComponent({
  id,
  coordinates,
  importance,
  selected,
}: IMarker) {
  const setMarkerSelected = useApplicationStore(
    state => state.setMarkerSelected,
  );
  const [icon, setIcon] = useState(map_marker_importance_1);
  const [dimensions, setDimensions] = useState(30);
  // const [backgroundColor, setBackgroundColor] = useState('white');
  const chooseIcon = () => {
    switch (importance) {
      case 1:
        setIcon(
          selected ? map_marker_importance_selected : map_marker_importance_1,
        );
        setDimensions(36);
        break;
      case 2:
        setIcon(
          selected ? map_marker_importance_selected : map_marker_importance_2,
        );
        setDimensions(42);
        break;
      case 3:
        setIcon(
          selected ? map_marker_importance_selected : map_marker_importance_3,
        );
        setDimensions(48);
        break;
      case 4:
        setIcon(
          selected ? map_marker_importance_selected : map_marker_importance_4,
        );
        setDimensions(54);
        break;
      case 5:
        setIcon(
          selected ? map_marker_importance_selected : map_marker_importance_5,
        );
        setDimensions(60);
        break;
      case 6:
        setIcon(
          selected
            ? map_marker_importance_star_selected
            : map_marker_importance_star,
        );
        setDimensions(60);
        break;
      default:
        setIcon(
          selected ? map_marker_importance_selected : map_marker_importance_1,
        );
        setDimensions(60);
        break;
    }
  };

  useEffect(() => {
    chooseIcon();
  }, [selected]);

  return (
    <MarkerView id={id} key={id} coordinate={coordinates}>
      <TouchableOpacity
        onPress={() => {
          setMarkerSelected(id);
        }}
        style={{
          // shadowColor: '#000',
          // shadowOffset: {width: 0, height: 2},
          // shadowOpacity: 0.5,
          // shadowRadius: 4,
          // backgroundColor: backgroundColor,
          // borderRadius: 30,
          width: dimensions,
          height: dimensions,
          // alignItems: 'center',
          // justifyContent: 'center',
          // elevation: 5,
          // margin: Platform.OS === 'android' ? 10 : 0,
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
