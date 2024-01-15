import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

import AuthServices from './AuthServices';

class GoogleAuthService {
  public async configureGoogleSignIn() {
    GoogleSignin.configure({
      webClientId:
        '944908105248-u4k7dp5du3a3ahcg1u6a284u0mri26av.apps.googleusercontent.com',
    });
  }

  public async signInWithGoogle() {
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signIn();
      const currentUser = await GoogleSignin.getCurrentUser();
      if (!currentUser || !currentUser.idToken) {
        throw new Error('No se pudo obtener el usuario actual.');
      }
      const {email, name, id, photo} = currentUser.user;
      return AuthServices.loginWithGoogle({email, name, id, photo});
    } catch (error: any) {
      if (error?.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('Google login was cancelled');
      } else if (error?.code === statusCodes.IN_PROGRESS) {
        console.log('A login operation is already in progress');
      } else if (error?.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Google Play services are unavailable or out of date');
      } else {
        console.log('Error logging in with Google:', error);
      }
    }
  }

  // Otros métodos relacionados con el inicio de sesión con Google...
}

export default new GoogleAuthService();
