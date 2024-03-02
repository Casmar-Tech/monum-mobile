/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import IUser from '../../../shared/interfaces/IUser';
import {useMutation, useQuery} from '@apollo/client';
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
import {Language} from '../../../shared/types/Language';
import client from '../../../graphql/connection';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {undefinedUser, useUserStore} from '../../../zustand/UserStore';
import {useMainStore} from '../../../zustand/MainStore';

const BOTTOM_TAB_NAVIGATOR_HEIGHT = 56;

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
  const applicationLanguage = useMainStore(state => state.main.language);
  const setApplicationLanguage = useMainStore(state => state.setLanguage);
  const removeAuthToken = useUserStore(state => state.removeAuthToken);
  const setUser = useUserStore(state => state.setUser);

  const [provisionalUser, setProvisionalUser] = useState<IUser>(user);
  const [provisionalLanguage, setProvisionalLanguage] =
    useState<Language>(applicationLanguage);

  const [photoBase64, setPhotoBase64] = useState<string | undefined>(undefined);

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
      setUser(data.user);
    }
  }, [data, setProvisionalUser]);

  useEffect(() => {
    if (dataUpdated && dataUpdated.updateUser) {
      setProvisionalUser(user);
      setUser(dataUpdated.updateUser);
    }
  }, [dataUpdated, setProvisionalUser]);

  const handleUpdatePress = async () => {
    try {
      hasPermissionToUpdateUser &&
        (await updateUser({
          variables: {
            updateUserInput: {
              id: provisionalUser.id,
              username: provisionalUser.username,
            },
          },
        }));

      setApplicationLanguage(provisionalLanguage);

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
          setNewPhoto={photoBase64 => setPhotoBase64(photoBase64)}
        />
      </View>
      <View style={styles.inputsContainer}>
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
        <LanguageSelector
          language={applicationLanguage}
          setProvisionalLanguage={setProvisionalLanguage}
        />
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
      </View>
      <View
        style={[
          styles.logoutButtonContainer,
          {
            bottom: safeArea.bottom + BOTTOM_TAB_NAVIGATOR_HEIGHT,
          },
        ]}>
        <SecondaryButton
          text={t('profile.logout')}
          onPress={async () => {
            (await GoogleSignin.isSignedIn()) && (await GoogleSignin.signOut());
            setUser(undefinedUser);
            removeAuthToken();
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
