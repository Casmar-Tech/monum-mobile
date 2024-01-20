import AsyncStorage from '@react-native-async-storage/async-storage';
import client from '../../graphql/connection';
import IUser from '../../shared/interfaces/IUser';
import {
  LOGIN_GOOGLE_USER,
  LOGIN_USER,
  REGISTER_USER,
} from '../../graphql/queries/userQueries';
import Config from 'react-native-config';

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
      const BASE_URL = Config.API_URL;
      console.log('BASE_URL', BASE_URL);
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
            language: 'en-US',
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

  public async logout() {
    await this.removeAuthToken();
    // Add other steps required for logout, such as clearing the application state
  }

  public async isAuthenticated(): Promise<boolean> {
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      return !!authToken; // Verify if an authentication token exists.
    } catch (error) {
      console.error('Error al verificar la autenticación:', error);
      return false;
    }
  }
}

export default new AuthService();
