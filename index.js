/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {initReactI18next} from 'react-i18next';
import i18n from 'i18next';
import {setI18nConfig} from './src/i18n'; // Archivo de configuración de i18next
import {getLocales} from 'react-native-localize';
import './src/polyfill'; // Importa el archivo polyfill.js antes de i18next
import {PlaybackService} from './src/track-player/service';
import TrackPlayer from 'react-native-track-player';

// Configuración de i18next
i18n.use(initReactI18next).init(setI18nConfig());

// Configuración de react-native-localize
const {languageTag} = getLocales()[0];
i18n.changeLanguage(languageTag);

AppRegistry.registerComponent(appName, () => App);

TrackPlayer.registerPlaybackService(() => PlaybackService);
