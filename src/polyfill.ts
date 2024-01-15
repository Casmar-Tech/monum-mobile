import 'intl';
import 'intl-pluralrules';
import {Platform} from 'react-native';

if (typeof window !== 'undefined') {
  if (Platform.OS === 'android' || Platform.OS === 'ios') {
    require('intl/locale-data/jsonp/en.js');
    require('intl/locale-data/jsonp/es.js');
  } else {
    global.Intl = require('intl');
  }
} else {
  global.Intl = require('intl');
}
