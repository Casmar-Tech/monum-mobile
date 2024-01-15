import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, SafeAreaView} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../redux/store';
import IUser from '../../../shared/interfaces/IUser';
import {useMutation, useQuery} from '@apollo/client';
import {removeAuthToken, setUser} from '../../../redux/states/user';
import {
  GET_USER_BY_ID,
  UPDATE_USER,
} from '../../../graphql/queries/userQueries';
import {t} from 'i18next';
import ProfilePhotoComponent from '../components/ProfilePhoto';
import LanguageSelector from '../components/LanguageSelector';
import NameInput from '../components/NameInput';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import LoadingSpinner from '../../../shared/components/LoadingSpinner';
import ErrorComponent from '../../../shared/components/ErrorComponent';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../../auth/navigator/AuthNavigator';
import {Language} from '../../../shared/types/Language';

const BOTTOM_TAB_NAVIGATOR_HEIGHT = 56;

type Props = {
  navigation: any;
};

export default function ProfileScreen({navigation}: Props) {
  const dispatch = useDispatch();
  // Acceder al estado global para ver si 'user' ya existe
  const user = useSelector((state: RootState) => state.user);
  const [provisionalUser, setProvisionalUser] = useState<IUser>(user);

  const [photoBase64, setPhotoBase64] = useState<string | undefined>(undefined);

  // Realizar la consulta GraphQL si 'user' no existe
  const {data, loading, error} = useQuery(GET_USER_BY_ID, {
    skip: !!user, // Si 'user' ya existe, omitimos la consulta
  });

  const [
    updateUser,
    {data: dataUpdated, loading: loadingUpdated, error: errorUpdated},
  ] = useMutation(UPDATE_USER);

  // Actualizar el usuario si cambia la foto de perfil
  useEffect(() => {
    if (photoBase64) {
      updateUser({
        variables: {
          updateUserInput: {
            id: provisionalUser.id,
            photoBase64,
          },
        },
      });
    }
  }, [photoBase64]);

  useEffect(() => {
    if (user) {
      setProvisionalUser(user);
    }
  }, [user]);

  useEffect(() => {
    if (data && data.user) {
      // Guardar el usuario en el estado global si obtenemos data desde GraphQL
      dispatch(setUser(data.user));
    }
  }, [data, dispatch, setProvisionalUser]);

  useEffect(() => {
    if (dataUpdated && dataUpdated.updateUser) {
      setProvisionalUser(user);
      // Guardar el usuario en el estado global si obtenemos data desde GraphQL
      dispatch(setUser(dataUpdated.updateUser));
    }
  }, [dataUpdated, dispatch, setProvisionalUser]);

  const handleUpdateUsername = (newUsername: string) => {
    setProvisionalUser(prevUser => ({...prevUser, username: newUsername}));
  };

  const handleUpdateLanguage = (newLanguage: Language) => {
    setProvisionalUser(prevUser => ({
      ...prevUser,
      language: newLanguage,
    }));
  };

  const labelText = (userParam: string) => {
    switch (userParam) {
      case 'username':
        return t('authScreens.username');
      case 'language':
        return t('profile.language');
      default:
        return t('authScreens.username');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <ErrorComponent
        errorMessage={t('profile.errorGetting')}
        onRetry={() => useQuery(GET_USER_BY_ID)}
      />
    );

  if (loadingUpdated) return <LoadingSpinner />;
  if (errorUpdated)
    return (
      <ErrorComponent
        errorMessage={t('profile.errorUpdating')}
        onRetry={async () =>
          await updateUser({
            variables: {
              updateUserInput: {
                id: provisionalUser.id,
                username: provisionalUser.username,
                language: provisionalUser.language,
              },
            },
          })
        }
      />
    );

  return (
    <View style={[styles.page, {paddingTop: useSafeAreaInsets().top + 20}]}>
      <View style={styles.profilePhotoContainer}>
        <ProfilePhotoComponent
          url={user.photo}
          username={provisionalUser.username}
          setNewPhoto={photoBase64 => setPhotoBase64(photoBase64)}
        />
      </View>
      <View style={styles.inputsContainer}>
        <NameInput
          labelText={labelText('username')}
          value={provisionalUser.username}
          setValue={handleUpdateUsername}
        />
        <LanguageSelector
          language={user.language}
          setLanguage={handleUpdateLanguage}
        />
      </View>
      <View style={styles.updateButtonContainer}>
        {user.hasPassword && (
          <SecondaryButton
            text={t('profile.changePassword')}
            onPress={() => {
              navigation.navigate('ChangePassword');
            }}
            style={{marginTop: 20}}
          />
        )}
        <PrimaryButton
          text={t('profile.update')}
          onPress={async () => {
            return await updateUser({
              variables: {
                updateUserInput: {
                  id: provisionalUser.id,
                  username: provisionalUser.username,
                  language: provisionalUser.language,
                },
              },
            });
          }}
        />

        <Text style={styles.textCreatedAt}>{`${t(
          'profile.createdAt',
        )} ${new Date(provisionalUser.createdAt).toLocaleDateString(
          user?.language?.replace('_', '-') || 'en-US',
          {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          },
        )}`}</Text>
      </View>
      <View
        style={[
          styles.logoutButtonContainer,
          {
            bottom:
              useSafeAreaInsets().bottom + BOTTOM_TAB_NAVIGATOR_HEIGHT + 40,
          },
        ]}>
        <SecondaryButton
          text={t('profile.logout')}
          onPress={() => {
            dispatch(setUser(null));
            dispatch(removeAuthToken());
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: 'center',
    elevation: 0,
    backgroundColor: 'white',
  },
  profilePhotoContainer: {paddingVertical: '10%'},
  inputsContainer: {width: '100%', zIndex: 10},
  updateButtonContainer: {
    width: '100%',
    paddingHorizontal: 30,
  },
  textCreatedAt: {
    fontSize: 16,
    color: '#3F713B',
    fontFamily: 'Montserrat-Regular',
    textAlign: 'center',
  },
  logoutButtonContainer: {
    position: 'absolute',

    width: '100%',
    paddingHorizontal: 30,
  },
});
