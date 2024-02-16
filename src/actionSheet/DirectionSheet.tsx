import {t} from 'i18next';
import {useEffect, useState} from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ActionSheet, {SheetProps} from 'react-native-actions-sheet';
import {getApps, GetAppResult} from 'react-native-map-link';

export default function DirectionSheet(
  props: SheetProps<{coordinates: {lat: number; lng: number}; label: string}>,
) {
  const [availableApps, setAvailableApps] = useState<GetAppResult[]>([]);

  useEffect(() => {
    (async () => {
      const result = await getApps({
        latitude: props.payload?.coordinates.lat!,
        longitude: props.payload?.coordinates.lng!,
        title: props.payload?.label,
        googleForceLatLon: false, // optionally force GoogleMaps to use the latlon for the query instead of the title
        alwaysIncludeGoogle: true, // optional, true will always add Google Maps to iOS and open in Safari, even if app is not installed (default: false)
        appsWhiteList: ['google-maps'], // optionally you can set which apps to show (default: will show all supported apps installed on device)
      });
      setAvailableApps(result);
    })();
  });
  return (
    <ActionSheet id={props.sheetId}>
      <View
        style={{
          padding: 20,
          borderRadius: 20,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View style={{marginBottom: 20}}>
          <Text style={styles.titleText}>
            {t('actionSheets.directionSheet.title')}
          </Text>
        </View>
        {availableApps.map(({icon, name, id, open}) => (
          <TouchableOpacity key={id} onPress={open}>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                alignItems: 'center',
              }}>
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 20,
                  marginRight: 10,
                  backgroundColor: '#ECF3EC',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image source={icon} style={{width: 16, height: 16}} />
              </View>
              <Text style={styles.text}>{name}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ActionSheet>
  );
}

const styles = StyleSheet.create({
  titleText: {
    fontSize: 16,
    fontFamily:
      Platform.OS === 'android' ? 'Montserrat-SemiBold' : 'Montserrat',
    fontWeight: '600',
    color: 'black',
  },
  text: {
    fontSize: 14,
    fontFamily: Platform.OS === 'android' ? 'Montserrat-Regular' : 'Montserrat',
    color: 'black',
  },
});
