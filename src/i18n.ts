import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
// import {findBestAvailableLanguage} from 'react-native-localize';

// Importa los archivos de traducciones
import en_USTranslation from '../src/assets/translations/en_US/translations.json';
import es_ESTranslation from '../src/assets/translations/es_ES/translations.json';
import ca_ESTranslation from '../src/assets/translations/ca_ES/translations.json';
import fr_FRTranslation from '../src/assets/translations/fr_FR/translations.json';

// Configuración de i18next
export const setI18nConfig = () => {
  const fallbackLanguage = {languageTag: 'en_US', isRTL: false}; // Idioma por defecto

  const {languageTag} = {languageTag: 'es_ES'} || fallbackLanguage;

  i18n.use(initReactI18next).init({
    resources,
    lng: languageTag,
    fallbackLng: fallbackLanguage.languageTag,
    interpolation: {
      escapeValue: false,
    },
  });

  return i18n;
};

// Definición de los recursos de traducción
const resources = {
  en_US: {
    translation: en_USTranslation,
  },
  es_ES: {
    translation: es_ESTranslation,
  },
  ca_ES: {
    translation: ca_ESTranslation,
  },
  fr_FR: {
    translation: fr_FRTranslation,
  },
};

export default i18n;
