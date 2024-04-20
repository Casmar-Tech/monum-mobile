/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect, useState} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import IUser from '../../../shared/interfaces/IUser';
import {useMutation, useQuery} from '@apollo/client';
import {
  GET_USER_BY_ID,
  UPDATE_USER,
} from '../../../graphql/queries/userQueries';
import {t, changeLanguage} from 'i18next';
import ProfilePhotoComponent from '../components/ProfilePhoto';
import LanguageSelector from '../components/LanguageSelector';
import NameInput from '../components/NameInput';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import LoadingSpinner from '../../../shared/components/LoadingSpinner';
import ErrorComponent from '../../../shared/components/ErrorComponent';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Language} from '../../../shared/types/Language';
import client from '../../../graphql/connection';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {useUserStore} from '../../../zustand/UserStore';
import {useMainStore} from '../../../zustand/MainStore';
import {useTabMapStore} from '../../../zustand/TabMapStore';
import {useTabRouteStore} from '../../../zustand/TabRouteStore';
import GoogleAuthService from '../../../auth/services/GoogleAuthService';
import {BOTTOM_TAB_NAVIGATOR_HEIGHT} from '../../BottomTabNavigator';

type Props = {
  navigation: any;
};

export default function ProfileScreen({navigation}: Props) {
  const onRetry = useQuery(GET_USER_BY_ID);
  const safeArea = useSafeAreaInsets();
  const user = useUserStore(state => state.user);
  const {permissions} = user;
  const hasPermissionToUpdateUser = permissions?.some(
    permission =>
      permission.action.includes('update') && permission.entity === 'user',
  );
  const applicationLanguage = useUserStore(state => state.user.language);
  const setLanguage = useUserStore(state => state.setLanguage);
  const removeAuthToken = useUserStore(state => state.removeAuthToken);
  const updatePhoto = useUserStore(state => state.updatePhoto);
  const updateUsername = useUserStore(state => state.updateUsername);
  const setUser = useUserStore(state => state.setUser);

  const [provisionalUser, setProvisionalUser] = useState<IUser>(user);
  const [provisionalLanguage, setProvisionalLanguage] =
    useState<Language>(applicationLanguage);

  const setDefaultUser = useUserStore(state => state.setDefaultUser);
  const setDefaultMain = useMainStore(state => state.setDefaultMain);
  const setDefaultTabMap = useTabMapStore(state => state.setDefaultTabMap);
  const setDefaultTabRoute = useTabRouteStore(
    state => state.setDefaultTabRoute,
  );

  const [photoBase64, setPhotoBase64] = useState<string | undefined>(undefined);

  const {data, loading, error} = useQuery(GET_USER_BY_ID, {
    skip: !!user,
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
      setUser(data.user);
    }
  }, [data]);

  useEffect(() => {
    if (dataUpdated?.updateUser?.photo) {
      updatePhoto(dataUpdated.updateUser.photo);
    }
  }, [dataUpdated]);

  const handleUpdatePress = async () => {
    try {
      if (
        hasPermissionToUpdateUser &&
        provisionalUser.username !== user.username
      ) {
        await updateUser({
          variables: {
            updateUserInput: {
              id: provisionalUser.id,
              username: provisionalUser.username,
            },
          },
        });
        provisionalUser.username && updateUsername(provisionalUser.username);
      }

      await updateUser({
        variables: {
          updateUserInput: {
            id: provisionalUser.id,
            language: provisionalLanguage,
          },
        },
      });
      setLanguage(provisionalLanguage);
      await changeLanguage(provisionalLanguage);

      await client.resetStore();
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
    }
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

  if (loading) {
    return <LoadingSpinner />;
  }
  if (error) {
    return (
      <ErrorComponent
        errorMessage={t('profile.errorGetting')}
        onRetry={() => onRetry}
      />
    );
  }

  if (loadingUpdated) {
    return <LoadingSpinner />;
  }
  if (errorUpdated) {
    return (
      <ErrorComponent
        errorMessage={t('profile.errorUpdating')}
        onRetry={async () =>
          await updateUser({
            variables: {
              updateUserInput: {
                id: provisionalUser.id,
                username: provisionalUser.username,
              },
            },
          })
        }
      />
    );
  }
  return (
    <View style={[styles.page, {paddingTop: safeArea.top + 20}]}>
      <View style={styles.profilePhotoContainer}>
        <ProfilePhotoComponent
          url={user.photo}
          username={provisionalUser.username}
          setNewPhoto={newPhoto => setPhotoBase64(newPhoto)}
        />
      </View>
      <View style={styles.inputsContainer}>
        {provisionalUser.username && (
          <NameInput
            labelText={labelText('username')}
            value={provisionalUser.username}
            setValue={(newUsername: string) => {
              setProvisionalUser(prevUser => ({
                ...prevUser,
                username: newUsername,
              }));
            }}
          />
        )}
        <LanguageSelector setProvisionalLanguage={setProvisionalLanguage} />
      </View>
      <View style={styles.updateButtonContainer}>
        {user.hasPassword && hasPermissionToUpdateUser && (
          <SecondaryButton
            text={t('profile.changePassword')}
            onPress={() => {
              navigation.navigate('ProfileUpdatePassword');
            }}
            style={{marginTop: 20}}
          />
        )}
        <PrimaryButton text={t('profile.update')} onPress={handleUpdatePress} />

        {user.username && user.email && (
          <Text style={styles.textCreatedAt}>{`${t(
            'profile.createdAt',
          )} ${new Date(provisionalUser.createdAt).toLocaleDateString(
            applicationLanguage.replace('_', '-') || 'en-US',
            {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            },
          )}`}</Text>
        )}
      </View>
      <View
        style={[
          styles.logoutButtonContainer,
          {
            bottom: safeArea.bottom + BOTTOM_TAB_NAVIGATOR_HEIGHT,
          },
        ]}>
        <SecondaryButton
          text={
            user.username && user.email
              ? t('profile.logout')
              : t('profile.createMyAccount')
          }
          onPress={async () => {
            (await GoogleSignin.isSignedIn()) && (await GoogleSignin.signOut());
            await GoogleAuthService.configureGoogleSignIn();
            await removeAuthToken();
            setDefaultUser();
            setDefaultMain();
            setDefaultTabMap();
            setDefaultTabRoute();
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
