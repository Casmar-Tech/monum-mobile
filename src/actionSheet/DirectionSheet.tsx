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
import {getApps, GetAppsResponse} from 'react-native-map-link';

export default function DirectionSheet(props: SheetProps<'direction-sheet'>) {
  const [availableApps, setAvailableApps] = useState<GetAppsResponse[]>([]);

  useEffect(() => {
    (async () => {
      const result = await getApps({
        latitude: props.payload?.coordinates.lat!,
        longitude: props.payload?.coordinates.lng!,
        title: props.payload?.label,
        googleForceLatLon: false,
        alwaysIncludeGoogle: true,
        appsWhiteList: [
          'google-maps',
          'apple-maps',
          'waze',
          'uber',
          'citymapper',
        ],
      });
      setAvailableApps(result);
    })();
  });
  return (
    <ActionSheet id={props.sheetId}>
      <View style={styles.container}>
        <View>
          <Text style={styles.titleText}>
            {t('actionSheets.directionSheet.title')}
          </Text>
        </View>
        {availableApps.map(({icon, name, id, open}) => (
          <TouchableOpacity key={id} onPress={open}>
            <View style={styles.availableAppsContainer}>
              <View style={styles.availableAppsIconContainer}>
                <Image source={icon} style={styles.availableAppsIcon} />
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
  container: {
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  availableAppsContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  availableAppsIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#ECF3EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  availableAppsIcon: {
    width: 16,
    height: 16,
  },
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
