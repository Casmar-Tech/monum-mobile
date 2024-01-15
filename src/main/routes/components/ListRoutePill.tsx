import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import IRouteOfCity from 'src/shared/interfaces/IRouteOfCity';
import {t} from 'i18next';
import RatingPill from './RatingPill';

interface ListRoutePillProps {
  route: IRouteOfCity;
  onPress?: () => void;
}

export default function ListRoutePill({route, onPress}: ListRoutePillProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{elevation: 5, paddingHorizontal: 12}}>
      <View style={styles.placeMediaPillContainer}>
        <View style={styles.placeMediaPill}>
          <Text style={styles.placeMediaPillTitle}>{route.title}</Text>
          <Text style={styles.placeMediaPillDuration}>
            {`${route.stopsCount} ${t('stops')}`}
          </Text>
        </View>
        <RatingPill
          number={route.rating || 0}
          additionalStyle={{position: 'absolute', top: 0, left: 10}}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  placeMediaPillContainer: {
    width: '100%',
    height: 70,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  placeMediaPill: {
    height: 50,
    borderRadius: 12,
    backgroundColor: 'white',
    elevation: 5,
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  placeMediaPillTitle: {
    fontSize: 14,
    color: '#032000',
    fontFamily: 'Montserrat-Regular',
  },
  placeMediaPillDuration: {
    fontSize: 10,
    color: '#032000',
    fontFamily: 'Montserrat-Regular',
  },
});
