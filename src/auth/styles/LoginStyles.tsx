import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
  },
  backgroundColor: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#3F713B', // Color de fondo con transparencia
  },
  background: {
    flex: 1,
    resizeMode: 'cover', // Ajusta la imagen para cubrir todo el fondo
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  logoContainer: {
    paddingTop: 50,
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 300,
  },
  buttonContainer: {
    flex: 8,
    width: '80%',
    height: '100%',
    alignItems: 'center',
  },
  primaryButton: {
    borderRadius: 24,
    height: 48,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#FFF172',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 10, // Solo para Android
    marginVertical: 36,
  },
  primaryButtonText: {
    fontSize: 18,
    color: '#032000',
    fontFamily: 'Montserrat-Regular',
  },
  secondaryButton: {
    borderColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 24,
    height: 48,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#3F713B',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5, // Solo para Android
  },
  secondaryButtonLogo: {
    position: 'absolute',
    left: 9,
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  secondaryButtonText: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'Montserrat-Regular',
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 30,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'white',
  },
  separatorCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 10,
    borderColor: 'white',
    borderWidth: 1,
  },
  inputButton: {
    paddingHorizontal: 15,
    borderColor: '#FFFFFF',
    color: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 12,
    height: 48,
    width: '100%',
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    backgroundColor: '#3F713B',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hidePasswordButton: {
    position: 'absolute',
    backgroundColor: '#3F713B',
    right: 10,
  },
  hidePasswordButtonIcon: {
    width: 20,
    margin: 5,
  },
  forgotPasswordButton: {
    marginRight: 'auto',
  },
  forgotPasswordText: {
    color: '#FFFFFF',
    fontSize: 12,
    textAlign: 'left',
    backgroundColor: '#3F713B',
    textDecorationLine: 'underline',
    fontFamily: 'Montserrat-Regular',
  },
  bottomContainer: {
    flex: 1,
  },
  registerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  registerText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: '#3F713B',
    fontFamily: 'Montserrat-Regular',
  },
  registerButtonText: {
    color: '#FFF172',
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: '#3F713B',
    textDecorationLine: 'underline',
    fontFamily: 'Montserrat-Regular',
  },
  companyContainer: {
    alignItems: 'center',
    marginTop: 6,
  },
  companyText: {
    color: '#FFFFFF',
    fontSize: 12,
    backgroundColor: '#3F713B',
    fontFamily: 'Montserrat-SemiBold',
  },
});
