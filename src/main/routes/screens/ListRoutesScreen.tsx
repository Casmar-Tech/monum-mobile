/* eslint-disable react-hooks/exhaustive-deps */
import {ScrollView, View, StyleSheet} from 'react-native';
import {ListRoutesScreenProps} from '../navigator/RoutesNavigator';
import {useQuery} from '@apollo/client';
import {GET_ROUTES_OF_CITY} from '../../../graphql/queries/routeQueries';
import {useEffect, useState} from 'react';
import IRouteOfCity from '../../../shared/interfaces/IRouteOfCity';
import DetailCityPill from '../components/DetailCityPill';
import TextSearch from '../components/TextSearch';
import LoadingSpinner from '../../../shared/components/LoadingSpinner';
import ErrorComponent from '../../../shared/components/ErrorComponent';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import ListRoutePill from '../components/ListRoutePill';
import {useTabRouteStore} from '../../../zustand/TabRouteStore';
import {useUserStore} from '../../../zustand/UserStore';
import {useTranslation} from 'react-i18next';

export default function ListRoutesScreen({navigation}: ListRoutesScreenProps) {
  const {t} = useTranslation();
  const city = useTabRouteStore(state => state.city);
  const setRouteOfCity = useTabRouteStore(state => state.setRouteOfCity);
  const safeAreaInsets = useSafeAreaInsets();
  const language = useUserStore(state => state.user.language);
  const [routes, setRoutes] = useState<IRouteOfCity[]>([]);
  const [textSearch, setTextSearch] = useState<string | undefined>(undefined);

  const {loading, error, data, refetch} = useQuery(GET_ROUTES_OF_CITY, {
    variables: {
      cityId: city.id,
      textSearch: textSearch || '',
      language: language,
    },
  });

  useEffect(() => {
    async function fetchRoutes() {
      try {
        const response = await refetch();
        if (response.data && response.data.routes) {
          setRoutes(response.data.routes);
        }
      } catch (error) {
        console.error('Error fetching routes:', error);
      }
    }
    fetchRoutes();
  }, [setRoutes]);
  return (
    <SafeAreaView style={styles.page}>
      <DetailCityPill
        cityName={city.name}
        imageUrl={city.imageUrl}
        onPress={() => navigation.navigate('ListCities')}
      />
      <View style={styles.contentContainer}>
        <TextSearch
          setTextSearch={setTextSearch}
          textSearch={textSearch}
          style={{marginTop: 15, paddingHorizontal: 15}}
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
                backgroundColor: 'white',
              }}
              showsVerticalScrollIndicator={false}>
              {routes.map((route, i) => (
                <ListRoutePill
                  route={route}
                  key={i}
                  onPress={() => {
                    setRouteOfCity(route);
                    navigation.navigate('RouteDetail');
                  }}
                />
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    width: '100%',
  },
});
