/* eslint-disable no-unused-vars */
import React, {Component} from 'react';
import {AsyncStorage} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import LoginStack from './screens_stack/loginStack';
import Loading from './screens_stack/loading_screen';
import MyTabs from './TabBar';

const Tab = createBottomTabNavigator();

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      refreshToken: '',
      accessToken: null,
    };
  }
  async getToken() {
    try {
      let userData = await AsyncStorage.getItem('userToken');
      this.setState({accessToken: userData});
      console.log('token in app.js: ' + userData);
    } catch (error) {
      console.log('Something went wrong', error);
    }
  }
  componentDidMount() {
    //  this.getToken();
    setTimeout(() => {
      //  this._retrieveData();
      this.setState({isLoading: false});
    }, 2500);
  }
  render() {
    if (this.state.isLoading) {
      return <Loading />;
    }
    return <NavigationContainer>{<LoginStack />}</NavigationContainer>;
  }
}
