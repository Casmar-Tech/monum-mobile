import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {useQuery} from '@apollo/client';
import TextSearch from '../components/TextSearch';
import {t} from 'i18next';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {GET_CITIES} from '../../../graphql/queries/routeQueries';
import LoadingSpinner from '../../../shared/components/LoadingSpinner';
import ErrorComponent from '../../../shared/components/ErrorComponent';
import ICity from '../../../shared/interfaces/ICity';
import {useUserStore} from '../../../zustand/UserStore';
import {StackNavigationProp} from '@react-navigation/stack';
import {RoutesStackParamList} from '../navigator/RoutesNavigator';
import ListCityPill from '../components/ListCityPill';

type ListCitiesScreenNavigationProp = StackNavigationProp<
  RoutesStackParamList,
  'ListCities'
>;

type Props = {
  navigation: ListCitiesScreenNavigationProp;
};

export default function ListCitiesScreen({navigation}: Props) {
  const safeAreaInsets = useSafeAreaInsets();
  const user = useUserStore(state => state.user);
  const [textSearch, setTextSearch] = useState<string | undefined>(undefined);
  const [cities, setCities] = useState<ICity[]>([]);
  const {loading, error, data, refetch} = useQuery(GET_CITIES, {
    variables: {textSearch: textSearch || ''},
  });

  useEffect(() => {
    async function fetchCities() {
      const response = await refetch();
      if (response.data && response.data.cities) {
        setCities(response.data?.cities || []);
      }
    }
    fetchCities();
  }, [textSearch, refetch]);

  return (
    <View style={styles.page}>
      <View style={styles.contentContainer}>
        <TextSearch
          setTextSearch={setTextSearch}
          textSearch={textSearch}
          style={{paddingHorizontal: 15, marginTop: 60}}
        />
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorComponent
            errorMessage={t('routes.errorGettingAvailableCities')}
            onRetry={() => refetch()}
          />
        ) : (
          <View style={{flex: 1, width: '100%'}}>
            <ScrollView
              scrollEventThrottle={16}
              style={{
                width: '100%',
                marginBottom: safeAreaInsets.bottom + 30,
                marginTop: 15,
              }}
              showsVerticalScrollIndicator={false}>
              {cities.map((city, i) => (
                <ListCityPill
                  key={i}
                  onPress={() => navigation.navigate('ListRoutes', {city})}
                  cityName={city.translations[user.language] || ''}
                  imageUrl={city.imageUrl}
                />
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
});
