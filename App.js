/* eslint-disable no-unused-vars */
import React, {Component} from 'react';
import {AsyncStorage} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import LoginStack from './screens_stack/loginStack';
import Loading from './screens_stack/loading_screen';
import _RefreshToken from './components/refresh_Token';
import * as nativeBase from 'native-base';

export default class App extends Component {
  render() {
    return (
      <nativeBase.Root>
        <NavigationContainer>{<LoginStack />}</NavigationContainer>
      </nativeBase.Root>
    );
  }
}
