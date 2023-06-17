/**
 * @format
 */

import { AppRegistry } from 'react-native';
import Navigation from './src/navigation/Navigation.js';
import 'react-native-get-random-values';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => Navigation);
