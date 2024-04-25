import {MarkerView} from '@rnmapbox/maps';
import {useState} from 'react';
import {useEffect} from 'react';
import {Image, TouchableOpacity} from 'react-native';

import map_marker_importance_1 from '../../../assets/images/icons/map_marker_importance_1.png';
import map_marker_importance_2 from '../../../assets/images/icons/map_marker_importance_2.png';
import map_marker_importance_3 from '../../../assets/images/icons/map_marker_importance_3.png';
import map_marker_importance_1_selected from '../../../assets/images/icons/map_marker_importance_1_selected.png';
import map_marker_importance_2_selected from '../../../assets/images/icons/map_marker_importance_2_selected.png';
import map_marker_importance_3_selected from '../../../assets/images/icons/map_marker_importance_3_selected.png';
import {IMarker} from '../../../shared/interfaces/IMarker';
import {useTabMapStore} from '../../../zustand/TabMapStore';
import MapServices from '../services/MapServices';
import {useUserStore} from '../../../zustand/UserStore';

export function MarkerComponent({id, coordinates, importance}: IMarker) {
  const setMarkerSelected = useTabMapStore(state => state.setMarkerSelected);
  const language = useUserStore(state => state.user.language);
  const setPlace = useTabMapStore(state => state.setPlace);
  const setMediasOfPlace = useTabMapStore(state => state.setMediasOfPlace);
  const markerSelected = useTabMapStore(state => state.tabMap.markerSelected);
  const lastMarkerSelected = useTabMapStore(
    state => state.tabMap.lastMarkerSelected,
  );
  const [icon, setIcon] = useState(map_marker_importance_1);
  const dimensions = 50;
  const chooseIcon = () => {
    const selected = markerSelected === id;
    switch (importance) {
      case 1:
        setIcon(
          selected ? map_marker_importance_1_selected : map_marker_importance_1,
        );
        break;
      case 2:
        setIcon(
          selected ? map_marker_importance_2_selected : map_marker_importance_2,
        );
        break;
      case 3:
        setIcon(
          selected ? map_marker_importance_3_selected : map_marker_importance_3,
        );
        break;
      default:
        setIcon(
          selected ? map_marker_importance_1_selected : map_marker_importance_1,
        );
        break;
    }
  };

  useEffect(() => {
    if (markerSelected === id || lastMarkerSelected === id) {
      chooseIcon();
    }
  }, [markerSelected, lastMarkerSelected]);

  useEffect(() => {
    chooseIcon();
  }, []);

  return (
    <MarkerView id={id} key={id} coordinate={coordinates}>
      <TouchableOpacity
        onPress={async () => {
          const placeData = await MapServices.getPlaceInfo(id, 'map', language);
          setPlace(placeData);
          setMarkerSelected(id);
          const mediasFetched = await MapServices.getPlaceMedia(id, language);
          setMediasOfPlace(mediasFetched);
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
