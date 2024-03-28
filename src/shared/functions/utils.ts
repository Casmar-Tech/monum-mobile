import {Language} from '../types/Language';

export default function deviceLanguageToLanguage(
  deviceLanguage: string,
): Language {
  switch (deviceLanguage) {
    case 'es':
      return 'es_ES';
    case 'ca':
      return 'ca_ES';
    case 'fr':
      return 'fr_FR';
    case 'en':
      return 'en_US';
    default:
      return 'en_US';
  }
}
