/**
 * Created by Andy Wooller on 25/09/2017.
 * Entry point into the App
 * is called from index.android.js and index.ios.js
 */

import React from 'react'; // eslint-disable-line
import { Provider } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import settings from './config/settings';
import configureStore from './config/store';
import { registerScreens } from './config/routes';
const store = configureStore();
registerScreens(store, Provider);

Navigation.startSingleScreenApp({
    appStyle: {
        keepStyleAcrossPush: false
    },
    screen: {
        screen: 'reactNativeTemplate.firstScreenName',
        title: 'First Screen'
    }
});