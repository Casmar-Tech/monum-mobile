import appleAuth, {
  AppleAuthCredentialState,
  AppleAuthRequestOperation,
  AppleAuthRequestScope,
} from '@invertase/react-native-apple-authentication';
import AuthServices from './AuthServices';

class AppleAuthService {
  public async signInWithApple() {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: AppleAuthRequestOperation.LOGIN,
        requestedScopes: [
          AppleAuthRequestScope.EMAIL,
          AppleAuthRequestScope.FULL_NAME,
        ],
      });

      const credentialState = await appleAuth.getCredentialStateForUser(
        appleAuthRequestResponse.user,
      );

      if (credentialState === AppleAuthCredentialState.REVOKED) {
        console.log('Apple Auth Revoked');
        return null;
      } else if (credentialState === AppleAuthCredentialState.NOT_FOUND) {
        console.log('Apple Auth Not Found');
        return null;
      } else if (credentialState === AppleAuthCredentialState.AUTHORIZED) {
        console.log('Apple Auth Authorized');
        return AuthServices.loginWithApple(appleAuthRequestResponse);
      }
    } catch (error) {
      console.error('ERROR WHEN LOGGING IN WITH APPLE', error);
    }
  }
}

export default new AppleAuthService();
