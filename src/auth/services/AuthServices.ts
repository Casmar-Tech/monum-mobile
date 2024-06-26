import AsyncStorage from '@react-native-async-storage/async-storage';
import client from '../../graphql/connection';
import IUser from '../../shared/interfaces/IUser';
import {
  LOGIN_GOOGLE_USER,
  LOGIN_USER,
  REGISTER_USER,
  RESET_PASSWORD,
  VERIFICATE_CODE,
  UPDATE_PASSWORD_WITHOUT_OLD_PASSWORD,
  LOGIN_USER_AS_GUEST,
  LOGIN_APPLE_USER,
} from '../../graphql/queries/userQueries';
import {getDeviceId} from 'react-native-device-info';
import {getLocales} from 'react-native-localize';
import deviceLanguageToLanguage from '../../shared/functions/utils';
import {AppleAuthRequestResponse} from '@invertase/react-native-apple-authentication';

interface LoginGoogle {
  email: string;
  photo: string | null;
  name: string | null;
  id: string;
}

class AuthService {
  async setAuthToken(token: string) {
    try {
      await AsyncStorage.setItem('authToken', token);
    } catch (error) {
      console.error('Error al guardar el token de autenticación:', error);
    }
  }

  private async removeAuthToken() {
    try {
      await AsyncStorage.removeItem('authToken');
    } catch (error) {
      console.error('Error al eliminar el token de autenticación:', error);
    }
  }

  public async signup(email: string, password: string): Promise<IUser | null> {
    try {
      const response = await client.mutate({
        mutation: REGISTER_USER,
        variables: {registerInput: {email, password}},
      });
      const user = response.data?.registerUser;
      return user;
    } catch (error: any) {
      console.error('Error al realizar el registro de usuario', error);
      throw new Error(error?.graphQLErrors[0]?.extensions?.code || 'RANDOM');
    }
  }

  public async login(
    emailOrUsername: string,
    password: string,
  ): Promise<IUser | null> {
    try {
      const response = await client.mutate({
        mutation: LOGIN_USER,
        variables: {loginInput: {emailOrUsername, password}},
      });
      const user = response.data?.loginUser;
      return user;
    } catch (error: any) {
      console.log(
        'Error al realizar el inicio de sesión:',
        JSON.stringify(error),
      );
      throw new Error(error?.graphQLErrors[0]?.extensions?.code || 'RANDOM');
    }
  }

  public async loginWithGoogle({
    email,
    photo,
    name,
    id,
  }: LoginGoogle): Promise<IUser | null> {
    try {
      const response = await client.mutate({
        mutation: LOGIN_GOOGLE_USER,
        variables: {
          loginGoogleInput: {
            email,
            googleId: id,
            name,
            photo,
          },
        },
      });
      const user = response.data?.loginGoogleUser;
      return user;
    } catch (error) {
      console.error('Error al realizar el inicio de sesión:', error);
      return null;
    }
  }

  public async loginWithApple({
    nonce,
    user,
    fullName,
    identityToken,
    email,
  }: AppleAuthRequestResponse): Promise<IUser | null> {
    try {
      const deviceLanguage = getLocales()[0].languageCode;
      const language = deviceLanguageToLanguage(deviceLanguage);
      const name =
        fullName && fullName.givenName
          ? `${fullName?.givenName} ${fullName?.familyName}`
          : null;
      const response = await client.mutate({
        mutation: LOGIN_APPLE_USER,
        variables: {
          loginAppleInput: {
            nonce,
            user,
            name,
            identityToken,
            email,
            language,
          },
        },
      });
      const userResponse = response.data?.loginAppleUser;
      return userResponse;
    } catch (error) {
      console.error('Error al realizar el inicio de sesión:', error);
      return null;
    }
  }

  public async loginAsGuest() {
    try {
      const deviceId = getDeviceId();
      const deviceLanguage = getLocales()[0].languageCode;
      const language = deviceLanguageToLanguage(deviceLanguage);
      const response = await client.mutate({
        mutation: LOGIN_USER_AS_GUEST,
        variables: {
          deviceId,
          language,
        },
      });
      const user = response.data?.loginUserAsGuest;
      return user;
    } catch (error: any) {
      console.error('Error al iniciar sesión como invitado:', error);
    }
  }

  public async resetPassword(email: string, resend: boolean = false) {
    try {
      const response = await client.mutate({
        mutation: RESET_PASSWORD,
        variables: {
          resetPasswordInput: {
            email,
            resend,
          },
        },
      });
      const resetPassword = response.data?.resetPassword;
      return resetPassword;
    } catch (error: any) {
      console.log('Error al reiniciar la contraseña:', JSON.stringify(error));
      throw new Error(error?.graphQLErrors[0]?.extensions?.code || 'RANDOM');
    }
  }

  public async verificateCode(email: string, code: string) {
    try {
      const response = await client.mutate({
        mutation: VERIFICATE_CODE,
        variables: {
          verificateCodeInput: {
            code,
            email,
          },
        },
      });
      const verificateCode = response.data?.verificateCode;
      return verificateCode;
    } catch (error: any) {
      console.log('Error al verificar el código:', JSON.stringify(error));
      throw new Error(error?.graphQLErrors[0]?.extensions?.code || 'RANDOM');
    }
  }

  public async updatePassword(newPassword: string, token: string) {
    try {
      const response = await client.mutate({
        mutation: UPDATE_PASSWORD_WITHOUT_OLD_PASSWORD,
        variables: {
          updatePasswordWithoutOldInput: {
            newPassword,
            token,
          },
        },
      });
      const updatePasswordWithoutOld = response.data?.updatePasswordWithoutOld;
      return updatePasswordWithoutOld;
    } catch (error: any) {
      console.log('Error al verificar el código:', JSON.stringify(error));
      throw new Error(error?.graphQLErrors[0]?.extensions?.code || 'RANDOM');
    }
  }

  public async logout() {
    try {
      await this.removeAuthToken();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }

  public async isAuthenticated(): Promise<boolean> {
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      return !!authToken;
    } catch (error) {
      console.error('Error al verificar la autenticación:', error);
      return false;
    }
  }

  public validateEmail(email: string) {
    var re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
}

export default new AuthService();
