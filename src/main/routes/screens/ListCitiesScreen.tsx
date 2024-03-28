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
import {ListCitiesScreenProps} from '../navigator/RoutesNavigator';
import ListCityPill from '../components/ListCityPill';
import {useTabRouteStore} from '../../../zustand/TabRouteStore';
import {useUserStore} from '../../../zustand/UserStore';

export default function ListCitiesScreen({navigation}: ListCitiesScreenProps) {
  const setCity = useTabRouteStore(state => state.setCity);
  const safeAreaInsets = useSafeAreaInsets();
  const [textSearch, setTextSearch] = useState<string | undefined>(undefined);
  const [cities, setCities] = useState<ICity[]>([]);
  const language = useUserStore(state => state.user.language);

  const {loading, error, data, refetch} = useQuery(GET_CITIES, {
    variables: {textSearch: textSearch || '', language},
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
                  onPress={() => {
                    setCity(city);
                    navigation.navigate('ListRoutes');
                  }}
                  cityName={city.name}
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
